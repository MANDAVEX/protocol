const { before, after, test } = require('node:test');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const path = require('node:path');
const { JsonRpcProvider, ContractFactory, keccak256, toUtf8Bytes } = require('ethers');
const { contract, mock } = require('../scripts/compile-contract.cjs');

const port = 18545;
const url = `http://127.0.0.1:${port}`;
const server = spawn(process.execPath, [
  path.resolve('node_modules/hardhat/dist/src/cli.js'), 'node', '--hostname', '127.0.0.1', '--port', String(port),
], { stdio: 'ignore', windowsHide: true });
const provider = new JsonRpcProvider(url, 31337, { staticNetwork: true });

before(async () => {
  let ready = false;
  for (let attempt = 0; attempt < 100; attempt++) {
    if (server.exitCode !== null) throw new Error(`Hardhat node exited with ${server.exitCode}`);
    try { await provider.send('eth_chainId', []); ready = true; break; } catch { await new Promise((resolve) => setTimeout(resolve, 100)); }
  }
  if (!ready) throw new Error('Hardhat node did not start');
});

after(async () => {
  provider.destroy();
  server.kill();
});

const types = { Mandate: [
  { name: 'issuer', type: 'address' },
  { name: 'executor', type: 'address' },
  { name: 'action', type: 'bytes32' },
  { name: 'payloadHash', type: 'bytes32' },
  { name: 'validAfter', type: 'uint64' },
  { name: 'expiry', type: 'uint64' },
  { name: 'nonce', type: 'uint256' },
  { name: 'maxUses', type: 'uint32' },
] };
const action = keccak256(toUtf8Bytes('MANDAVEX_DEMO_INCREMENT_V1'));
const payload = toUtf8Bytes('add one to my test counter');
let nonceSequence = 1n;

async function expectCustomError(promise, signature) {
  const selector = keccak256(toUtf8Bytes(signature)).slice(0, 10).toLowerCase();
  let caught;
  try { await promise; } catch (error) { caught = error; }
  assert.ok(caught, `expected ${signature} to revert`);
  const serialized = JSON.stringify(caught, Object.getOwnPropertyNames(caught)).toLowerCase();
  assert.ok(serialized.includes(selector), `expected ${signature} selector ${selector}; got ${serialized.slice(0, 900)}`);
}

async function fixture() {
  const issuer = await provider.getSigner(0);
  const executor = await provider.getSigner(1);
  const outsider = await provider.getSigner(2);
  const registry = await new ContractFactory(mock.abi, mock.evm.bytecode.object, issuer).deploy();
  await registry.waitForDeployment();
  await (await registry.setBalance(await issuer.getAddress(), 1)).wait();
  await (await registry.setBalance(await executor.getAddress(), 1)).wait();
  const guard = await new ContractFactory(contract.abi, contract.evm.bytecode.object, issuer).deploy(await registry.getAddress());
  await guard.waitForDeployment();
  return { issuer, executor, outsider, registry, guard };
}

async function signedMandate({ issuer, executor, guard }, overrides = {}) {
  const block = await provider.getBlock('latest');
  const mandate = {
    issuer: await issuer.getAddress(),
    executor: await executor.getAddress(),
    action,
    payloadHash: keccak256(payload),
    validAfter: BigInt(block.timestamp - 1),
    expiry: BigInt(block.timestamp + 3600),
    nonce: nonceSequence++,
    maxUses: 1,
    ...overrides,
  };
  const network = await provider.getNetwork();
  const signature = await issuer.signTypedData({ name: 'MANDAVEX', version: '1', chainId: network.chainId, verifyingContract: await guard.getAddress() }, types, mandate);
  return { mandate, signature };
}

test('valid EIP-712 mandate executes, consumes bounded use, emits proof, and revokes', async () => {
  const ctx = await fixture();
  const { mandate, signature } = await signedMandate(ctx);
  const tx = await ctx.guard.connect(ctx.executor).execute(mandate, payload, signature);
  const receipt = await tx.wait();
  assert.equal(await ctx.guard.demoCounter(), 1n);
  assert.equal(await ctx.guard.uses(await ctx.guard.mandateId(mandate)), 1n);
  assert.equal(await ctx.guard.nonceMandate(mandate.issuer, mandate.nonce), await ctx.guard.mandateId(mandate));
  const parsed = receipt.logs.map((log) => { try { return ctx.guard.interface.parseLog(log); } catch { return null; } }).find((log) => log?.name === 'ActionAuthorized');
  assert.ok(parsed, 'ActionAuthorized receipt event missing');
  assert.equal(parsed.args.counterAfter, 1n);
  await expectCustomError(ctx.guard.connect(ctx.executor).execute(mandate, payload, signature), 'UseLimit()');
  await (await ctx.guard.revoke(mandate)).wait();
  assert.equal(await ctx.guard.revoked(await ctx.guard.mandateId(mandate)), true);
  await expectCustomError(ctx.guard.connect(ctx.executor).execute(mandate, payload, signature), 'Revoked()');
});

test('unknown Agent ID executor fails closed and leaves state unchanged', async () => {
  const ctx = await fixture();
  const noId = await provider.getSigner(3);
  const { mandate, signature } = await signedMandate(ctx, { executor: await noId.getAddress() });
  await expectCustomError(ctx.guard.connect(noId).execute(mandate, payload, signature), 'InvalidIdentity()');
  assert.equal(await ctx.guard.demoCounter(), 0n);
});

test('issuer Agent ID is rechecked at execution, not trusted from mandate creation', async () => {
  const ctx = await fixture();
  const { mandate, signature } = await signedMandate(ctx);
  await (await ctx.registry.setBalance(mandate.issuer, 0)).wait();
  await expectCustomError(ctx.guard.connect(ctx.executor).execute(mandate, payload, signature), 'InvalidIdentity()');
  assert.equal(await ctx.guard.demoCounter(), 0n);
});

