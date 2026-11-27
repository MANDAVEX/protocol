const { getAddress, keccak256, toUtf8Bytes } = require('ethers');
const { ACTION_INCREMENT, ACTION_TASK_SUBMIT, ACTION_TASK_ACCEPT, encodeTaskPayload, typedMandate, encodeExecute, encodeRevoke } = require('../packages/sdk/index.cjs');

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
  if (opts.command !== 'prepare') throw new Error('Usage: node scripts/mandate-cli.cjs prepare --issuer ADDRESS --executor ADDRESS --guard ADDRESS --chain 56|31337 --nonce UINT --expiry UNIX_SECONDS [--action increment|submit-task|accept-task --task-id BYTES32 --artifact-hash BYTES32]');
  const chainId = Number(opts.chain);
  if (![56, 31337].includes(chainId)) throw new Error('Only BNB Chain (56) or isolated local demo (31337) typed data can be prepared');
  const issuer = getAddress(opts.issuer || '');
  const executor = getAddress(opts.executor || '');
  const guard = getAddress(opts.guard || '');
  if (chainId === 56) {
    const manifest = require('../deployments/manifest.json');
    if (manifest.status !== 'DEPLOYED' || manifest.network?.mandavexGuard?.toLowerCase() !== guard.toLowerCase()) {
      throw new Error('Mainnet mandate preparation is blocked until the requested Guard matches a deployed, reviewed manifest');
    }
  }
  const now = Math.floor(Date.now() / 1000);
  const expiry = BigInt(opts.expiry || 0);
  const nonce = BigInt(opts.nonce || -1);
  if (expiry <= BigInt(now) || expiry > BigInt(now + 86400)) throw new Error('Expiry must be in the next 24 hours');
  if (nonce < 0n) throw new Error('A fresh non-negative nonce is required');
  const selectedAction = opts.action || 'increment';
  let action;
  let payload;
  if (selectedAction === 'increment') {
    action = ACTION_INCREMENT;
    payload = toUtf8Bytes(opts.payload || 'add one to my test counter');
  } else if (selectedAction === 'submit-task' || selectedAction === 'accept-task') {
    action = selectedAction === 'submit-task' ? ACTION_TASK_SUBMIT : ACTION_TASK_ACCEPT;
    payload = Buffer.from(encodeTaskPayload(opts['task-id'] || '', opts['artifact-hash'] || '').slice(2), 'hex');
  } else throw new Error('action must be increment, submit-task, or accept-task');
  const mandate = { issuer, executor, action, payloadHash: keccak256(payload), validAfter: BigInt(now), expiry, nonce, maxUses: 1 };
  const message = typedMandate(mandate, chainId, guard);
  const agenticWalletSignRequestJson = JSON.stringify({
    method: 'eth_signTypedData_v4',
    params: [issuer, JSON.stringify(message, (_, value) => typeof value === 'bigint' ? value.toString() : value)],
  });
  const calldata = encodeExecute(mandate, payload, '0x');
  process.stdout.write(`${JSON.stringify({ status: 'PREPARATION ONLY · NOT SIGNED · NOT SENT', chainId, guard, action: selectedAction, payload: `0x${Buffer.from(payload).toString('hex')}`, typedData: message, agenticWalletSignRequestJson, unsignedExecuteCalldataTemplate: calldata, unsignedRevokeCalldataTemplate: encodeRevoke(mandate) }, (_, value) => typeof value === 'bigint' ? value.toString() : value, 2)}\n`);
}

if (require.main === module) {
  try { run(); } catch (error) { process.stderr.write(`${error.message}\n`); process.exitCode = 1; }
}
module.exports = { run };
