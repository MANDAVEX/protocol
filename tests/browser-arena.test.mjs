import test from 'node:test';
import assert from 'node:assert/strict';
import build from '../scripts/compile-contract.cjs';
import { createBrowserArena } from '../apps/web/browser-arena-core.mjs';

const artifacts = {
  guard: { abi: build.contract.abi, bytecode: build.contract.evm.bytecode.object },
  mock: { abi: build.mock.abi, bytecode: build.mock.evm.bytecode.object },
};

test('browser EVM runs a signed mandate and rejects adversarial cases without state change', async () => {
  const arena = await createBrowserArena(artifacts);
  const valid = await arena.runScenario('valid');
  assert.equal(valid.result, 'PASS');
  assert.equal(valid.checks.signatureRecoveredToIssuer, true);
  assert.equal(valid.stateBefore, 0);
  assert.equal(valid.stateAfter, 1);
  assert.ok(valid.receipt.transactionHash.startsWith('0x'));
  assert.ok(valid.receipt.logs.some((log) => log.name === 'ActionAuthorized'));

  const cases = ['unauthorized-executor', 'invalid-identity', 'expired', 'revoked', 'payload-tampering', 'scope-violation', 'invalid-signature', 'cross-chain', 'cross-contract', 'replay', 'concurrent-consumption', 'prompt-injection'];
  for (const name of cases) {
    const result = await arena.runScenario(name);
    assert.equal(result.result, 'PASS', `${name}: ${JSON.stringify(result, (_, value) => typeof value === 'bigint' ? value.toString() : value)}`);
    if (name === 'replay' || name === 'concurrent-consumption') assert.equal(result.stateAfter, 1);
    else assert.equal(result.stateAfter, 0);
  }
});

test('browser EVM comparison uses the same hostile request and protects counter state', async () => {
  const arena = await createBrowserArena(artifacts);
  const result = await arena.compare();
  assert.equal(result.equivalentRequest, true);
  assert.equal(result.baseline.stateAfter, 100);
  assert.equal(result.protected.result, 'rejected');
  assert.equal(result.protected.stateAfter, 0);
  assert.equal(result.protected.rejection, 'ScopeMismatch');
});
