# Operation Sovereign Acceptance Gates

Updated: 2026-11-26. Statuses describe the current local workspace, not a future release.

| Gate | Status | Verification / evidence | Limitation and next action | Human action |
|---|---|---|---|---|
| S01 Existing workspace recovered | VERIFIED | Git workspace inspected; branch `main`, base `487f6cf`, modified/untracked files preserved | No destructive Git action used | None |
| S02 Complete build reproducible | IMPLEMENTED BUT UNVERIFIED | `npm run compile:contracts` and `npm run build:web` succeeded | Clean dependency install not repeated against this lockfile | None |
| S03 All current tests executed | VERIFIED | `npm test`: 21 passed, 0 failed; `evidence/runtime-test-report.txt` | Audit is separate and blocked; tests are not a security audit | None |
| S04 Functional browser EVM Arena | IMPLEMENTED BUT UNVERIFIED | Browser Arena EVM test covers signed execution, adversarial scenarios and comparison | Core/worker tests pass; deployed browser UI still needs a public smoke test | None |
| S05 Public runtime demonstration | PARTIALLY IMPLEMENTED | Existing static preview at `https://mandavex.github.io/protocol/` | Latest Arena build is local and uncommitted; review, publish and smoke-test | None |
| S06 Complete signed local authorization lifecycle | VERIFIED | Local EVM test covers signature, execution, event, nonce/use, revocation and expiry | Controlled fixtures only | None |
| S07 Official Agent ID fork integration | PARTIALLY IMPLEMENTED | BSC fork at block 135760977 loads official registry and checks non-holder plus observed holder identity gates | Holder probe stops at invalid signature; no holder-signed successful execution | Holder must provide an exact approved signature using their own wallet to advance positive path |
| S08 Supported production wallet workflow | PARTIALLY IMPLEMENTED | Official flow researched; guarded instructions in `skills/mandavex-agentic-wallet/SKILL.md` | No connected wallet, deployed Guard or end-to-end signing | Holder must approve all wallet prompts after reviewed deployment |
| S09 Functional shared Genesis registration | NOT IMPLEMENTED | Function and D1 migration exist; placeholder D1 ID in `wrangler.toml` | No configured database, deployed endpoint, retention policy or public service | Configure authorized Cloudflare project/account after privacy review |
| S10 Public Passport verification | PARTIALLY IMPLEMENTED | Static site can read public Agent ID balance for a shared public address | No canonical on-chain Passport or production receipt verification against deployed Guard | None |
| S11 Tested adoption indexer | PARTIALLY IMPLEMENTED | Indexer source verifies ActionAuthorized receipt and identity at a block; fixture is excluded | No deployed Guard scan or official qualification determination | None before deployment |
| S12 SDK and integration example | PARTIALLY IMPLEMENTED | SDK typed-data, calldata and receipt checks are covered by tests | Not published as an installable package; no production integration | None |
| S13 Security-critical invariants | PARTIALLY IMPLEMENTED | 21-test suite includes malformed payloads, replay, expiry, identity, scope and signature checks | No independent audit; additional invariant and race review needed | Independent security reviewer required before production deployment |
| S14 Public deployment reflects latest reviewed commit | NOT IMPLEMENTED | Public preview reflects prior reviewed commit | Current changes need source review, then publication and remote smoke check | None; publishing is already authorized after review |
| S15 Reproducible mainnet release candidate | PARTIALLY IMPLEMENTED | Immutable Guard, compile and unsigned preparation scripts exist | No independent audit, holder positive path, wallet end-to-end or final deployment review | None until release review is complete |
| S16 Exact deployment funding requirement | PARTIALLY IMPLEMENTED | Prior read-only point-in-time estimate in `evidence/bsc-mainnet-deployment-estimate.json` | Fee estimate is volatile and not a guaranteed current total | Recheck immediately before human approval |
| S17 Actual mainnet deployment | BLOCKED | No transaction or contract address | Requires security review, a deployment wallet and gas | Owner must authorize and confirm the exact wallet transaction |
| S18 Genuine production interaction | NOT IMPLEMENTED | No production transaction evidence | Requires deployed and verified Guard | Agent ID holder initiates from own wallet |
| S19 At least 30 qualifying participants | NOT IMPLEMENTED | No qualifying contract interactions recorded | Requires 30 distinct genuine Agent ID holders during submission window | Genuine holders must interact; no artificial activity |
| S20 Competition submission package | PARTIALLY IMPLEMENTED | Rules, README, quickstart, security/evidence notes exist | Video, complete technical package, current production proof and final submission details remain | None |
| S21 Authorized competition submission | NOT IMPLEMENTED | No submission receipt | Submission period ends 2026-12-09 08:00 UTC | Authorized project participant must submit eligible live product |
| S22 Zero unauthorized expenditure | VERIFIED | No paid service, domain purchase or mainnet spend initiated in this work | Continue at $0 unless owner later authorizes otherwise | None |

## Verified deadline and threshold

The [official Binance announcement](https://www.binance.com/en/support/announcement/detail/95f5dbe0ea674a48a739b59e046648bf) gives the submission period as 2026-11-18 08:00 UTC through 2026-12-09 08:00 UTC, requires a live product and at least 30 Agent ID addresses interacting with participating contracts, and requires BNB Chain deployment with verified, open-source contracts. Local fixtures and fork calls do not count.
