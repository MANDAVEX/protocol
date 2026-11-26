const test = require('node:test');
const assert = require('node:assert/strict');
const { AbiCoder, Interface, keccak256, toUtf8Bytes } = require('ethers');
const { DEFAULT_END, DEFAULT_START, scanActivity, verifyInteraction } = require('../scripts/index-activity.cjs');

const guard = '0x0000000000000000000000000000000000000011';
const registry = '0x0000000000000000000000000000000000000022';
const issuer = '0x0000000000000000000000000000000000000033';
const executor = '0x0000000000000000000000000000000000000044';
const relayer = '0x0000000000000000000000000000000000000055';
const hash = (tag) => keccak256(toUtf8Bytes(tag));
const eventInterface = new Interface(['event ActionAuthorized(bytes32 indexed mandateId,address indexed issuer,address indexed executor,bytes32 action,bytes32 payloadHash,uint32 useNumber,uint256 counterAfter)']);
const blockHash = (n) => `0x${n.toString(16).padStart(64, '0')}`;
const blockFor = (number, timestamp = DEFAULT_START) => ({ number, timestamp, hash: blockHash(number) });

function makeLog({ txHash, number = 100, sender = executor, timestamp = DEFAULT_START, action = hash('task-submit') } = {}) {
  const encoded = eventInterface.encodeEventLog(eventInterface.getEvent('ActionAuthorized'), [hash(`mandate:${txHash}`), issuer, sender, action, hash(`payload:${txHash}`), 1, 1]);
  return { address: guard, topics: encoded.topics, data: encoded.data, transactionHash: txHash, blockNumber: number, blockHash: blockHash(number), timestamp, index: 0 };
}

function providerFixture(logs = [], { sender = executor, identity = true, noIdentity = [], latest = 120 } = {}) {
  const receipts = new Map();
  const transactions = new Map();
  const blocks = new Map();
  for (const log of logs) {
    receipts.set(log.transactionHash, { status: 1, to: guard, hash: log.transactionHash, blockNumber: log.blockNumber, blockHash: log.blockHash, logs: [log] });
    transactions.set(log.transactionHash, { from: sender });
    blocks.set(log.blockNumber, blockFor(log.blockNumber, log.timestamp));
  }
  return {
    receipts, transactions, blocks,
    getNetwork: async () => ({ chainId: 56n }),
    getBlockNumber: async () => latest,
    getLogs: async ({ fromBlock, toBlock }) => logs.filter((log) => log.blockNumber >= fromBlock && log.blockNumber <= toBlock),
    getTransactionReceipt: async (txHash) => receipts.get(txHash),
    getTransaction: async (txHash) => transactions.get(txHash),
    getBlock: async (number) => blocks.get(number),
    call: async (transaction) => {
      const queried = `0x${transaction.data.slice(-40)}`.toLowerCase();
      const hasIdentity = identity && !noIdentity.some((address) => address.toLowerCase() === queried);
      return AbiCoder.defaultAbiCoder().encode(['uint256'], [hasIdentity ? 1 : 0]);
    },
  };
}

test('indexer rejects failed transactions and successful receipts without Guard events', async () => {
  const failed = await verifyInteraction({}, { status: 0, logs: [] }, { guardAddress: guard, registryAddress: registry, chainId: 56 });
  assert.deepEqual(failed, { verified: false, reason: 'transaction_not_successful' });
  const missing = await verifyInteraction({}, { status: 1, to: guard, logs: [], hash: blockHash(1), blockNumber: 1 }, { guardAddress: guard, registryAddress: registry, chainId: 56 });
  assert.deepEqual(missing, { verified: false, reason: 'authorization_event_missing' });
});

test('indexer counts a canonical direct-holder receipt at the window start and records identity observation scope', async () => {
  const txHash = hash('window-start');
  const log = makeLog({ txHash, number: 100, timestamp: DEFAULT_START });
  const provider = providerFixture([log]);
  const result = await verifyInteraction(provider, provider.receipts.get(txHash), { guardAddress: guard, registryAddress: registry, chainId: 56, windowStart: DEFAULT_START, windowEnd: DEFAULT_END });
  assert.equal(result.counted, true);
  assert.equal(result.identityObservation, 'balanceOf read at the receipt block after block execution; not transaction-level pre-state');
  assert.equal(result.reason, 'mainnet_direct_holder_interaction_candidate');
});

