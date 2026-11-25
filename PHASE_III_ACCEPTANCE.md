# MANDAVEX Phase III acceptance

Updated: 2026-11-26. Evidence labels are scoped to exactly what was observed. Local fork impersonation is never counted as real user interaction or mainnet execution.

| Gate | Status | Evidence / method | Limitation or next action |
|---|---|---|---|
| G01 Positive Agent ID fork execution | PARTIALLY IMPLEMENTED | `evidence/agent-id-holder-fork-check.json`; public mint and `balanceOf` at block 135738237, then local fork `eth_call` reached `InvalidSignature` after issuer/executor identity checks | Positive holder identity acceptance is verified; authorized guarded execution still needs a holder's valid EIP-712 signature |
| G02 Complete mandate lifecycle | VERIFIED | `evidence/runtime-test-report.txt`; 18 passing tests include valid local execution, use/nonce consumption, receipt event, revocation and expiry | Local fixture EVM; the lifecycle is not deployed |
| G03 Official Agentic Wallet compatibility | PARTIALLY IMPLEMENTED | Official docs describe Developer Mode `sign-message` EIP-712 and `contract-call` preview/execute two-step flow; source links are in `docs/AGENTIC_WALLET_WORKFLOW.md` | No wallet CLI is installed/authenticated here; end-to-end wallet signature/confirmation was not exercised |
| G04 Real authorization enforcement | VERIFIED | Local EVM checks issuer/executor Agent ID balances at execute and rejects altered scope, signature, time, caller, replay and revoked mandate | Real registry fork only proves identity-gate behavior, not a successful signed execution |
| G05 Verifiable execution receipts | VERIFIED | Local successful execution emits `ActionAuthorized`, with mandate ID, issuer, executor, action, payload hash, use and counter | No mainnet receipt exists |
| G06 Functional security Arena | PARTIALLY IMPLEMENTED | Reproducible EVM scenario suite in `tests/evm.test.cjs` and `tests/bsc-fork.test.cjs` | Not an interactive Arena UI; concurrency, prompt injection and protected/unprotected measured comparison remain absent |
| G07 Successful automated production deployment | PARTIALLY IMPLEMENTED | Previous preview deployed successfully; the latest logs show uploaded artifact but deploy lookup failed | Phase III splits Pages build/upload and deployment into separate jobs to avoid the documented artifact-index race; verify after push |
| G08 Security-critical tests and review | PARTIALLY IMPLEMENTED | EVM adversarial suite including high-s signature malleability rejection, 128 seeded payload mutations and Slither evidence | Not an independent audit; add signature-malleability/invariant coverage and obtain external review |
| G09 Mainnet deployment readiness | PARTIALLY IMPLEMENTED | Immutable Guard source, constructor/compile configuration and unsigned prepare script | No independent audit, final review or confirmed production integration |
| G10 Authorized mainnet deployment | NOT IMPLEMENTED | No deployment transaction or contract address | Requires explicit human contract review and wallet approval/funds; no secrets accessed |
| G11 BscScan source verification | NOT IMPLEMENTED | No mainnet address | Requires deployment first |
| G12 Genuine production transaction | NOT IMPLEMENTED | None | Requires deployed and verified Guard and a holder's own confirmed wallet action |
| G13 Genesis onboarding | NOT IMPLEMENTED | None | No founding credential/onboarding product |
| G14 Public adoption tracking | NOT IMPLEMENTED | None | No deployed interaction history to count; no users inferred |
| G15 Developer integration example | PARTIALLY IMPLEMENTED | SDK typed-data construction and quickstart | No production address, published skill or end-to-end integration |
| G16 30 genuine qualifying Agent ID addresses | NOT IMPLEMENTED | No MANDAVEX contract has been deployed | Fork callers and sampled holders do not count |
| G17 Competition submission package | PARTIALLY IMPLEMENTED | Competition rules and project documentation exist | No qualifying live product/activity or submitted entry |

## Phase III findings

- Official registry event at block 135738237 records a successful Agent ID mint to `0x9cfbb2cc07cdf46c2b789926b6adcc905a749b07`; `balanceOf` was 1 at that block. On the BSC fork at block 135743910, the same observed holder passed both identity checks. The local call then correctly stopped at signature validation.
- Binance documents external EIP-712 message signing and external contract calls through its Agentic Wallet skill, under Developer Mode, with previews and explicit confirmation before execution. This provides a supported candidate flow; this project has not run it end to end.
- The Pages artifact exists in the failed run and its `deploy-pages` step reports zero matching artifacts. The same-job upload/deploy layout is subject to an intermittent artifact lookup race documented by the action maintainers; Phase III moves upload and deploy into dependent jobs.

No holder signature, deployment, mainnet transaction, user count or submission is claimed.

