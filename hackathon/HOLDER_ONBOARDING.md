# Agent ID holder onboarding (draft)

**Evidence status: IMPLEMENTED BUT UNVERIFIED.** This is a draft onboarding path; no messages have been sent and no holder participation has been recruited or counted.

## What a participant should know

MANDAVEX is an experimental, immutable BNB Chain authorization Guard. Agent ID `balanceOf(address) > 0` is checked for the mandate issuer and executor at execution. A mandate authorizes a specific action and exact payload for at most 24 hours and a signed use limit; its issuer can revoke it. The current contract is not independently audited or deployed, so no production wallet action is currently available.

The browser Arena uses only local mock identities and ephemeral keys. Running it does not connect a wallet, broadcast a transaction or count for the competition. A future real participant must use their own Agentic Wallet and directly inspect every signature and transaction preview. Never send a seed phrase, private key, QR pairing code or login code to the team.

## Onboarding sequence when a reviewed deployment exists

1. Share the published source, security review, deployment manifest, chain, registry, Guard address and live fee estimate before asking for any wallet action.
2. Let the holder read the exact mandate: issuer, executor, action, payload hash, expiry, nonce and use limit. Prefer a non-financial, demonstrable task action.
3. Ask the holder to check Agentic Wallet Developer Mode in the Binance App. If off or expired, the holder enables it and accepts the app's risk warning directly.
4. Show the official EIP-712 preview, parsed fields and risks. Stop unless every field matches the agreed action. The holder chooses whether to sign.
5. Show the exact contract-call preview and fee. Stop unless the decoded target and calldata match the approved mandate. The holder chooses whether to broadcast; no agent should accept a pending preview as consent.
6. Verify the transaction receipt, Guard event, canonical block, chain ID and Agent ID balances at the receipt block. Share the evidence and limitations with the participant.
7. Count activity only after an independent rules review confirms it meets current organizer criteria. Never promise eligibility, an award, tokens, financial returns or rewards.

## Official Agentic Wallet procedure (preparation only)

No wallet session has been run. Once a reviewed deployment and authorized holder workflow exist:

1. Holder runs `baw wallet settings --json`; stop unless Developer Mode is on and unexpired.
2. Prepare the exact `eth_signTypedData_v4` request with the holder's own wallet address as the signing account. Preview using `baw sign-message preview --binanceChainId 56 --signType EIP712 --message '<full eth_signTypedData_v4 request>' --json`.
3. Inspect `parsedMessage`, risks and authority changes. The holder confirms the exact `requestId` in the Binance app. A pending app confirmation is not completion.
4. Prepare the exact call using `baw contract-call preview --binanceChainId 56 --from <wallet> --to <verified-guard> --inputData <calldata> --json`. Inspect destination, chain, decoded calldata and fee. The holder confirms that exact request ID in the wallet.
5. Preserve the wallet's result and transaction hash. Independently verify the canonical receipt against chain 56 and the verified Guard. For tasks, include `--task-id`, `--artifact-hash` and `--task-status submitted|accepted` when running the receipt CLI.

Never bypass the preview/confirmation sequence, inject an unreviewed custom gas setting, or treat locally generated signatures as holder consent. See `../MAINNET_ACTIVATION.md` for the complete ordered gates and recovery path.

## Invitation draft

> MANDAVEX is building a small, open-source authorization Guard for autonomous agents on BNB Chain. Our preview demonstrates scoped mandates and permission-bound task review using local fixtures; it is not a production deployment. We are preparing a reviewed, no-custody prototype for Agent ID holders to inspect. Participation will be voluntary, use only your own wallet, show exact typed-data and transaction previews, and require your direct confirmation. We will not ask for wallet secrets or promise rewards. If you would like to review the source and security evidence when available, reply to the project team.

Do not send this invitation until the project chooses an approved channel and reviews the final public wording. No recipient list or platform post is included here.

## Record keeping

Keep participant contact details out of on-chain evidence. Do not publish names, wallet-to-person mapping or registration details without explicit permission. Save only public transaction hashes and the minimum chain evidence required for independent review. Distinguish candidate records from official qualification.
