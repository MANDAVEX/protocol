const { AbiCoder, Interface, keccak256, toUtf8Bytes, getBytes } = require('ethers');

const AGENT_ID_BSC = '0x60b9262456de011f7d15a54cdd8c48baaa8b022f';
const ACTION_INCREMENT = keccak256(toUtf8Bytes('MANDAVEX_DEMO_INCREMENT_V1'));
const ACTION_TASK_SUBMIT = keccak256(toUtf8Bytes('MANDAVEX_TASK_SUBMIT_V1'));
const ACTION_TASK_ACCEPT = keccak256(toUtf8Bytes('MANDAVEX_TASK_ACCEPT_V1'));
const DOMAIN_NAME = 'MANDAVEX';
const DOMAIN_VERSION = '1';
const types = {
  Mandate: [
    { name: 'issuer', type: 'address' },
    { name: 'executor', type: 'address' },
    { name: 'action', type: 'bytes32' },
    { name: 'payloadHash', type: 'bytes32' },
    { name: 'validAfter', type: 'uint64' },
    { name: 'expiry', type: 'uint64' },
    { name: 'nonce', type: 'uint256' },
    { name: 'maxUses', type: 'uint32' },
  ],
};
const guardInterface = new Interface([
  'function execute((address issuer,address executor,bytes32 action,bytes32 payloadHash,uint64 validAfter,uint64 expiry,uint256 nonce,uint32 maxUses) mandate,bytes payload,bytes signature) returns (bytes32)',
  'function revoke((address issuer,address executor,bytes32 action,bytes32 payloadHash,uint64 validAfter,uint64 expiry,uint256 nonce,uint32 maxUses) mandate)',
  'event ActionAuthorized(bytes32 indexed mandateId,address indexed issuer,address indexed executor,bytes32 action,bytes32 payloadHash,uint32 useNumber,uint256 counterAfter)',
  'event TaskTransition(bytes32 indexed taskId,uint8 status,address indexed owner,address contributor,address reviewer,bytes32 artifactHash,bytes32 indexed mandateId)',
]);

function typedMandate(mandate, chainId, verifyingContract) {
  if (!Number.isSafeInteger(Number(chainId)) || !verifyingContract) throw new TypeError('chainId and verifyingContract are required');
  return { domain: { name: DOMAIN_NAME, version: DOMAIN_VERSION, chainId: Number(chainId), verifyingContract }, types, primaryType: 'Mandate', message: mandate };
}

function encodeExecute(mandate, payload, signature) {
  return guardInterface.encodeFunctionData('execute', [mandate, getBytes(payload), signature]);
}

function encodeRevoke(mandate) {
  return guardInterface.encodeFunctionData('revoke', [mandate]);
}

function encodeTaskPayload(taskId, artifactHash) {
  if (!/^0x[0-9a-fA-F]{64}$/.test(taskId) || !/^0x[0-9a-fA-F]{64}$/.test(artifactHash) || /^0x0{64}$/i.test(taskId) || /^0x0{64}$/i.test(artifactHash)) {
    throw new TypeError('taskId and artifactHash must be non-zero bytes32 values');
  }
  return AbiCoder.defaultAbiCoder().encode(['bytes32', 'bytes32'], [taskId, artifactHash]);
}

function verifyReceipt(receipt, expected = {}, guardAddress) {
  if (!receipt || receipt.status !== 1) return { verified: false, reason: 'transaction_not_successful' };
  if (guardAddress && receipt.to?.toLowerCase() !== guardAddress.toLowerCase()) return { verified: false, reason: 'wrong_guard_address' };
  let event = null;
  for (const log of receipt.logs || []) {
    if (guardAddress && log.address?.toLowerCase() !== guardAddress.toLowerCase()) continue;
    try { const parsed = guardInterface.parseLog(log); if (parsed?.name === 'ActionAuthorized') { event = parsed; break; } } catch { /* unrelated log */ }
  }
  if (!event) return { verified: false, reason: 'authorization_event_missing' };
  for (const key of ['issuer', 'executor', 'action', 'payloadHash', 'mandateId']) {
    if (expected[key] !== undefined && String(event.args[key]).toLowerCase() !== String(expected[key]).toLowerCase()) return { verified: false, reason: `event_${key}_mismatch` };
  }
  if (expected.counterAfter !== undefined && BigInt(event.args.counterAfter) !== BigInt(expected.counterAfter)) return { verified: false, reason: 'event_counter_mismatch' };
  return { verified: true, transactionHash: receipt.hash, blockNumber: receipt.blockNumber, mandateId: event.args.mandateId, issuer: event.args.issuer, executor: event.args.executor, counterAfter: event.args.counterAfter };
}

