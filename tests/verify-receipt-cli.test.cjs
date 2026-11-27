const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const path = require('node:path');

test('receipt CLI stays blocked without a deployed Guard and makes no RPC claim', () => {
  const result = spawnSync(process.execPath, [path.resolve('scripts/verify-receipt.cjs'), '--tx', `0x${'11'.repeat(32)}`], { encoding: 'utf8' });
  assert.equal(result.status, 2);
  const output = JSON.parse(result.stdout);
  assert.equal(output.status, 'BLOCKED');
  assert.equal(output.evidenceStatus, 'NOT IMPLEMENTED');
  assert.match(output.reason, /No RPC lookup was attempted/);
});

test('task receipt verification requires complete, valid task expectations before RPC', () => {
  const base = ['--tx', `0x${'11'.repeat(32)}`];
  for (const extra of [
    ['--task-id', `0x${'22'.repeat(32)}`],
    ['--task-id', `0x${'22'.repeat(32)}`, '--artifact-hash', `0x${'33'.repeat(32)}`, '--task-status', 'unknown'],
  ]) {
    const result = spawnSync(process.execPath, [path.resolve('scripts/verify-receipt.cjs'), ...base, ...extra], { encoding: 'utf8' });
    assert.equal(result.status, 1);
    assert.match(result.stderr, /Usage:/);
  }
  const validButUndeployed = spawnSync(process.execPath, [path.resolve('scripts/verify-receipt.cjs'), ...base, '--task-id', `0x${'22'.repeat(32)}`, '--artifact-hash', `0x${'33'.repeat(32)}`, '--task-status', 'submitted'], { encoding: 'utf8' });
  assert.equal(validButUndeployed.status, 2);
  assert.match(JSON.parse(validButUndeployed.stdout).reason, /No RPC lookup was attempted/);
});
