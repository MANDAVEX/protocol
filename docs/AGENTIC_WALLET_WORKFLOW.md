# Binance Agentic Wallet integration readiness

**Evidence status: IMPLEMENTED BUT UNVERIFIED.** The SDK/CLI generate the Guard's typed mandate, EIP-712 request envelope, execution calldata template and revocation calldata. This machine does not have a connected Binance Agentic Wallet session or a deployed Guard. No BAW preview, signature, or transaction has been performed.

## Mandatory safety order

The current official Binance skill requires an early Developer Mode check. As soon as a requested action needs `contract-call` or `sign-message`, run `baw wallet settings --json` **before** constructing typed data, calldata or a preview. Stop unless `devMode.enabled` is true and `devMode.expiresAt` is in the future. Developer Mode is enabled in the Binance App and has a human-confirmed risk warning. Do not bypass it or request wallet secrets.

The official external-sign flow is two-step: preview, inspect the parsed operation and risks, obtain explicit human approval, then execute only the exact preview `requestId`. Any required Binance App confirmation remains with the wallet holder. A preview or pending request is not a signature or transaction.

## Prepare a mandate

Once the official Developer Mode check passes and a reviewed Guard is deployed, prepare task actions using the project CLI. Use addresses controlled by the participating issuer and executor, the official BNB Agent ID registry, a fresh nonce, a short validity window (no more than the contract's 24-hour cap) and one use unless the reviewed use case requires otherwise.

```powershell
npm run mandate:prepare -- --issuer $ISSUER --executor $EXECUTOR --guard $GUARD --chain 56 --nonce $NONCE --expiry $EXPIRY --action submit-task --task-id $TASK_ID --artifact-hash $ARTIFACT_HASH
```

For `accept-task`, retain the same task ID and artifact hash and use the task owner as the mandate issuer with a distinct reviewer as executor. The mainnet CLI refuses to prepare typed data unless the requested Guard matches a deployed address in `deployments/manifest.json`. Local `31337` data is fixture-only and cannot be used on mainnet.

The CLI prints `agenticWalletSignRequestJson`, which is the official full request envelope:

```json
{"method":"eth_signTypedData_v4","params":["<issuer wallet>","<serialized EIP-712 typed data>"]}
```

Pass that complete string to the official preview command and inspect the returned parsed message, risk report, wallet and request ID:

```powershell
baw sign-message preview --binanceChainId 56 --signType EIP712 --message $SIGN_REQUEST_JSON --json
```

After the user has approved the exact preview, execute only its request ID. If the app creates an order, wait for user confirmation and retrieve it using the official result command. Confirm the returned signer equals the mandate issuer.

## Preview and submit an execution

Insert the returned signature into the CLI's unsigned execution template with the SDK. Then preview the exact Guard call:

```powershell
baw contract-call preview --binanceChainId 56 --from $EXECUTOR --to $GUARD --inputData $CALLDATA --json
```

Review decoded target, data, simulation, risk output, authority changes and fee with the user. Execute only after explicit approval of the exact request. Any app-level confirmation remains with the wallet holder. No transaction is allowed when the preview fails or differs from the approved call.

## Verify a public receipt

After a confirmed transaction, verify from an independent BSC RPC:

```powershell
npm run verify:receipt -- --tx $TRANSACTION_HASH
```

The command reads the BNB Chain deployment manifest, checks chain ID, transaction/receipt status, Guard target, canonical block hash and the `ActionAuthorized` event, and reports the exact block. It stops before any RPC call when no deployed Guard is recorded. This receipt proves the Guard event and encoded values, not the truth of off-chain work.

## Present limits

- No deployed reviewed Guard address is present. Mainnet typed-data preparation, receipt lookup and wallet execution remain unavailable.
- The static public site has no wallet-backed production mandate lifecycle; its Arena uses ephemeral local keys and a mock registry.
- No Binance CLI session is connected here, so the official `wallet settings`, preview, signature and contract-call paths have not been executed.
- Never ask for a seed phrase, private key, QR pairing code or OTP. Keep all wallet confirmations under the holder's direct control.

## Official references

- [Agentic Wallet skill](https://github.com/binance/binance-skills-hub/blob/main/skills/binance-web3/binance-agentic-wallet/SKILL.md)
- [External signing reference](https://github.com/binance/binance-skills-hub/blob/main/skills/binance-web3/binance-agentic-wallet/references/external-sign.md)
- [Agent ID hackathon rules](https://www.binance.com/en/support/announcement/detail/95f5dbe0ea674a48a739b59e046648bf)
