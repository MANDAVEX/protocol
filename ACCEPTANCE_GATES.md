# Operation Sovereign Acceptance Gates

Updated: 2026-11-26. Statuses describe the current local workspace, not a future release.

| Gate | Status | Verification / evidence | Limitation and next action | Human action |
|---|---|---|---|---|
| S01 Existing workspace recovered | VERIFIED | Git workspace inspected; branch `main`, public checkpoint `9762d33`, prior work preserved | Local Titanium work is uncommitted | None |
| S02 Complete build reproducible | VERIFIED | CI performed `npm ci`; compile and Pages build succeeded for public checkpoint `9762d33`; local Titanium compile/build also pass | No independent clean-room rebuild outside GitHub Actions | None |
| S03 All current tests executed | VERIFIED | `npm test`: 40 passed, 0 failed, including two BNB fork probes; see `evidence/operation-titanium-local.json` | Tests are not a security audit | None |
| S04 Functional browser EVM Arena | VERIFIED | Public browser run passed valid mandate and payload-tampering rejection; SDK/worker test suite passed | Demo fixtures only; no public chain activity | None |
| S05 Public runtime demonstration | VERIFIED | Public Pages build at `https://mandavex.github.io/protocol/`; matching metadata and assets returned HTTP 200 | Runtime is a local EVM demo, not the deployed protocol | None |
| S06 Complete signed local authorization lifecycle | VERIFIED | Local EVM test covers signature, execution, event, nonce/use, revocation and expiry | Controlled fixtures only | None |
| S07 Official Agent ID fork integration | PARTIALLY IMPLEMENTED | BSC fork at block 135770097 loads official registry and checks non-holder plus observed holder identity gates | Holder probe stops at invalid signature; no holder-signed successful execution | Holder must provide an exact approved signature using their own wallet to advance positive path |
| S08 Supported production wallet workflow | PARTIALLY IMPLEMENTED | Official flow researched; guarded instructions in `skills/mandavex-agentic-wallet/SKILL.md` | No connected wallet, deployed Guard or end-to-end signing | Holder must approve all wallet prompts after reviewed deployment |
| S09 Functional shared Genesis registration | NOT IMPLEMENTED | Function and D1 migration exist; placeholder D1 ID in `wrangler.toml` | No configured database, deployed endpoint, retention policy or public service | Configure authorized Cloudflare project/account after privacy review |
| S10 Public Passport verification | PARTIALLY IMPLEMENTED | Static site can read public Agent ID balance for a shared public address | No canonical on-chain Passport or production receipt verification against deployed Guard | None |
| S11 Tested adoption indexer | PARTIALLY IMPLEMENTED | Eight mocked-provider tests cover receipts, reorgs, pagination, duplicates, direct senders, time edges, historical identity and RPC failure | No deployed Guard scan or official qualification determination; historical identity remains post-block | None |
| S12 SDK and integration example | PARTIALLY IMPLEMENTED | SDK and CLI prepare both task-action mandates and canonical task payloads; workflows are tested | Not published as an installable package; no production integration | None |
| S13 Security-critical invariants | PARTIALLY IMPLEMENTED | 37-test suite covers task transitions, self-review, wrong owner, duplicate task, malformed payload, replay, expiry, identity, scope and signature | No independent audit; further invariant review needed | Independent security reviewer required before production deployment |
| S14 Public deployment reflects latest reviewed commit | VERIFIED | CI and Pages succeeded on public commit `9762d33`; live metadata matches that earlier release | Titanium changes remain local and unpublished; no production Guard deployment | None |
| S15 Reproducible mainnet release candidate | PARTIALLY IMPLEMENTED | Immutable Guard, compile and unsigned preparation scripts exist | No independent audit, holder positive path, wallet end-to-end or final deployment review | None until release review is complete |
| S16 Exact deployment funding requirement | PARTIALLY IMPLEMENTED | Prior read-only point-in-time estimate in `evidence/bsc-mainnet-deployment-estimate.json` | Fee estimate is volatile and not a guaranteed current total | Recheck immediately before human approval |
| S17 Actual mainnet deployment | BLOCKED | No transaction or contract address | Requires security review, a deployment wallet and gas | Owner must authorize and confirm the exact wallet transaction |
| S18 Genuine production interaction | NOT IMPLEMENTED | No production transaction evidence | Requires deployed and verified Guard | Agent ID holder initiates from own wallet |
| S19 At least 30 qualifying participants | NOT IMPLEMENTED | No qualifying contract interactions recorded | Requires 30 distinct genuine Agent ID holders during submission window | Genuine holders must interact; no artificial activity |
| S20 Competition submission package | PARTIALLY IMPLEMENTED | Rules, README, quickstart, security/evidence notes exist | Video, complete technical package, current production proof and final submission details remain | None |
| S21 Authorized competition submission | NOT IMPLEMENTED | No submission receipt | Submission period ends 2026-12-09 08:00 UTC | Authorized project participant must submit eligible live product |
| S22 Zero unauthorized expenditure | VERIFIED | No paid service, domain purchase or mainnet spend initiated in this work | Continue at $0 unless owner later authorizes otherwise | None |
| S23 Permission-bound collaboration workflow | IMPLEMENTED BUT UNVERIFIED | Compiled Guard, browser Arena and local EVM tests cover owner submission, distinct reviewer, exact-hash acceptance and rejected tampering | Simulation only; no live deployment or off-chain artifact validation | Independent review before production |
| S24 Local receipt explorer and mandate preparation | IMPLEMENTED BUT UNVERIFIED | Arena saves local receipt summaries; Passport displays simulation hashes; CLI prepares unsigned execution and revocation calldata | Browser visual validation remains pending; local hashes cannot be looked up on a public chain | None |
| S25 Genesis service regression checks | VERIFIED | Six handler tests cover fail-closed config, malformed input, duplicate handling, hashed rate limits, identity and D1/RPC failure | Mock D1 tests only; shared persistence and deployed endpoint are not configured | Founder must finish Cloudflare OAuth consent before D1 setup |

## Verified deadline and threshold

The [official Binance announcement](https://www.binance.com/en/support/announcement/detail/95f5dbe0ea674a48a739b59e046648bf) gives the submission period as 2026-11-18 08:00 UTC through 2026-12-09 08:00 UTC, requires a live product and at least 30 Agent ID addresses interacting with participating contracts, and requires BNB Chain deployment with verified, open-source contracts. Local fixtures and fork calls do not count.
