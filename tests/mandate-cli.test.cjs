const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const path = require('node:path');

const script = path.resolve('scripts/mandate-cli.cjs');
const identity = '0x0000000000000000000000000000000000000001';
function run(action, extra = []) {
  const expiry = String(Math.floor(Date.now() / 1000) + 3600);
  return spawnSync(process.execPath, [script, 'prepare', '--issuer', identity, '--executor', '0x0000000000000000000000000000000000000002', '--guard', '0x0000000000000000000000000000000000000003', '--chain', '31337', '--nonce', '12', '--expiry', expiry, '--action', action, ...extra], { encoding: 'utf8' });
}

test('mandate CLI prepares submission typed data and unsigned calldata without signing or sending', () => {
  const result = run('submit-task', ['--task-id', `0x${'11'.repeat(32)}`, '--artifact-hash', `0x${'22'.repeat(32)}`]);
  assert.equal(result.status, 0, result.stderr);
  const output = JSON.parse(result.stdout);
  assert.equal(output.status, 'PREPARATION ONLY · NOT SIGNED · NOT SENT');
  assert.equal(output.action, 'submit-task');
  assert.equal(output.typedData.message.action.length, 66);
  assert.equal(output.typedData.message.expiry.length > 0, true);
  assert.ok(output.unsignedExecuteCalldataTemplate.startsWith('0x'));
  assert.ok(output.unsignedRevokeCalldataTemplate.startsWith('0x'));
  assert.ok(output.payload.startsWith('0x'));
});

test('mandate CLI rejects task preparation without non-zero bytes32 identifiers', () => {
  const result = run('accept-task');
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /non-zero bytes32/);
});
