const { Contract, Interface, JsonRpcProvider, getAddress, id } = require('ethers');
const fs = require('node:fs');
const path = require('node:path');
const { AGENT_ID_BSC } = require('../packages/sdk/index.cjs');

const GUARD_EVENTS = new Interface(['event ActionAuthorized(bytes32 indexed mandateId,address indexed issuer,address indexed executor,bytes32 action,bytes32 payloadHash,uint32 useNumber,uint256 counterAfter)']);
const REGISTRY_ABI = ['function balanceOf(address owner) view returns (uint256)'];
const EVENT_TOPIC = id('ActionAuthorized(bytes32,address,address,bytes32,bytes32,uint32,uint256)');
const DEFAULT_START = Math.floor(Date.parse('2026-11-18T08:00:00Z') / 1000);
const DEFAULT_END = Math.floor(Date.parse('2026-12-09T08:00:00Z') / 1000);

function parseArgs(args) {
  const values = {};
  for (let i = 0; i < args.length; i++) {
    if (!args[i].startsWith('--') || !args[i + 1]) throw new Error(`Expected --name value near ${args[i]}`);
    values[args[i].slice(2)] = args[++i];
  }
  return values;
}

async function retry(operation, attempts = 3) {
  let lastError;
  for (let i = 0; i < attempts; i++) {
    try { return await operation(); } catch (error) { lastError = error; if (i + 1 < attempts) await new Promise((resolve) => setTimeout(resolve, 100 * (2 ** i))); }
  }
  throw lastError;
}

async function getLogsPaged(provider, filter, fromBlock, toBlock, pageSize) {
  const logs = [];
  for (let start = fromBlock; start <= toBlock; start += pageSize) {
    const end = Math.min(toBlock, start + pageSize - 1);
    try { logs.push(...await retry(() => provider.getLogs({ ...filter, fromBlock: start, toBlock: end }))); }
    catch (error) {
      if (end === start) throw error;
      const midpoint = Math.floor((start + end) / 2);
      logs.push(...await getLogsPaged(provider, filter, start, midpoint, Math.max(1, Math.floor(pageSize / 2))));
      logs.push(...await getLogsPaged(provider, filter, midpoint + 1, end, Math.max(1, Math.floor(pageSize / 2))));
    }
  }
  return logs;
}

async function verifyInteraction(provider, receipt, { guardAddress, registryAddress, chainId, windowStart = DEFAULT_START, windowEnd = DEFAULT_END }) {
  const guard = getAddress(guardAddress);
  const registry = getAddress(registryAddress);
  if (!receipt || receipt.status !== 1) return { verified: false, reason: 'transaction_not_successful' };
  if (receipt.to?.toLowerCase() !== guard.toLowerCase()) return { verified: false, reason: 'transaction_targets_different_contract' };
  const log = receipt.logs.find((item) => item.address.toLowerCase() === guard.toLowerCase() && item.topics[0]?.toLowerCase() === EVENT_TOPIC.toLowerCase());
  if (!log) return { verified: false, reason: 'authorization_event_missing' };
  const event = GUARD_EVENTS.parseLog(log);
  const [tx, block] = await Promise.all([provider.getTransaction(receipt.hash), provider.getBlock(receipt.blockNumber)]);
  if (!tx || !block || block.hash.toLowerCase() !== receipt.blockHash.toLowerCase() || (log.blockHash && log.blockHash.toLowerCase() !== block.hash.toLowerCase())) return { verified: false, reason: 'receipt_block_not_canonical' };
  const inWindow = block.timestamp >= windowStart && block.timestamp < windowEnd;
  const sender = getAddress(tx.from);
  const issuer = getAddress(event.args.issuer);
  const executor = getAddress(event.args.executor);
  const registryContract = new Contract(registry, REGISTRY_ABI, provider);
  let identities;
  try {
    const atReceiptBlock = { blockTag: receipt.blockNumber };
    const [senderBalance, issuerBalance, executorBalance] = await Promise.all([
      registryContract.balanceOf(sender, atReceiptBlock), registryContract.balanceOf(issuer, atReceiptBlock), registryContract.balanceOf(executor, atReceiptBlock),
    ]);
    identities = { sender: BigInt(senderBalance) > 0n, issuer: BigInt(issuerBalance) > 0n, executor: BigInt(executorBalance) > 0n };
  } catch (error) {
    return { verified: true, counted: false, reason: 'historical_identity_read_unavailable', sender, issuer, executor, transactionHash: receipt.hash, blockNumber: receipt.blockNumber, timestamp: block.timestamp, error: error.shortMessage || error.message };
  }
  const direct = sender.toLowerCase() === executor.toLowerCase();
  const candidate = Number(chainId) === 56 && inWindow && direct && identities.sender && identities.issuer && identities.executor;
  return {
    verified: true,
    counted: candidate,
    reason: !inWindow ? 'outside_competition_window' : !direct ? 'relayer_or_delegated_sender_requires_organizer_review' : !identities.sender ? 'transaction_sender_not_agent_id_holder_at_receipt_block' : !identities.issuer ? 'issuer_not_agent_id_holder_at_receipt_block' : !identities.executor ? 'executor_not_agent_id_holder_at_receipt_block' : Number(chainId) !== 56 ? 'fixture_or_non_mainnet_activity' : 'mainnet_direct_holder_interaction_candidate',
    chainId: Number(chainId), transactionHash: receipt.hash, blockNumber: receipt.blockNumber, blockHash: receipt.blockHash,
    identityObservation: 'balanceOf read at the receipt block after block execution; not transaction-level pre-state',
    timestamp: block.timestamp, sender, issuer, executor, identities,
    event: { mandateId: event.args.mandateId, action: event.args.action, payloadHash: event.args.payloadHash, useNumber: Number(event.args.useNumber) },
    explorerUrl: Number(chainId) === 56 ? `https://bscscan.com/tx/${receipt.hash}` : null,
  };
}

