const test = require('node:test');
const assert = require('node:assert/strict');
const { source, contract } = require('../scripts/compile-contract.cjs');

test('contract compiles to non-empty deployable bytecode', () => {
  assert.ok(contract.evm.bytecode.object.length > 0);
});

test('ABI exposes the intended execution and revocation surface', () => {
  const names = contract.abi.filter((entry) => entry.type === 'function').map((entry) => entry.name);
  for (const name of ['execute', 'revoke', 'mandateId', 'agentId', 'demoCounter', 'nonceMandate', 'revoked', 'uses', 'tasks', 'TASK_SUBMIT_ACTION', 'TASK_ACCEPT_ACTION']) assert.ok(names.includes(name), `${name} missing`);
  assert.equal(names.includes('upgradeTo'), false);
  assert.equal(names.includes('withdraw'), false);
});

test('source uses execution-time fail-closed identity reads and a narrow deterministic action', () => {
  assert.match(source, /agentId\.staticcall/);
  assert.match(source, /if \(!ok \|\| result\.length < 32\) revert InvalidIdentity\(\)/);
  assert.match(source, /_supportedAction\(m\.action\)/);
  assert.match(source, /action == keccak256\("MANDAVEX_DEMO_INCREMENT_V1"\).*TASK_SUBMIT_ACTION.*TASK_ACCEPT_ACTION/s);
  assert.match(source, /task\.contributor == m\.executor \|\| task\.artifactHash != artifactHash/);
  assert.match(source, /m\.payloadHash != keccak256\(payload\)/);
  assert.match(source, /if \(msg\.sender != m\.executor/);
});

test('source includes chain and contract domain binding, expiry, revocation and bounded uses', () => {
  assert.match(source, /block\.chainid != deploymentChainId/);
  assert.match(source, /address verifyingContract/);
  assert.match(source, /block\.timestamp > m\.expiry/);
  assert.match(source, /if \(revoked\[id\]\) revert Revoked\(\)/);
  assert.match(source, /if \(nextUse > m\.maxUses\) revert UseLimit\(\)/);
  assert.match(source, /reserved != bytes32\(0\) && reserved != id/);
});
