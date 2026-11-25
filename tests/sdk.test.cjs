const test = require('node:test');
const assert = require('node:assert/strict');
const { AGENT_ID_BSC, ACTION_INCREMENT, typedMandate } = require('../packages/sdk/index.cjs');

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
