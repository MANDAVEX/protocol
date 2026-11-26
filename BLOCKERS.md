# BLOCKERS

- Foundry is unavailable; Hardhat EVM tests are in place. Contract coverage is not measured.
- Verified Agent ID source, complete ABI, upgrade mechanism and holder-positive-path test remain unverified.
- Reviewed source, CI and Pages deployment are published on GitHub `main`; static preview is live at `https://mandavex.github.io/protocol/`.
- The live site now includes the browser EVM Arena and wallet-connected identity preview, but has no Guard address or production transaction workflow. Domain ownership/availability is unverified.
- No authorized deployment wallet or approved gas budget supplied; no mainnet transaction.
- The reviewed browser Arena, SDK, activity indexer and updated evidence are published on GitHub `main` and Pages. Genesis runtime configuration and production workflow remain unfinished.
- `mandavex.io` resolves no DNS records; an RDAP lookup returned no domain record but availability and ownership are not verified.
- 30 genuine qualifying Agent ID holder interactions remain mandatory and unachieved.
- No longer blocked on deadline verification: official submission closes 2026-12-09 08:00 UTC.
- The public site now includes the local browser Arena, but no production Guard address or browser mandate lifecycle exists. No independent security audit, authorized holder signature, production transaction, or competition submission exists. The available BNB fee is a point-in-time RPC estimate only.

## Phase III blockers (2026-11-26)


- The holder-positive fork probe has no valid holder EIP-712 signature. Successful guarded execution and official wallet integration remain unverified.
- Binance's documented external signing flow requires the holder to enable Developer Mode, inspect message/call previews and confirm any required app prompts. No `baw` CLI or connected Agentic Wallet session is present in this environment.
- The contract remains experimental and undeployed. Mainnet launch requires independent security review and an authorized human to approve deployment costs/transaction.
- Latest Pages failure was traced to an artifact lookup race: upload succeeded and the artifact was visible, while deploy found none. The two-job upload/deploy fix succeeded on commit `465c3884bb9881dea28a33c19807c527a4dc390c`; see `evidence/pages-artifact-investigation.md`.
- No Genesis credentials, public adoption index, or verified qualifying participants exist. The interactive Arena currently runs only on local controlled fixtures; no competition submission exists.
- The local official-wallet skill is preparatory only; it stops before signing while no reviewed Guard deployment exists.
