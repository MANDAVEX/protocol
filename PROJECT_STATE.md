# PROJECT_STATE

Updated: 2026-11-26 (Africa/Algiers)

## Status
PARTIALLY IMPLEMENTED. The minimal Guard prototype now has local EVM lifecycle/adversarial tests and a BNB Smart Chain mainnet-state fork test. This verifies the demo-counter authorization boundary; it is not a complete production protocol, audit, deployment, or holder-positive-path test. `node v26.13.1`, `npm 11.20.0`, Hardhat 3, and pinned `solc 0.8.39` are present; Foundry is not installed.

## Verified facts
- Official Binance announcement lists Agent ID at `0x60b9262456de011f7d15a54cdd8c48baaa8b022f`, BNB Chain, ERC-721/non-transferable, eligibility via `balanceOf(address) > 0`.
- Agent Application Innovation Award requires a live product and at least 30 Agent ID addresses interacting with participating contracts during the submission period.
- Scoring: Agent ID depth 30%, practicality/feasibility 25%, completion 25%, innovation 20%.
- Announcement disallows web QR login/session custody, credential collection, unauthorized asset operations, brand impersonation, misleading income claims, wallet lookup by Agent ID, and manipulated interactions.
- Official submission period: 2026-11-18 08:00 UTC through 2026-12-09 08:00 UTC, confirmed from the announcement published 2026-11-18.
- Public repository `https://github.com/MANDAVEX/protocol` now contains the reviewed prototype at commit `2158f9ab45f080b2055e2559d1b1e9bfd1fba8d3` on `main`. The push was verified with `git ls-remote`.
- Direct BSC RPC at block 135734359 reported non-empty Agent ID runtime code (8,756 bytes; keccak256 `0xc4006e6e6ffaaf6996116617392beabe4f5f0a0795841322f91c2ceac34d6ace`); ERC-721 and ERC-721 Metadata `supportsInterface` returned true, enumerable returned false. EIP-1967 implementation slot read zero; this alone does not rule out other proxy designs. Record: `evidence/agent-id-bsc-rpc-check.json`.
- `npm test`: 17 tests passed in the saved run (10 local EVM, 1 block-pinned BSC fork, 4 source/ABI, 2 SDK). Local EVM checks exercise valid execution, state receipt, nonce/use consumption, revocation, time bounds, identity failure, signature/domain/scope failures, replay, constructor checks, and 128 seeded malformed-payload cases with invariants. Report: `evidence/runtime-test-report.txt`.
- Latest BSC fork test at block 135738724 loaded the production registry's code (8,756 bytes), deployed the Guard with that registry constructor argument, measured 869,531 gas on the fork receipt, and confirmed a locally generated non-holder is rejected at the execution boundary. The estimate is gas units only, not a BNB fee quote or live deployment. This does not demonstrate a qualifying holder's positive path. The fork uses Hardhat EDR's configured modern hardfork compatibility schedule, not an archival emulation of historical BSC EVM upgrades.
- Slither 0.11.6 analyzed the Guard with 102 detectors and reported 3 observations: timestamp use for expiry, inline assembly for signature parsing, and low-level `staticcall` for fail-closed Agent ID lookup. Details and limitations: `evidence/slither-report.txt`. No claim of an independent audit is made.
- Solidity source compiles with solc 0.8.39 (optimizer 200, Paris EVM); npm dependency audit reports zero vulnerabilities as of the recorded run.

## Unverified
- Registry runtime code and basic ERC-721 interface behavior were queried; authoritative verified source, complete ABI, proxy/upgrade mechanism, and identity lifecycle have not been independently established.
- No holder-positive-path fork test: no genuine Agent ID test account/key was supplied, and the test intentionally does not impersonate a holder.
- Browser preview has not been end-to-end tested in a browser and is not deployed. GitHub Pages workflow is prepared locally but pending approval to grant its publish and identity-token permissions. No real user interactions, qualifying adoption evidence, or competition submission exist.

## Current decisions
- See DECISIONS.md. Small immutable contract, no custody, execution-time Agent ID checks; no mainnet token.

## Next
1. Review official registry source/ABI and establish deployment-cost estimates on the pinned BSC fork.
2. Implement the smallest browser-connected workflow against an explicitly configured deployment; keep unavailable actions disabled.
3. Publish reviewed source and enable CI, then deploy the static app if hosting credentials can be authorized.
4. Mainnet contract deployment requires a human-controlled wallet confirmation and disclosed gas; no keys or budget are available here.
5. Recruit genuine Agent ID holders only after the product is deployed; no manufactured activity.
