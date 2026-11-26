const test = require('node:test');
const assert = require('node:assert/strict');
const { Interface, toUtf8Bytes } = require('ethers');
const { AGENT_ID_BSC, ACTION_INCREMENT, typedMandate, encodeExecute, verifyReceipt } = require('../packages/sdk/index.cjs');

test('SDK publishes official BSC identity and the exact demo action hash', () => {
  assert.equal(AGENT_ID_BSC, '0x60b9262456de011f7d15a54cdd8c48baaa8b022f');
  assert.equal(ACTION_INCREMENT.length, 66);
});

test('SDK builds a chain- and contract-bound typed mandate', () => {
  const data = typedMandate({ issuer: '0x0000000000000000000000000000000000000001' }, 56, '0x0000000000000000000000000000000000000002');
  assert.equal(data.domain.chainId, 56);
  assert.equal(data.domain.verifyingContract, '0x0000000000000000000000000000000000000002');
  assert.equal(data.primaryType, 'Mandate');
  assert.equal(data.types.Mandate.length, 8);
});

test('SDK encodes an execute call and fails closed when its receipt lacks a successful authorization event', () => {
  const mandate = { issuer: '0x0000000000000000000000000000000000000001', executor: '0x0000000000000000000000000000000000000002', action: ACTION_INCREMENT, payloadHash: '0x' + '11'.repeat(32), validAfter: 1, expiry: 2, nonce: 3, maxUses: 1 };
  const calldata = encodeExecute(mandate, toUtf8Bytes('demo'), '0x1234');
  const iface = new Interface(['function execute((address issuer,address executor,bytes32 action,bytes32 payloadHash,uint64 validAfter,uint64 expiry,uint256 nonce,uint32 maxUses) mandate,bytes payload,bytes signature) returns (bytes32)']);
  assert.equal(iface.parseTransaction({ data: calldata }).name, 'execute');
  assert.deepEqual(verifyReceipt({ status: 0, logs: [] }), { verified: false, reason: 'transaction_not_successful' });
});