test('competition window end is exclusive and relayed sender activity is not a candidate', async () => {
  const endHash = hash('window-end');
  const endLog = makeLog({ txHash: endHash, timestamp: DEFAULT_END });
  const endProvider = providerFixture([endLog]);
  const atEnd = await verifyInteraction(endProvider, endProvider.receipts.get(endHash), { guardAddress: guard, registryAddress: registry, chainId: 56 });
  assert.equal(atEnd.counted, false);
  assert.equal(atEnd.reason, 'outside_competition_window');

  const relayedHash = hash('relayed');
  const relayedLog = makeLog({ txHash: relayedHash });
  const relayedProvider = providerFixture([relayedLog], { sender: relayer });
  const relayed = await verifyInteraction(relayedProvider, relayedProvider.receipts.get(relayedHash), { guardAddress: guard, registryAddress: registry, chainId: 56 });
  assert.equal(relayed.counted, false);
  assert.equal(relayed.reason, 'relayer_or_delegated_sender_requires_organizer_review');
});

test('indexer rejects a receipt whose block hash was replaced by a reorganization', async () => {
  const txHash = hash('reorged-receipt');
  const log = makeLog({ txHash });
  const provider = providerFixture([log]);
  provider.blocks.set(log.blockNumber, { ...blockFor(log.blockNumber), hash: blockHash(log.blockNumber + 1) });
  const result = await verifyInteraction(provider, provider.receipts.get(txHash), { guardAddress: guard, registryAddress: registry, chainId: 56 });
  assert.equal(result.verified, false);
  assert.equal(result.reason, 'receipt_block_not_canonical');
});

test('historical identity false at the receipt block never becomes a candidate', async () => {
  const txHash = hash('identity-revoked-before-block-end');
  const log = makeLog({ txHash });
  const provider = providerFixture([log], { noIdentity: [issuer] });
  const result = await verifyInteraction(provider, provider.receipts.get(txHash), { guardAddress: guard, registryAddress: registry, chainId: 56 });
  assert.equal(result.counted, false);
  assert.equal(result.reason, 'issuer_not_agent_id_holder_at_receipt_block');
});

test('unavailable historical identity reads are reported without qualifying activity', async () => {
  const txHash = hash('archive-rpc-failure');
  const log = makeLog({ txHash });
  const provider = providerFixture([log]);
  provider.call = async () => { throw new Error('archive node unavailable'); };
  const result = await verifyInteraction(provider, provider.receipts.get(txHash), { guardAddress: guard, registryAddress: registry, chainId: 56 });
  assert.equal(result.verified, true);
  assert.equal(result.counted, false);
  assert.equal(result.reason, 'historical_identity_read_unavailable');
});

test('activity scan paginates blocks, removes duplicate addresses, and never upgrades candidates to official qualification', async () => {
  const first = makeLog({ txHash: hash('address-interaction-one'), number: 100 });
  const second = makeLog({ txHash: hash('address-interaction-two'), number: 112 });
  const provider = providerFixture([first, second], { latest: 120 });
  const getLogs = provider.getLogs;
  provider.getLogs = async (filter) => {
    if (filter.toBlock - filter.fromBlock >= 10) throw new Error('RPC log range too large');
    return getLogs(filter);
  };
  const report = await scanActivity({ provider, guardAddress: guard, registryAddress: registry, deploymentBlock: 100, toBlock: 120, pageSize: 20, confirmations: 0, chainId: 56 });
  assert.equal(report.logCount, 2);
  assert.equal(report.interactions.length, 2);
  assert.equal(report.candidateCount, 1);
  assert.equal(report.qualifyingCount, 0);
  assert.equal(report.interactions[0].counted, true);
  assert.equal(report.interactions[1].counted, true);
  assert.equal(report.range.to, 120);
});

test('scan rejects RPC chain mismatch and validates paging and competition bounds', async () => {
  const txHash = hash('bad-config');
  const provider = providerFixture([makeLog({ txHash })]);
  await assert.rejects(() => scanActivity({ provider, guardAddress: guard, deploymentBlock: 100, chainId: 1 }), /did not match requested/);
  await assert.rejects(() => scanActivity({ provider, guardAddress: guard, deploymentBlock: 100, pageSize: 0 }), /pageSize/);
  await assert.rejects(() => scanActivity({ provider, guardAddress: guard, deploymentBlock: 100, windowStart: DEFAULT_END, windowEnd: DEFAULT_START }), /end must be after start/);
});
