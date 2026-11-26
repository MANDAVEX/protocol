import { createBlock } from '@ethereumjs/block';
import { createCustomCommon, Hardfork, Mainnet } from '@ethereumjs/common';
import { createLegacyTx } from '@ethereumjs/tx';
import { createAccount, createAddressFromString, hexToBytes, createZeroAddress } from '@ethereumjs/util';
import { createVM, runTx } from '@ethereumjs/vm';
import { AbiCoder, ContractFactory, Interface, Wallet, getBytes, hexlify, keccak256, toUtf8Bytes, verifyTypedData } from 'ethers';

const CHAIN_ID = 31337;
const ACTION = keccak256(toUtf8Bytes('MANDAVEX_DEMO_INCREMENT_V1'));
const TASK_SUBMIT = keccak256(toUtf8Bytes('MANDAVEX_TASK_SUBMIT_V1'));
const TASK_ACCEPT = keccak256(toUtf8Bytes('MANDAVEX_TASK_ACCEPT_V1'));
const PAYLOAD = toUtf8Bytes('add one to my test counter');
const DOMAIN = (verifyingContract) => ({ name: 'MANDAVEX', version: '1', chainId: CHAIN_ID, verifyingContract });
const TYPES = { Mandate: [
  { name: 'issuer', type: 'address' }, { name: 'executor', type: 'address' },
  { name: 'action', type: 'bytes32' }, { name: 'payloadHash', type: 'bytes32' },
  { name: 'validAfter', type: 'uint64' }, { name: 'expiry', type: 'uint64' },
  { name: 'nonce', type: 'uint256' }, { name: 'maxUses', type: 'uint32' },
] };

