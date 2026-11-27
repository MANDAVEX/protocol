---
name: mandavex-agentic-wallet
description: Prepare and review a MANDAVEX demo-counter mandate using Binance Agentic Wallet. Requires a reviewed Guard deployment and the official Binance Agentic Wallet skill. Never handles secrets or bypasses a wallet confirmation.
---

# MANDAVEX Agentic Wallet workflow

Use only with the official Binance Agentic Wallet skill and a deployment that has been independently reviewed and explicitly approved for the requested network. The current MANDAVEX Guard is experimental and has no production deployment. Until a reviewed Guard address and matching chain-specific manifest are supplied, stop before signing or sending any transaction.

## Safety gates

1. Read `deployments/manifest.json`. Stop if the requested network does not have a verified Guard address, deployed bytecode reference, source commit, and registry address. Do not infer addresses from examples or local artifacts.
2. Confirm the target chain, Guard address, immutable Agent ID registry address, and reviewed source commit match the deployment manifest. For BNB Smart Chain mainnet the chain ID is 56. Never use a fork address as a mainnet address.
3. Require the issuer and executor to be the participating user's own Agent ID wallet. Do not use a third party's wallet, impersonate a holder, ask for a seed phrase/private key, or request browser QR pairing.
4. As soon as the request is known to require external signing, first check `baw wallet settings --json`. Do this before constructing typed data, calldata or a preview. Stop if Developer Mode is off or expired; a human must enable it in the Binance App and approve its risk warning before the CLI continues.
5. Show every typed-data field and transaction preview to the user. Get explicit approval immediately before each wallet `execute` action. Honor any additional Binance App confirmation. A pending request is not approval and is not a signature.
6. Never deploy, revoke, submit a transaction, or spend funds unless the user explicitly requested that exact action and approved its displayed details.

## Current implementation boundary

The only action supported by the experimental Guard is `MANDAVEX_DEMO_INCREMENT_V1`; it increments a demo counter and holds no assets. There is no deployed production Guard, so this workflow is currently preparatory and must stop before constructing or signing a mandate. Do not claim a successful wallet integration, production execution, or competition-qualified interaction from a preview or local fork.

## Procedure after a reviewed deployment exists

1. Check the official CLI state:

   ```text
   baw wallet settings --json
   ```

2. Only after Developer Mode is confirmed, prepare one narrow mandate from the deployed Guard ABI and SDK. It must bind chain ID, verifying contract, Agent ID issuer, Agent ID executor, a supported action, exact payload hash, a validity period of at most 24 hours, a fresh nonce, and a bounded use count. The Guard's EIP-712 domain is `MANDAVEX`, version `1`; the struct type is `Mandate(address issuer,address executor,bytes32 action,bytes32 payloadHash,uint64 validAfter,uint64 expiry,uint256 nonce,uint32 maxUses)`. Use project encoder output; never hand-edit a signature or relax a field to make it pass.
3. Wrap typed data as the full documented `eth_signTypedData_v4` request: method plus `[issuerAddress, JSON.stringify(typedData)]`. The CLI emits this as `agenticWalletSignRequestJson`. Inspect all fields before passing it to `--message`:

   ```text
   baw sign-message preview --binanceChainId 56 --signType EIP712 --message '<eth_signTypedData_v4 request JSON>' --json
   ```

4. Present the exact preview to the user and obtain explicit approval. Only then use the official `sign-message execute` operation with the preview request ID. If the app asks for confirmation, wait for the user to confirm and retrieve the completed result with the documented `sign-message result --order-id <orderId> --json` operation. Stop on rejection, timeout, mismatched signer, or malformed result.
5. Encode the `execute(mandate, payload, signature)` call locally using the deployed ABI. Preview it:

   ```text
   baw contract-call preview --binanceChainId 56 --from <issuer-and-executor> --to <manifest-Guard-address> --inputData <calldata> --json
   ```

6. Inspect the decoded target, calldata, simulation, risk output, and fee. Ask for explicit approval of this exact transaction. Only then use the official `contract-call execute --requestId <requestId> --json` operation and honor any app confirmation. Stop if preview or simulation fails or differs from the approved request.
7. Independently verify the returned transaction receipt, `ActionAuthorized` event, counter state, issuer/executor identity at the receipt block, and transaction on the chain explorer. Report the exact network and block. Never describe fork results as mainnet activity.

## Official references

- [Binance Agentic Wallet documentation](https://developers.binance.com/en/docs/products/agentic-wallet/welcome)
- [Official Binance Agentic Wallet skill](https://github.com/binance/binance-skills-hub/tree/main/skills/binance-web3/binance-agentic-wallet)
- [External signing reference](https://github.com/binance/binance-skills-hub/blob/main/skills/binance-web3/binance-agentic-wallet/references/external-sign.md)