test('wrong caller, altered payload, altered action, and wrong issuer signature are rejected', async () => {
  const ctx = await fixture();
  const signed = await signedMandate(ctx);
  await expectCustomError(ctx.guard.connect(ctx.outsider).execute(signed.mandate, payload, signed.signature), 'Unauthorized()');
  await expectCustomError(ctx.guard.connect(ctx.executor).execute(signed.mandate, toUtf8Bytes('tampered'), signed.signature), 'ScopeMismatch()');
  const otherAction = { ...signed.mandate, action: keccak256(toUtf8Bytes('ADMIN_WITHDRAW')) };
  const badSig = await ctx.executor.signTypedData({ name: 'MANDAVEX', version: '1', chainId: 31337, verifyingContract: await ctx.guard.getAddress() }, types, signed.mandate);
  await expectCustomError(ctx.guard.connect(ctx.executor).execute(otherAction, payload, signed.signature), 'ScopeMismatch()');
  await expectCustomError(ctx.guard.connect(ctx.executor).execute(signed.mandate, payload, badSig), 'InvalidSignature()');
  assert.equal(await ctx.guard.demoCounter(), 0n);
});

test('expired mandate is rejected at the execution boundary', async () => {
  const ctx = await fixture();
  const block = await provider.getBlock('latest');
  const { mandate, signature } = await signedMandate(ctx, { validAfter: BigInt(block.timestamp - 2), expiry: BigInt(block.timestamp + 2) });
  await provider.send('evm_increaseTime', [5]);
  await provider.send('evm_mine', []);
  await expectCustomError(ctx.guard.connect(ctx.executor).execute(mandate, payload, signature), 'InvalidTime()');
  assert.equal(await ctx.guard.demoCounter(), 0n);
});

test('future mandate, malformed signature, and cross-contract typed-data replay are rejected', async () => {
  const ctx = await fixture();
  const block = await provider.getBlock('latest');
  const future = await signedMandate(ctx, { validAfter: BigInt(block.timestamp + 100), expiry: BigInt(block.timestamp + 1000) });
  await expectCustomError(ctx.guard.connect(ctx.executor).execute(future.mandate, payload, future.signature), 'InvalidTime()');
  const valid = await signedMandate(ctx);
  await expectCustomError(ctx.guard.connect(ctx.executor).execute(valid.mandate, payload, '0x1234'), 'InvalidSignature()');
  const wrongDomainSig = await ctx.issuer.signTypedData({ name: 'MANDAVEX', version: '1', chainId: 31337, verifyingContract: await ctx.outsider.getAddress() }, types, valid.mandate);
  await expectCustomError(ctx.guard.connect(ctx.executor).execute(valid.mandate, payload, wrongDomainSig), 'InvalidSignature()');
  const crossChainSig = await ctx.issuer.signTypedData({ name: 'MANDAVEX', version: '1', chainId: 56, verifyingContract: await ctx.guard.getAddress() }, types, valid.mandate);
  await expectCustomError(ctx.guard.connect(ctx.executor).execute(valid.mandate, payload, crossChainSig), 'InvalidSignature()');
});

test('mandate maximum uses are enforced while the same mandate remains bound to one nonce', async () => {
  const ctx = await fixture();
  const { mandate, signature } = await signedMandate(ctx, { maxUses: 2 });
  await (await ctx.guard.connect(ctx.executor).execute(mandate, payload, signature)).wait();
  await (await ctx.guard.connect(ctx.executor).execute(mandate, payload, signature)).wait();
  assert.equal(await ctx.guard.demoCounter(), 2n);
  assert.equal(await ctx.guard.uses(await ctx.guard.mandateId(mandate)), 2n);
  await expectCustomError(ctx.guard.connect(ctx.executor).execute(mandate, payload, signature), 'UseLimit()');
});

test('issuer nonce cannot be rebound to a different mandate', async () => {
  const ctx = await fixture();
  const nonce = 909090n;
  const first = await signedMandate(ctx, { nonce });
  await (await ctx.guard.connect(ctx.executor).execute(first.mandate, payload, first.signature)).wait();
  const second = await signedMandate(ctx, { nonce, maxUses: 2 });
  await expectCustomError(ctx.guard.connect(ctx.executor).execute(second.mandate, payload, second.signature), 'Replay()');
  assert.equal(await ctx.guard.demoCounter(), 1n);
});

test('seeded payload fuzz rejects malformed requests without changing invariants', async () => {
  const ctx = await fixture();
  const signed = await signedMandate(ctx);
  // xorshift32 makes this fuzz sample reproducible; the seed is recorded in the test title/output.
  let state = 0x4d445658;
  const nextByte = () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return state & 0xff;
  };
  for (let i = 0; i < 128; i++) {
    const length = i % 65;
    const bytes = Uint8Array.from({ length }, nextByte);
    await expectCustomError(ctx.guard.connect(ctx.executor).execute.staticCall(signed.mandate, bytes, signed.signature), 'ScopeMismatch()');
  }
  assert.equal(await ctx.guard.demoCounter(), 0n);
  assert.equal(await ctx.guard.uses(await ctx.guard.mandateId(signed.mandate)), 0n);
  assert.equal(await ctx.guard.nonceMandate(signed.mandate.issuer, signed.mandate.nonce), `0x${'00'.repeat(32)}`);
});

test('deployment rejects a registry address without contract code', async () => {
  const signer = await provider.getSigner(0);
  const factory = new ContractFactory(contract.abi, contract.evm.bytecode.object, signer);
  await expectCustomError(factory.deploy(await signer.getAddress()), 'InvalidIdentity()');
});