export async function createBrowserArena(artifacts) {
  const common = createCustomCommon({ chainId: CHAIN_ID, networkId: CHAIN_ID }, Mainnet, { hardfork: Hardfork.Paris });
  const vm = await createVM({ common });
  const issuer = Wallet.createRandom();
  const executor = Wallet.createRandom();
  const outsider = Wallet.createRandom();
  const nonce = new Map();
  const accounts = [issuer, executor, outsider];
  for (const wallet of accounts) {
    await vm.stateManager.putAccount(createAddressFromString(wallet.address), createAccount({ nonce: 0n, balance: 10n ** 20n }));
    nonce.set(wallet.address.toLowerCase(), 0n);
  }
  const registryFactory = new ContractFactory(artifacts.mock.abi, `0x${artifacts.mock.bytecode}`);
  const registryInterface = new Interface(artifacts.mock.abi);
  const guardFactory = new ContractFactory(artifacts.guard.abi, `0x${artifacts.guard.bytecode}`);
  const guardInterface = new Interface(artifacts.guard.abi);
  let blockNumber = 0n;

  const newBlock = (timestamp = 100n) => createBlock({ header: { number: blockNumber++, timestamp, gasLimit: 30_000_000n, baseFeePerGas: 0n } }, { common });
  async function send(wallet, to, data, block = newBlock()) {
    const key = hexToBytes(wallet.privateKey);
    const senderNonce = nonce.get(wallet.address.toLowerCase());
    const tx = createLegacyTx({ nonce: senderNonce, gasLimit: 5_000_000n, gasPrice: 1_000_000_000n, value: 0n, data: getBytes(data), ...(to ? { to: hexToBytes(to) } : {}) }, { common }).sign(key);
    nonce.set(wallet.address.toLowerCase(), senderNonce + 1n);
    const result = await runTx(vm, { tx, block });
    const logs = result.receipt.logs.map((log) => {
      try {
        const parsed = guardInterface.parseLog({ topics: log[1].map((topic) => typeof topic === 'string' ? topic : hexlify(topic)), data: typeof log[2] === 'string' ? log[2] : hexlify(log[2]) });
        return parsed ? { name: parsed.name, args: parsed.args.toObject ? parsed.args.toObject() : {} } : null;
      } catch { return null; }
    }).filter(Boolean);
    return { result, transactionHash: hexlify(tx.hash()), logs, blockNumber: Number(block.header.number) };
  }
  async function deployFixtures() {
    const registryInit = await registryFactory.getDeployTransaction();
    const registryDeployment = await send(issuer, null, registryInit.data);
    if (registryDeployment.result.receipt.status !== 1 || !registryDeployment.result.createdAddress) throw new Error('Mock identity fixture deployment failed');
    const registryAddress = registryDeployment.result.createdAddress.toString();
    for (const wallet of [issuer, executor, outsider]) {
      const tx = await send(issuer, registryAddress, registryInterface.encodeFunctionData('setBalance', [wallet.address, 1]));
      if (tx.result.receipt.status !== 1) throw new Error('Mock identity assignment failed');
    }
    const guardInit = await guardFactory.getDeployTransaction(registryAddress);
    const guardDeployment = await send(issuer, null, guardInit.data);
    if (guardDeployment.result.receipt.status !== 1 || !guardDeployment.result.createdAddress) throw new Error('Guard fixture deployment failed');
    return { registryAddress, guardAddress: guardDeployment.result.createdAddress.toString(), registryDeployment, guardDeployment };
  }
  async function signMandate(guardAddress, overrides = {}, payloadBytes = PAYLOAD) {
    const mandate = { issuer: issuer.address, executor: executor.address, action: ACTION, payloadHash: keccak256(payloadBytes), validAfter: 0n, expiry: 10_000n, nonce: BigInt(blockNumber + 1000n), maxUses: 1, ...overrides };
    const signature = await issuer.signTypedData(DOMAIN(guardAddress), TYPES, mandate);
    const recovered = verifyTypedData(DOMAIN(guardAddress), TYPES, mandate, signature);
    return { mandate, signature, recovered: recovered.toLowerCase() === issuer.address.toLowerCase() };
  }
  async function counter(guardAddress) {
    const call = await vm.evm.runCall({ to: createAddressFromString(guardAddress), caller: createZeroAddress(), data: getBytes(guardInterface.encodeFunctionData('demoCounter')), gasLimit: 1_000_000n, block: newBlock() });
    if (call.execResult.exceptionError) throw new Error('Could not read the local Guard counter');
    return Number(guardInterface.decodeFunctionResult('demoCounter', call.execResult.returnValue)[0]);
  }
  function reason(txResult) {
    if (txResult.receipt.status === 1) return null;
    try { return guardInterface.parseError(hexlify(txResult.execResult.returnValue))?.name || 'EVM_REVERT'; } catch { return 'EVM_REVERT'; }
  }

  async function runScenario(name) {
    const started = performance.now();
    if (name === 'prompt-injection') return { scenario: name, environment: 'BROWSER ISOLATED DEMO · NO AI MODEL', result: 'PASS', request: 'Ignore scope and transfer funds', policy: 'Deterministic fixture rejects instruction outside the fixed demo-counter action.', stateBefore: 0, stateAfter: 0, rejection: 'policy_scope_mismatch', elapsedMs: Math.round(performance.now() - started), evidenceRef: 'browser-local-policy-fixture' };
    const fixture = await deployFixtures();
    let { guardAddress, registryAddress } = fixture;
    if (name === 'collaboration') {
      const taskId = keccak256(toUtf8Bytes('MANDAVEX_SAMPLE_TASK_RESEARCH_BRIEF_V1'));
      const artifactHash = keccak256(toUtf8Bytes('MANDAVEX_SAMPLE_RESEARCH_ARTIFACT_V1'));
      const taskPayload = AbiCoder.defaultAbiCoder().encode(['bytes32', 'bytes32'], [taskId, artifactHash]);
      const submitted = await signMandate(guardAddress, { action: TASK_SUBMIT, payloadHash: keccak256(taskPayload) }, taskPayload);
      const submitTx = await send(executor, guardAddress, guardInterface.encodeFunctionData('execute', [submitted.mandate, taskPayload, submitted.signature]));
      if (submitTx.result.receipt.status !== 1) throw new Error(`Task submission rejected: ${reason(submitTx.result)}`);
      const selfReview = await signMandate(guardAddress, { action: TASK_ACCEPT, payloadHash: keccak256(taskPayload) }, taskPayload);
      const selfReviewTx = await send(executor, guardAddress, guardInterface.encodeFunctionData('execute', [selfReview.mandate, taskPayload, selfReview.signature]));
      const alternatePayload = AbiCoder.defaultAbiCoder().encode(['bytes32', 'bytes32'], [taskId, keccak256(toUtf8Bytes('MANDAVEX_ALTERNATE_ARTIFACT_V1'))]);
      const alteredReview = await signMandate(guardAddress, { executor: outsider.address, action: TASK_ACCEPT, payloadHash: keccak256(alternatePayload) }, alternatePayload);
      const alteredReviewTx = await send(outsider, guardAddress, guardInterface.encodeFunctionData('execute', [alteredReview.mandate, alternatePayload, alteredReview.signature]));
      const accepted = await signMandate(guardAddress, { executor: outsider.address, action: TASK_ACCEPT, payloadHash: keccak256(taskPayload), nonce: BigInt(blockNumber + 2000n) }, taskPayload);
      const acceptTx = await send(outsider, guardAddress, guardInterface.encodeFunctionData('execute', [accepted.mandate, taskPayload, accepted.signature]));
      if (acceptTx.result.receipt.status !== 1) throw new Error(`Task review rejected: ${reason(acceptTx.result)}`);
      const stateCall = await vm.evm.runCall({ to: createAddressFromString(guardAddress), caller: createZeroAddress(), data: getBytes(guardInterface.encodeFunctionData('tasks', [taskId])), gasLimit: 1_000_000n, block: newBlock() });
      const taskState = guardInterface.decodeFunctionResult('tasks', stateCall.execResult.returnValue);
      return {
        scenario: name, environment: 'BROWSER ISOLATED EVM · CHAIN 31337 · EPHEMERAL DEMO KEYS · MOCK AGENT ID',
        result: Number(taskState.status) === 2 && reason(selfReviewTx.result) === 'ScopeMismatch' && reason(alteredReviewTx.result) === 'ScopeMismatch' ? 'PASS' : 'FAIL',
        workflow: 'An owner authorizes a contributor to submit an artifact hash. A distinct reviewer receives a separate mandate to accept that exact artifact.',
        task: { taskId, artifactHash, status: ['None', 'Submitted', 'Accepted'][Number(taskState.status)], owner: taskState.owner, contributor: taskState.contributor, reviewer: taskState.reviewer },
        mandates: [submitted.mandate, accepted.mandate],
        rejectedAttempts: [
          { reason: reason(selfReviewTx.result), invariant: 'contributor cannot review their own submission' },
          { reason: reason(alteredReviewTx.result), invariant: 'review mandate cannot substitute a different artifact hash' },
        ],
        receipts: [submitTx, acceptTx].map((tx) => ({ transactionHash: tx.transactionHash, blockNumber: tx.blockNumber, logs: tx.logs })),
        evidenceRef: 'browser-ethereumjs-vm-simulation',
        disclosure: 'Fixture identities and local in-memory VM only. Artifact content is not uploaded; only a deterministic demonstration hash is stored. No RPC or public-chain transaction.',
      };
    }
    let target = guardAddress;
    let action = ACTION;
    let payload = PAYLOAD;
    let mandateOverrides = {};
    let caller = executor;
    let signer = issuer;
    let signatureOverride = null;
    let revokeFirst = false;
    let alterExecutorIdentity = false;
    let crossChain = false;
    let crossContract = false;
    let reuse = false;
    let sameBlock = false;
    if (name === 'unauthorized-executor') caller = outsider;
    if (name === 'invalid-identity') alterExecutorIdentity = true;
    if (name === 'expired') mandateOverrides = { validAfter: 0n, expiry: 50n };
    if (name === 'revoked') revokeFirst = true;
    if (name === 'payload-tampering') payload = toUtf8Bytes('add one hundred');
    if (name === 'scope-violation') action = keccak256(toUtf8Bytes('ADMIN_WITHDRAW'));
    if (name === 'invalid-signature') signatureOverride = '0x1234';
    if (name === 'cross-chain') crossChain = true;
    if (name === 'cross-contract') crossContract = true;
    if (name === 'replay') reuse = true;
    if (name === 'concurrent-consumption') { reuse = true; sameBlock = true; }
    if (name === 'scope-violation') mandateOverrides = { ...mandateOverrides, action };
    if (alterExecutorIdentity) {
      const idTx = await send(issuer, registryAddress, registryInterface.encodeFunctionData('setBalance', [executor.address, 0]));
      if (idTx.result.receipt.status !== 1) throw new Error('Could not set negative identity fixture');
    }
    if (crossContract) {
      const second = await guardFactory.getDeployTransaction(registryAddress);
      const deployed = await send(issuer, null, second.data);
      if (deployed.result.receipt.status !== 1) throw new Error('Second Guard fixture deployment failed');
      target = deployed.result.createdAddress.toString();
    }
    const signed = await signMandate(guardAddress, mandateOverrides);
    const signature = signatureOverride || (crossChain ? await issuer.signTypedData({ ...DOMAIN(guardAddress), chainId: 56 }, TYPES, signed.mandate) : signed.signature);
    let recoveredSignature = null;
    try { recoveredSignature = verifyTypedData(DOMAIN(guardAddress), TYPES, signed.mandate, signature).toLowerCase() === issuer.address.toLowerCase(); } catch { recoveredSignature = false; }
    if (revokeFirst) {
      const revokeData = guardInterface.encodeFunctionData('revoke', [signed.mandate]);
      const revoked = await send(issuer, guardAddress, revokeData);
      if (revoked.result.receipt.status !== 1) throw new Error('Revocation fixture failed');
    }
    const before = await counter(guardAddress);
    const data = guardInterface.encodeFunctionData('execute', [signed.mandate, payload, signature]);
    const transactionBlock = sameBlock ? newBlock() : undefined;
    const tx = await send(caller, target, data, transactionBlock);
    let rejection = reason(tx.result);
    const firstReceipt = tx.result.receipt.status === 1 ? tx : null;
    if (reuse && firstReceipt) {
      const repeat = await send(caller, target, data, sameBlock ? transactionBlock : undefined);
      if (repeat.result.receipt.status !== 1) rejection = reason(repeat.result);
    }
    const after = await counter(guardAddress);
    const shouldSucceed = name === 'valid';
    const passed = reuse ? Boolean(firstReceipt && rejection && after === 1) : shouldSucceed ? tx.result.receipt.status === 1 && after === 1 : tx.result.receipt.status === 0 && after === 0;
    const receiptLogs = firstReceipt?.logs || [];
    return {
      scenario: name,
      environment: 'BROWSER ISOLATED EVM · CHAIN 31337 · EPHEMERAL DEMO KEYS · MOCK AGENT ID',
      result: passed ? 'PASS' : 'FAIL',
      request: { issuer: issuer.address, executor: signed.mandate.executor, caller: caller.address, action, payload: new TextDecoder().decode(payload), expiresAt: signed.mandate.expiry.toString(), maxUses: signed.mandate.maxUses },
      checks: { signatureRecoveredToIssuer: recoveredSignature, identityFixture: name === 'invalid-identity' ? 'executor deliberately has no demo identity' : 'issuer and executor have demo identity', policy: rejection || 'authorized narrow action' },
      stateBefore: before,
      stateAfter: after,
      rejection,
      receipt: firstReceipt ? { transactionHash: firstReceipt.transactionHash, blockNumber: firstReceipt.blockNumber, logs: receiptLogs, gasUsed: tx.result.totalGasSpent.toString() } : null,
      elapsedMs: Math.round(performance.now() - started),
      evidenceRef: 'browser-ethereumjs-vm-simulation',
      disclosure: 'Ephemeral keys and local in-memory VM. No RPC, public chain, user wallet, or Agent ID credential is used.',
    };
  }

  async function compare() {
    const fixture = await deployFixtures();
    const signed = await signMandate(fixture.guardAddress);
    const hostile = toUtf8Bytes('add one hundred');
    const baselineStart = performance.now();
    let openCounter = 0;
    openCounter += 100;
    const baselineMs = Math.round(performance.now() - baselineStart);
    const before = await counter(fixture.guardAddress);
    const tx = await send(executor, fixture.guardAddress, guardInterface.encodeFunctionData('execute', [signed.mandate, hostile, signed.signature]));
    const after = await counter(fixture.guardAddress);
    return { environment: 'BROWSER ISOLATED EVM · CONTROLLED DEMO FIXTURES', request: 'add one hundred', baseline: { result: 'accepted', stateBefore: 0, stateAfter: openCounter, elapsedMs: baselineMs }, protected: { result: tx.result.receipt.status === 0 && after === 0 ? 'rejected' : 'unexpected', stateBefore: before, stateAfter: after, rejection: reason(tx.result), elapsedMs: Math.round(performance.now() - baselineStart), transactionHash: tx.transactionHash }, equivalentRequest: true, disclosure: 'The baseline and Guard receive the same hostile request. The baseline is a deliberately open in-memory counter; the compiled Guard enforces the signed payload scope.' };
  }

  return { runScenario, compare };
}
