# VERIFICATION_REPORT

Updated 2026-11-25.

## VERIFIED
- Official Binance hackathon announcement states the Agent ID contract address, `balanceOf` eligibility rule, submission window, eligibility and scoring.
- Official announcement states the 30 distinct Agent ID address interaction threshold, judging weights, and published safety restrictions.
- Direct BSC RPC: Agent ID address has 8,756 bytes runtime code at time of read; supports ERC-721 and ERC-721 Metadata, not ERC-721 Enumerable. EIP-1967 implementation storage slot was zero; this does not exclude non-EIP-1967 upgrade patterns.
- RPC observations and limitations recorded in `evidence/agent-id-bsc-rpc-check.json` at block 135734359.
- Workspace inspection: empty directory, no existing git repository; Node and npm available; Foundry not available.
- Existing public GitHub repository inspected: `MANDAVEX/protocol`, one existing commit containing the Apache-2.0 license. Remote fetched locally, no changes pushed. GitHub CLI and local Git author identity are not configured.
- `npm test`: 17 pass, 0 fail, including local EVM lifecycle/adversarial checks and a BSC mainnet-state fork check. Exact run output is preserved in `evidence/runtime-test-report.txt`; fork block and its narrow non-holder finding are recorded there.
- `npm run compile:contracts`: succeeds with solc 0.8.39, optimizer 200, Paris EVM.
- `npm audit`: 0 vulnerabilities in the recorded dependency audit.
- Slither 0.11.6 analyzed one contract with 102 detectors and found 3 observations documented in `evidence/slither-report.txt`. They concern timestamps, assembly, and the deliberate low-level registry static call; this is static analysis, not an audit.
- Clean dependency install `npm ci --no-audit --no-fund` completed; tests passed afterward.
- Local HTTP preview smoke check: HTML and JavaScript returned HTTP 200; no production hosting or visual browser QA.

## IMPLEMENTED BUT UNVERIFIED
- Guard lifecycle and adversarial cases run locally, but the contract is experimental, not independently reviewed, deployed, or audited.
- Fork integration loads the official production registry and rejects a non-holder. Positive execution by a genuine holder is not tested.
- Static preview implements wallet connection and a direct registry read; browser end-to-end behavior is not checked and it has no configured Guard deployment.
- SDK typed-data construction is tested; browser-wallet signing/submission and a holder's full positive path are not.

## NOT IMPLEMENTED
- Agent ID verified ABI/source and full upgrade/lifecycle analysis, complete application workflow, live deployment, runtime adversarial test suite, security audit, live adoption, video, submission.

No production transaction or deployment result is claimed.