function verifyTaskReceipt(receipt, expected = {}, guardAddress) {
  const statusNames = { 1: 'Submitted', 2: 'Accepted' };
  const wantedStatus = expected.status === 'Submitted' ? 1 : expected.status === 'Accepted' ? 2 : Number(expected.status);
  if (!/^0x[0-9a-fA-F]{40}$/.test(guardAddress || '') ||
      !/^0x[0-9a-fA-F]{64}$/.test(expected.taskId || '') || /^0x0{64}$/i.test(expected.taskId || '') ||
      !/^0x[0-9a-fA-F]{64}$/.test(expected.artifactHash || '') || /^0x0{64}$/i.test(expected.artifactHash || '') ||
      !statusNames[wantedStatus]) {
    return { verified: false, reason: 'invalid_task_verification_input' };
  }
  const action = wantedStatus === 1 ? ACTION_TASK_SUBMIT : ACTION_TASK_ACCEPT;
  const authorization = verifyReceipt(receipt, { ...expected, action }, guardAddress);
  if (!authorization.verified) return authorization;
  let transition = null;
  for (const log of receipt.logs || []) {
    if (log.address?.toLowerCase() !== guardAddress.toLowerCase()) continue;
    try {
      const parsed = guardInterface.parseLog(log);
      if (parsed?.name === 'TaskTransition' && parsed.args.taskId.toLowerCase() === expected.taskId.toLowerCase()) {
        transition = parsed;
        break;
      }
    } catch { /* unrelated log */ }
  }
  if (!transition) return { verified: false, reason: 'task_transition_missing' };
  const values = {
    status: Number(transition.args.status),
    owner: transition.args.owner,
    contributor: transition.args.contributor,
    reviewer: transition.args.reviewer,
    artifactHash: transition.args.artifactHash,
    mandateId: transition.args.mandateId,
  };
  if (values.status !== wantedStatus) return { verified: false, reason: 'task_status_mismatch' };
  for (const key of ['owner', 'contributor', 'reviewer', 'artifactHash']) {
    if (expected[key] !== undefined && String(values[key]).toLowerCase() !== String(expected[key]).toLowerCase()) {
      return { verified: false, reason: `task_${key}_mismatch` };
    }
  }
  if (values.mandateId.toLowerCase() !== authorization.mandateId.toLowerCase()) {
    return { verified: false, reason: 'task_mandate_mismatch' };
  }
  return { ...authorization, task: { taskId: expected.taskId, ...values, status: statusNames[values.status] } };
}

async function verifyOnchainReceipt(provider, transactionHash, { chainId = 56, guardAddress, expected = {}, expectedTask } = {}) {
  if (!provider || !/^0x[0-9a-fA-F]{64}$/.test(transactionHash || '') || !/^0x[0-9a-fA-F]{40}$/.test(guardAddress || '')) {
    return { verified: false, reason: 'invalid_verification_input' };
  }
  try {
    const network = await provider.getNetwork();
    if (network.chainId !== BigInt(chainId)) return { verified: false, reason: 'wrong_chain', actualChainId: network.chainId.toString() };
    const [receipt, transaction] = await Promise.all([
      provider.getTransactionReceipt(transactionHash),
      provider.getTransaction(transactionHash),
    ]);
    if (!receipt || !transaction) return { verified: false, reason: 'transaction_or_receipt_unavailable' };
    if (transaction.to?.toLowerCase() !== guardAddress.toLowerCase() || receipt.to?.toLowerCase() !== guardAddress.toLowerCase()) {
      return { verified: false, reason: 'wrong_guard_address' };
    }
    const block = await provider.getBlock(receipt.blockNumber);
    if (!block || block.hash?.toLowerCase() !== receipt.blockHash?.toLowerCase() || transaction.blockHash?.toLowerCase() !== receipt.blockHash?.toLowerCase()) {
      return { verified: false, reason: 'noncanonical_or_unavailable_block' };
    }
    const result = expectedTask
      ? verifyTaskReceipt(receipt, { ...expected, ...expectedTask }, guardAddress)
      : verifyReceipt(receipt, expected, guardAddress);
    return result.verified
      ? { ...result, chainId: Number(network.chainId), blockHash: block.hash }
      : result;
  } catch (error) {
    return { verified: false, reason: 'rpc_error', error: error.shortMessage || error.message || 'Unknown RPC error' };
  }
}

module.exports = { AGENT_ID_BSC, ACTION_INCREMENT, ACTION_TASK_SUBMIT, ACTION_TASK_ACCEPT, encodeTaskPayload, typedMandate, encodeExecute, encodeRevoke, verifyReceipt, verifyTaskReceipt, verifyOnchainReceipt };
