# BLOCKERS

- Foundry is unavailable; Hardhat EVM tests are in place. Contract coverage is not measured.
- Verified Agent ID source, complete ABI, upgrade mechanism and holder-positive-path test remain unverified.
- Reviewed source, CI and Pages deployment are published on GitHub `main`; static preview is live at `https://mandavex.github.io/protocol/`.
- The live site is only a wallet-connected identity preview, with no Guard address or transaction workflow. Domain ownership/availability is unverified.
- No authorized deployment wallet or approved gas budget supplied; no mainnet transaction.
- No local source changes remain unpushed.
- `mandavex.io` resolves no DNS records; an RDAP lookup returned no domain record but availability and ownership are not verified.
- 30 genuine qualifying Agent ID holder interactions remain mandatory and unachieved.
- No longer blocked on deadline verification: official submission closes 2026-12-09 08:00 UTC.
- No end-to-end protocol frontend, independent security audit, authorized wallet review/signature, or competition submission. The available BNB fee is a point-in-time RPC estimate only.

## Phase III blockers (2026-11-26)

- The holder-positive fork probe has no valid holder EIP-712 signature. Successful guarded execution and official wallet integration remain unverified.
- Binance's documented external signing flow requires the holder to enable Developer Mode, inspect message/call previews and confirm any required app prompts. No `baw` CLI or connected Agentic Wallet session is present in this environment.
- The contract remains experimental and undeployed. Mainnet launch requires independent security review and an authorized human to approve deployment costs/transaction.
- Latest Pages failure was traced to an artifact lookup race: upload succeeded and the artifact was visible, while deploy found none. A standard two-job upload/deploy workflow fix has been prepared; confirm a new run on the next pushed commit.
- No Genesis credentials, public adoption index, verified qualifying participants, interactive Arena or competition submission exist.
