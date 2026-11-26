const { getAddress, keccak256, toUtf8Bytes } = require('ethers');
const { ACTION_INCREMENT, typedMandate, encodeExecute } = require('../packages/sdk/index.cjs');

function parseArgs(args) {
  const out = { command: args[0] };
  for (let i = 1; i < args.length; i++) {
    if (!args[i].startsWith('--') || !args[i + 1]) throw new Error(`Expected --name value near ${args[i]}`);
    out[args[i].slice(2)] = args[++i];
  }
  return out;
}

function run(args = process.argv.slice(2)) {
  const opts = parseArgs(args);
  if (opts.command !== 'prepare') throw new Error('Usage: node scripts/mandate-cli.cjs prepare --issuer ADDRESS --executor ADDRESS --guard ADDRESS --chain 56|31337 --nonce UINT --expiry UNIX_SECONDS [--payload TEXT]');
  const chainId = Number(opts.chain);
  if (![56, 31337].includes(chainId)) throw new Error('Only BNB Chain (56) or isolated local demo (31337) typed data can be prepared');
  const issuer = getAddress(opts.issuer || '');
  const executor = getAddress(opts.executor || '');
  const guard = getAddress(opts.guard || '');
  const now = Math.floor(Date.now() / 1000);
  const expiry = BigInt(opts.expiry || 0);
  const nonce = BigInt(opts.nonce || -1);
  if (expiry <= BigInt(now) || expiry > BigInt(now + 86400)) throw new Error('Expiry must be in the next 24 hours');
  if (nonce < 0n) throw new Error('A fresh non-negative nonce is required');
  const payload = toUtf8Bytes(opts.payload || 'add one to my test counter');
  const mandate = { issuer, executor, action: ACTION_INCREMENT, payloadHash: keccak256(payload), validAfter: BigInt(now), expiry, nonce, maxUses: 1 };
  const message = typedMandate(mandate, chainId, guard);
  const calldata = encodeExecute(mandate, payload, '0x');
  process.stdout.write(`${JSON.stringify({ status: 'PREPARATION ONLY · NOT SIGNED · NOT SENT', chainId, guard, payload: Buffer.from(payload).toString('utf8'), typedData: message, unsignedExecuteCalldataTemplate: calldata }, null, 2)}\n`);
}

if (require.main === module) {
  try { run(); } catch (error) { process.stderr.write(`${error.message}\n`); process.exitCode = 1; }
}
module.exports = { run };
