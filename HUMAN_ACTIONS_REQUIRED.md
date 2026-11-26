# HUMAN_ACTIONS_REQUIRED

## Immediate positive-path wallet action

The next successful authorization probe needs a real signature from an Agent ID holder. The test can use a holder's own Agentic Wallet address as both issuer and executor. Never use another person's address or impersonate an address outside the local fork. A guarded workflow instruction artifact is at `skills/mandavex-agentic-wallet/SKILL.md`.

When the wallet exercise is staged, the holder must:

1. Use the official Binance Agentic Wallet integration and enable Developer Mode in the Binance App (Agentic Wallet management → Settings → Developer Mode), reviewing Binance's warning.
2. Inspect and approve the exact EIP-712 mandate preview. It is scoped to the Guard contract, BSC chain 56, the demo counter increment, one exact payload, a short expiry and one use.
3. Inspect and approve the contract-call preview. This executes only the `MandavexGuard.execute` action. Do not proceed if the Guard address, action, payload, fee or simulation differs from the review.
4. Confirm any additional Binance App prompt. The test runs against a local BSC fork and is not mainnet activity.

The official CLI is not installed or authenticated in this workspace, the Guard has no production address, and the fork signing harness is not yet staged; stop before signing or transacting. No signature or secret is requested in chat. Do not use Binance web QR pairing; if the owner later chooses to authenticate, use the official mobile-app flow and retain all wallet confirmations.

## Mainnet launch (not ready for approval)

Do not approve a deployment transaction yet. The Guard is experimental, not independently audited and has not completed a genuine holder-signed execution. Once those gates pass, a human with an authorized project deployment wallet must review the final source/constructor and exact gas estimate, then approve the transaction in their own wallet. No seed phrase or private key should be shared.

## Competition participation

An Agent ID holder must initiate any real qualifying interaction from their own wallet. Only after a deployed product is working should an authorized project participant submit the project during the official window. No paid service, domain purchase, social post or mainnet spend has been made.
