# VERIFICATION_REPORT

Updated 2026-11-26. Public checkpoint: `f61525b873a4009e494a19a3bd85e326ab411cf1`. This report distinguishes local demo evidence from production protocol evidence.

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
