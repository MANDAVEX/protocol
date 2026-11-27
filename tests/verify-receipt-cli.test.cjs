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