async function scanActivity({ provider, guardAddress, registryAddress = AGENT_ID_BSC, deploymentBlock, toBlock, pageSize = 2000, confirmations = 15, chainId, windowStart = DEFAULT_START, windowEnd = DEFAULT_END }) {
  const network = await provider.getNetwork();
  const actualChainId = Number(network.chainId);
  if (chainId !== undefined && actualChainId !== Number(chainId)) throw new Error(`RPC chain ID ${actualChainId} did not match requested ${chainId}`);
  if (!Number.isSafeInteger(deploymentBlock) || deploymentBlock < 0) throw new TypeError('A non-negative deployment block is required');
  if (!Number.isSafeInteger(pageSize) || pageSize < 1 || !Number.isSafeInteger(confirmations) || confirmations < 0) throw new TypeError('pageSize and confirmations must be non-negative safe integers; pageSize must be positive');
  if (windowEnd <= windowStart) throw new TypeError('Competition window end must be after start');
  if (toBlock !== undefined && (!Number.isSafeInteger(Number(toBlock)) || Number(toBlock) < deploymentBlock)) throw new TypeError('toBlock must be a safe integer at or after deploymentBlock');
  const latest = Number(await provider.getBlockNumber());
  const finalizedEnd = toBlock === undefined ? Math.max(deploymentBlock, latest - confirmations) : Math.min(Number(toBlock), latest - confirmations);
  if (finalizedEnd < deploymentBlock) return { network: actualChainId, range: { from: deploymentBlock, to: finalizedEnd }, interactions: [], candidateAddresses: [], candidateCount: 0, qualifyingCount: 0, nextFromBlock: deploymentBlock, note: 'No sufficiently confirmed blocks after deployment yet.' };
  const guard = getAddress(guardAddress);
  const logs = await getLogsPaged(provider, { address: guard, topics: [EVENT_TOPIC] }, deploymentBlock, finalizedEnd, pageSize);
  const interactions = [];
  for (const log of logs) {
    const receipt = await retry(() => provider.getTransactionReceipt(log.transactionHash));
    if (!receipt) { interactions.push({ verified: false, counted: false, reason: 'transaction_receipt_unavailable', transactionHash: log.transactionHash }); continue; }
    interactions.push(await verifyInteraction(provider, receipt, { guardAddress: guard, registryAddress, chainId: actualChainId, windowStart, windowEnd }));
  }
  const candidates = [...new Set(interactions.filter((item) => item.counted).map((item) => item.sender.toLowerCase()))];
  return {
    evidenceStatus: actualChainId === 56 ? 'IMPLEMENTED BUT UNVERIFIED' : 'FIXTURE EVIDENCE',
    network: actualChainId, guard, registry: getAddress(registryAddress), range: { from: deploymentBlock, to: finalizedEnd },
    competitionWindow: { start: windowStart, endExclusive: windowEnd }, confirmations, logCount: logs.length,
    interactions, candidateAddresses: candidates, candidateCount: candidates.length,
    qualifyingCount: 0,
    qualificationNote: 'Candidate sender count is not an official award determination. Organizer rules and submitted contract configuration govern eligibility; local fixture activity never counts.',
    nextFromBlock: finalizedEnd + 1,
  };
}

async function main(args = process.argv.slice(2)) {
  const opts = parseArgs(args);
  const rpc = opts['rpc-url'] || process.env.BSC_RPC_URL || 'https://bsc-dataseed.binance.org';
  if (!opts.guard || opts['deployment-block'] === undefined) throw new Error('Usage: node scripts/index-activity.cjs --guard ADDRESS --deployment-block N [--rpc-url URL] [--to-block N]');
  if (!Number.isSafeInteger(Number(opts['deployment-block'])) || Number(opts['deployment-block']) < 0) throw new Error('deployment-block must be a non-negative integer');
  const provider = new JsonRpcProvider(rpc);
  try {
    const report = await scanActivity({ provider, guardAddress: opts.guard, registryAddress: opts.registry || AGENT_ID_BSC, deploymentBlock: Number(opts['deployment-block']), toBlock: opts['to-block'] === undefined ? undefined : Number(opts['to-block']), pageSize: Number(opts['page-size'] || 2000), confirmations: Number(opts.confirmations || 15), chainId: opts.chain === undefined ? undefined : Number(opts.chain), windowStart: Number(opts['window-start'] || DEFAULT_START), windowEnd: Number(opts['window-end'] || DEFAULT_END) });
    const output = `${JSON.stringify(report, null, 2)}\n`;
    if (opts.output) fs.writeFileSync(path.resolve(opts.output), output);
    else process.stdout.write(output);
  } finally { provider.destroy(); }
}

if (require.main === module) main().catch((error) => { process.stderr.write(`${error.shortMessage || error.message}\n`); process.exitCode = 1; });
module.exports = { EVENT_TOPIC, DEFAULT_START, DEFAULT_END, verifyInteraction, scanActivity };
