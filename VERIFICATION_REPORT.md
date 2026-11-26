# VERIFICATION_REPORT

Updated 2026-11-26. Current public checkpoint: `467cbbfb15c87c4fe31bd2367c1f28c4a12c203b`. This report distinguishes local demo evidence from production protocol evidence.

## Operation Titanium local verification

The current unpublished workspace implements a fixed task collaboration workflow in the Guard: the owner authorizes a contributor to submit a task and artifact hash; a distinct Agent ID executor can accept only the exact hash under a separate owner-signed mandate. Invalid payload lengths, duplicate submissions, wrong owners, self-review and artifact substitution are rejected. The browser Arena runs the compiled Solidity in its local VM and records both transitions. Hashes refer to a demonstration artifact; no artifact bytes are uploaded or checked by the contract.

`npm test` completed with 40 passed and 0 failed, including two BNB mainnet-state fork probes at block 135770097. The holder probe passes only the two Agent ID gates and then stops at an intentionally invalid signature; it is not a real-holder signed execution. `npm run compile:contracts` succeeded with solc 0.8.39, optimizer 200, Paris EVM, and 5,634-byte creation bytecode. `npm run build:web` succeeded with a 767 KiB browser worker. The authorized `npm audit --audit-level=low` found 0 vulnerabilities. Local-only results and boundaries are recorded in `evidence/operation-titanium-local.json`.

Slither 0.11.6 now produces three observations across 102 detectors: timestamp comparison, signature-parsing assembly, and registry staticcall. An initial complexity score of 12 was removed by extracting the same ordered checks into internal validation helpers. The bundled compiler wrapper still reports a Python path warning and returns exit code 1, so this is PARTIALLY IMPLEMENTED static-analysis evidence. Details are in `evidence/slither-titanium-report.txt`; this is not an audit.

The release is published at `467cbbf`. CI and Pages both succeeded; public build metadata matches the commit, and `main.js`, `arena-worker.js`, and `arena-artifacts.json` returned HTTP 200. An interactive browser run of the new collaboration button is not yet verified. Genesis handler tests use mock D1; shared persistence remains unconfigured pending founder completion of Cloudflare OAuth consent. The indexer tests use mocked providers; no deployed Guard has been scanned. No mainnet Guard deployment, public-chain task interaction, qualifying participation, or spend is claimed.

## VERIFIED
- Official Binance hackathon announcement states the Agent ID contract address, `balanceOf` eligibility rule, submission window, eligibility and scoring.
- Official announcement states the 30 distinct Agent ID address interaction threshold, judging weights, and published safety restrictions.
- Direct BSC RPC: Agent ID address has 8,756 bytes runtime code at time of read; supports ERC-721 and ERC-721 Metadata, not ERC-721 Enumerable. EIP-1967 implementation storage slot was zero; this does not exclude non-EIP-1967 upgrade patterns.
- RPC observations and limitations recorded in `evidence/agent-id-bsc-rpc-check.json` at block 135734359.
- Workspace recovery preserved the transferred Git history and Phase III work; local checkpoint `f61525b` is on public `main`.
- Reviewed prototype, CI and static preview are published in public `MANDAVEX/protocol` on `main`; this report records their evidence and limitations.
- Latest `npm test`: 21 pass, 0 fail, including browser Arena EVM scenarios, local EVM lifecycle/adversarial checks, SDK/source checks and two BSC mainnet-state fork probes at block 135760977. The holder probe stops at intentionally invalid signature; it does not establish successful holder-signed execution. See `evidence/runtime-test-report.txt`.
- `npm run compile:contracts` and `npm run build:web` succeeded; CI independently completed both workflows for the same public commit.
- `npm run compile:contracts`: succeeds with solc 0.8.39, optimizer 200, Paris EVM.
- `npm audit --audit-level=low`: found 0 vulnerabilities in the current lockfile on 2026-11-26.
- Read-only BSC mainnet RPC estimated 877,599 deployment gas and 0.0000526559 BNB using a sampled 0.05 gwei price at block 135741871, with 20% gas-limit headroom. The unsigned preparation script sent nothing; the estimate is not guaranteed. See `evidence/bsc-mainnet-deployment-estimate.json`.
- Slither 0.11.6 analyzed one contract with 102 detectors and found 3 observations documented in `evidence/slither-report.txt`. They concern timestamps, assembly, and the deliberate low-level registry static call; this is static analysis, not an audit.
- GitHub Actions CI and Pages both succeeded on commit `f61525b873a4009e494a19a3bd85e326ab411cf1`: [CI](https://github.com/MANDAVEX/protocol/actions/runs/45739353053), [Pages](https://github.com/MANDAVEX/protocol/actions/runs/45739353102). The public page, build metadata, main script, browser worker and contract artifacts all returned HTTP 200; `build-info.json` contained the matching commit.
- Public browser smoke: the Arena rendered all 13 scenarios. “Valid signed action” passed in the browser EVM with an `ActionAuthorized` event and counter 0→1. “Payload tampering” passed by rejecting with `ScopeMismatch` and counter 0→0. Both disclosed ephemeral keys, mock identities, chain 31337 and no RPC/mainnet transaction. See `evidence/public-arena-deployment.json`.
- Clean dependency install `npm ci --no-audit --no-fund` completed; tests passed afterward.
- Public static preview with the interactive browser Arena is available at `https://mandavex.github.io/protocol/`. The Arena performs no public-chain transaction; the production Guard remains undeployed.
- Official Binance announcement currently states the submission period ends 2026-12-09 08:00 UTC. Eligibility requires a live BNB Chain product, verified source, and at least 30 distinct Agent ID holders interacting during the submission window. Source: [official announcement](https://www.binance.com/en/support/announcement/detail/95f5dbe0ea674a48a739b59e046648bf).

## IMPLEMENTED BUT UNVERIFIED
- Guard lifecycle and adversarial cases run locally, but the contract is experimental, not independently reviewed, deployed, or audited.
- Fork integration loads the official production registry and rejects a non-holder. Positive execution by a genuine holder is not tested.
- Static preview offers wallet connection and direct registry reads. Page and Arena were exercised in-browser; wallet connection/RPC behavior was not exercised, and there is no configured Guard deployment.
- SDK typed-data construction is tested; browser-wallet signing/submission and a holder's full positive path are not.

## NOT IMPLEMENTED
- Agent ID verified ABI/source and full upgrade/lifecycle analysis, complete application workflow, Guard deployment, independent audit, holder-positive path, Genesis, live adoption, video, submission.

No production contract transaction or deployment result is claimed. The public website is a static preview only.
