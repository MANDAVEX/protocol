const fs = require('node:fs');
const path = require('node:path');
const { JsonRpcProvider } = require('ethers');
const { verifyOnchainReceipt } = require('../packages/sdk/index.cjs');

async function main(args = process.argv.slice(2)) {
  const txIndex = args.indexOf('--tx');
  const transactionHash = txIndex >= 0 ? args[txIndex + 1] : null;
  if (txIndex < 0 || !transactionHash) throw new Error('Usage: node scripts/verify-receipt.cjs --tx TRANSACTION_HASH');
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
    const result = await verifyOnchainReceipt(provider, transactionHash, { chainId: 56, guardAddress });
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
