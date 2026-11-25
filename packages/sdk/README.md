# MANDAVEX SDK (early)

This minimal helper builds EIP-712 typed data for the initial Guard. It does not send transactions or claim a deployment exists.

```js
const { typedMandate } = require('./packages/sdk');

const typedData = typedMandate({
  issuer, executor, action, payloadHash,
  validAfter, expiry, nonce, maxUses: 1,
}, 56, guardAddress);

// Pass `typedData` to a wallet's standard typed-data signing method.
// The issuer must review the exact mandate and retain transaction control.
```

See `contracts/src/MandavexGuard.sol` for the exact field types and checks. The helper remains experimental until a real-wallet signature is tested against a local EVM deployment.
