# MANDAVEX SDK (early)

This early SDK exposes TypeScript declarations for EIP-712 mandate data, fixed task-payload encoding, execute-call encoding and receipt verification. It does not sign or submit transactions and does not imply a production deployment.

The Guard's task workflow uses two fixed action hashes: `ACTION_TASK_SUBMIT` and `ACTION_TASK_ACCEPT`. `encodeTaskPayload(taskId, artifactHash)` returns the canonical ABI bytes for the task ID and artifact commitment. The owner signs the same complete EIP-712 mandate that the executor reviews in their wallet; the SDK does not hold signing material.

```js
const { typedMandate, encodeExecute, verifyReceipt } = require('./packages/sdk');

const typedData = typedMandate({
  issuer, executor, action, payloadHash,
  validAfter, expiry, nonce, maxUses: 1,
}, 56, guardAddress);

// Sign typedData with an explicitly authorized wallet; display and review all fields first.
const calldata = encodeExecute(typedData.message, payloadBytes, signature);
const checked = verifyReceipt(receipt, { issuer, executor, action, payloadHash }, guardAddress);
```

See `contracts/src/MandavexGuard.sol` for the exact field types and checks. The helper remains experimental until a real-wallet signature is tested against a local EVM deployment.
