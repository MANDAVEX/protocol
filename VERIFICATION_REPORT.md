# VERIFICATION_REPORT

Updated 2026-11-26. Latest isolated run: `npm test`, 21 passed / 0 failed; BSC fork block 135760977. Local checkpoint exists; not published.

## VERIFIED
- Official Binance hackathon announcement states the Agent ID contract address, `balanceOf` eligibility rule, submission window, eligibility and scoring.
- Official announcement states the 30 distinct Agent ID address interaction threshold, judging weights, and published safety restrictions.
- Direct BSC RPC: Agent ID address has 8,756 bytes runtime code at time of read; supports ERC-721 and ERC-721 Metadata, not ERC-721 Enumerable. EIP-1967 implementation storage slot was zero; this does not exclude non-EIP-1967 upgrade patterns.
- RPC observations and limitations recorded in `evidence/agent-id-bsc-rpc-check.json` at block 135734359.
- Initial project setup notes reported an empty directory, but current transferred workspace includes the complete Git repository and uncommitted Phase III changes; Foundry is not installed.
- Reviewed prototype, CI and static preview are published in public `MANDAVEX/protocol` on `main`; this report records their evidence and limitations.
- Latest `npm test`: 21 pass, 0 fail, including browser Arena EVM scenarios, local EVM lifecycle/adversarial checks, SDK/source checks and two BSC mainnet-state fork probes at block 135760977. The holder probe stops at intentionally invalid signature; it does not establish successful holder-signed execution. See `evidence/runtime-test-report.txt`.
- `npm run compile:contracts` succeeds and `npm run build:web` generates the browser worker from current Guard source. This workspace build has not been published.
- `npm run compile:contracts`: succeeds with solc 0.8.39, optimizer 200, Paris EVM.
- Current lockfile dependency audit: BLOCKED. `npm audit` could not reach npm in the restricted environment. An elevated retry was rejected by automatic review because it transmits dependency metadata to npm. The earlier zero-vulnerability result predates the current lockfile and is not evidence for it.
- Read-only BSC mainnet RPC estimated 877,599 deployment gas and 0.0000526559 BNB using a sampled 0.05 gwei price at block 135741871, with 20% gas-limit headroom. The unsigned preparation script sent nothing; the estimate is not guaranteed. See `evidence/bsc-mainnet-deployment-estimate.json`.
- Slither 0.11.6 analyzed one contract with 102 detectors and found 3 observations documented in `evidence/slither-report.txt`. They concern timestamps, assembly, and the deliberate low-level registry static call; this is static analysis, not an audit.
- GitHub Actions CI and static Pages deployment both succeeded on commit `465c3884bb9881dea28a33c19807c527a4dc390c`. The public page, JavaScript and stylesheet returned HTTP 200, and an independent browser confirmed the visible build identifier matched that exact commit. The artifact metadata race was fixed by separating build/upload and deploy into dependent jobs. See `evidence/github-pages-deployment.json`, `evidence/pages-artifact-investigation.md`, [Pages workflow](https://github.com/MANDAVEX/protocol/actions/runs/45723672081) and [CI run](https://github.com/MANDAVEX/protocol/actions/runs/45723672142).
- Clean dependency install `npm ci --no-audit --no-fund` completed; tests passed afterward.
- Public static preview is available at `https://mandavex.github.io/protocol/`. It performs no transaction and is not the deployed protocol.
- Official Binance announcement currently states the submission period ends 2026-12-09 08:00 UTC. Eligibility requires a live BNB Chain product, verified source, and at least 30 distinct Agent ID holders interacting during the submission window. Source: [official announcement](https://www.binance.com/en/support/announcement/detail/95f5dbe0ea674a48a739b59e046648bf).

## IMPLEMENTED BUT UNVERIFIED
- Guard lifecycle and adversarial cases run locally, but the contract is experimental, not independently reviewed, deployed, or audited.
- Fork integration loads the official production registry and rejects a non-holder. Positive execution by a genuine holder is not tested.
- Static preview implements wallet connection and a direct registry read. Browser loaded the page and assets, but wallet connection/RPC behavior was not exercised; there is no configured Guard deployment.
- SDK typed-data construction is tested; browser-wallet signing/submission and a holder's full positive path are not.

## NOT IMPLEMENTED
- Agent ID verified ABI/source and full upgrade/lifecycle analysis, complete application workflow, Guard deployment, independent audit, holder-positive path, Genesis, live adoption, video, submission.

No production contract transaction or deployment result is claimed. The public website is a static preview only.
