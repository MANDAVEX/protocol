# MANDAVEX SDK (early)

This early, local SDK exposes TypeScript declarations for EIP-712 data, execute-call encoding and receipt verification. The runtime remains experimental. It does not submit transactions or imply a production deployment.

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
