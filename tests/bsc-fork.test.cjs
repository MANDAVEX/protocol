const { before, after, test } = require('node:test');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const path = require('node:path');
const { JsonRpcProvider, ContractFactory, keccak256, toUtf8Bytes } = require('ethers');
const { AGENT_ID_BSC } = require('../packages/sdk/index.cjs');
const { contract } = require('../scripts/compile-contract.cjs');

const port = 18546;
const url = `http://127.0.0.1:${port}`;
const forkRpc = process.env.BSC_RPC_URL || 'https://bsc-dataseed.binance.org';
let forkBlock;
let server;
let serverErrors = '';
const provider = new JsonRpcProvider(url, 56, { staticNetwork: true });

before(async () => {
  const blockResponse = await fetch(forkRpc, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'eth_blockNumber', params: [] }) });
  const blockResult = await blockResponse.json();
  if (!blockResponse.ok || blockResult.error || !blockResult.result) throw new Error('Unable to get current BSC fork height');
  forkBlock = Number(BigInt(blockResult.result));
  server = spawn(process.execPath, [
    path.resolve('node_modules/hardhat/dist/src/cli.js'), '--network', 'default', 'node', '--hostname', '127.0.0.1', '--port', String(port),
    '--chain-id', '56', '--fork', forkRpc, '--fork-block-number', String(forkBlock),
  ], { stdio: ['ignore', 'ignore', 'pipe'], windowsHide: true });
  server.stderr.setEncoding('utf8');
  server.stderr.on('data', (chunk) => { serverErrors += chunk; });
  let ready = false;
  for (let attempt = 0; attempt < 120; attempt++) {
    if (server.exitCode !== null) throw new Error(`Hardhat fork node exited with ${server.exitCode}: ${serverErrors}`);
    try { await provider.send('eth_chainId', []); ready = true; break; } catch { await new Promise((resolve) => setTimeout(resolve, 250)); }
  }
  if (!ready) throw new Error('BSC fork node did not start');
});

after(() => { provider.destroy(); server?.kill(); });

test('production Agent ID registry is loaded from a block-pinned BSC fork and rejects local non-holder', async () => {
  const code = await provider.getCode(AGENT_ID_BSC);
  assert.ok(code.length > 2, 'official production registry code missing on fork');
  const issuer = await provider.getSigner(0);
  const executor = await provider.getSigner(1);
  const issuerAddress = await issuer.getAddress();
  const executorAddress = await executor.getAddress();
  const registry = new ContractFactory([
    'function balanceOf(address owner) view returns (uint256)',
  ], '0x', provider);
  const reader = registry.attach(AGENT_ID_BSC);
  assert.equal(await reader.balanceOf(issuerAddress), 0n);

  const guard = await new ContractFactory(contract.abi, contract.evm.bytecode.object, issuer).deploy(AGENT_ID_BSC);
  const deploymentReceipt = await (await guard.deploymentTransaction()).wait();
  assert.equal(await guard.deploymentChainId(), 56n);
  assert.equal((await guard.agentId()).toLowerCase(), AGENT_ID_BSC.toLowerCase());
  assert.equal(guard.interface.fragments.some((fragment) => fragment.type === 'function' && fragment.name === 'owner'), false);

  const payload = toUtf8Bytes('fork identity gate');
  const block = await provider.getBlock('latest');
  const mandate = {
    issuer: issuerAddress,
    executor: executorAddress,
    action: keccak256(toUtf8Bytes('MANDAVEX_DEMO_INCREMENT_V1')),
    payloadHash: keccak256(payload),
    validAfter: BigInt(block.timestamp - 1),
    expiry: BigInt(block.timestamp + 300),
    nonce: 77123n,
    maxUses: 1,
  };
  let error;
  try { await guard.connect(executor).execute.staticCall(mandate, payload, '0x'); } catch (caught) { error = caught; }
  assert.ok(error, 'execution unexpectedly passed the real Agent ID registry gate');
  const serialized = JSON.stringify(error, Object.getOwnPropertyNames(error)).toLowerCase();
  const selector = keccak256(toUtf8Bytes('InvalidIdentity()')).slice(0, 10).toLowerCase();
  assert.ok(serialized.includes(selector), `expected InvalidIdentity from production registry, got: ${serialized.slice(0, 800)}`);
  assert.equal(await guard.demoCounter(), 0n);
  console.log(JSON.stringify({ network: 'BSC mainnet state fork', forkBlock, registry: AGENT_ID_BSC, constructorArgument: AGENT_ID_BSC, deploymentGasUsed: deploymentReceipt.gasUsed.toString(), guardRuntimeCodeBytes: ((await provider.getCode(await guard.getAddress())).length - 2) / 2, registryCodeBytes: (code.length - 2) / 2, result: 'non-holder rejected at execution boundary' }));
});
