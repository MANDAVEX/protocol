const fs = require('node:fs');
const path = require('node:path');
const { JsonRpcProvider } = require('ethers');
const { ACTION_TASK_ACCEPT, ACTION_TASK_SUBMIT, verifyOnchainReceipt } = require('../packages/sdk/index.cjs');

async function main(args = process.argv.slice(2)) {
  const txIndex = args.indexOf('--tx');
  const transactionHash = txIndex >= 0 ? args[txIndex + 1] : null;
  const getArg = (name) => { const index = args.indexOf(name); return index >= 0 ? args[index + 1] : undefined; };
  const taskId = getArg('--task-id');
  const artifactHash = getArg('--artifact-hash');
  const taskStatus = getArg('--task-status');
  const taskOptions = [taskId, artifactHash, taskStatus];
  if (txIndex < 0 || !transactionHash || (taskOptions.some(Boolean) && !taskOptions.every(Boolean)) || (taskStatus && !['submitted', 'accepted'].includes(taskStatus.toLowerCase()))) {
    throw new Error('Usage: node scripts/verify-receipt.cjs --tx TRANSACTION_HASH [--task-id 0x… --artifact-hash 0x… --task-status submitted|accepted]');
  }
  const manifestPath = path.resolve(__dirname, '../deployments/manifest.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const guardAddress = manifest.network?.mandavexGuard;
  if (manifest.status !== 'DEPLOYED' || !/^0x[0-9a-fA-F]{40}$/.test(guardAddress || '')) {
    process.stdout.write(`${JSON.stringify({ status: 'BLOCKED', evidenceStatus: 'NOT IMPLEMENTED', reason: 'The deployment manifest has no verified BNB Guard address. No RPC lookup was attempted.' }, null, 2)}\n`);
    process.exitCode = 2;
    return;
  }
  const provider = new JsonRpcProvider(process.env.BSC_RPC_URL || 'https://bsc-dataseed.binance.org');
  try {
    const status = taskStatus?.toLowerCase();
    const expectedTask = status ? { taskId, artifactHash, status: status === 'submitted' ? 'Submitted' : 'Accepted' } : undefined;
    const expected = status ? { action: status === 'submitted' ? ACTION_TASK_SUBMIT : ACTION_TASK_ACCEPT } : {};
    const result = await verifyOnchainReceipt(provider, transactionHash, { chainId: 56, guardAddress, expected, expectedTask });
    process.stdout.write(`${JSON.stringify({ status: result.verified ? 'VERIFIED' : 'NOT VERIFIED', network: 'BNB Smart Chain', guardAddress, ...result }, null, 2)}\n`);
    if (!result.verified) process.exitCode = 1;
  } finally {
    provider.destroy();
  }
}

main().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
});
