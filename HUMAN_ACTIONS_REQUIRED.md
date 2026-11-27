# HUMAN_ACTIONS_REQUIRED

Updated: 2026-11-27 (Africa/Algiers)

## Mainnet deployment and production workflow

**Current state: BLOCKED.** The Guard has no deployment address, has not had independent security review, and the authorized project expenditure remains $0. No deployment or participant transaction is approved. The release candidate is under `releases/mandavex-guard-rc1/`; its manifest explicitly says `NOT APPROVED FOR MAINNET`.

The following actions require human authority and cannot be replaced with simulation:

1. An independent reviewer must review the final immutable Guard source, registry assumptions, threat model and remaining timestamp finding.
2. The founder must explicitly change the $0 budget authorization before any deployment cost is incurred. No change is assumed here.
3. After review and budget authorization, the deployment wallet owner must verify the exact source commit, compiler settings, constructor registry address, init code, current gas estimate and wallet transaction preview, then personally approve the transaction.
4. After deployment and source verification, an Agent ID holder must use their own official Binance Agentic Wallet, enable Developer Mode in the Binance App, inspect the exact EIP-712 signature preview and transaction preview, and personally confirm each required step. Do not ask them to provide credentials or a signature outside their wallet.
5. Genuine holders must initiate their own contract interactions. Competition participation and eligibility require actual on-chain evidence; local EVMs, forks, screenshots, registrations and website activity do not count.
6. An authorized project participant must submit the live eligible project during the official window and retain the submission confirmation.

The current technical package is preparation only. It does not authorize any transaction or wallet prompt. Agentic Wallet connection, live signing, mainnet deployment, qualifying activity and competition submission remain unverified or unimplemented as recorded in `ACCEPTANCE_GATES.md`.

## Out of scope for this release

Cloudflare authentication and token development are postponed by the takeover brief. Genesis remains inactive until its separately authorized infrastructure setup and privacy review are complete.
