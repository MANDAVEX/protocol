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
- Public repository `https://github.com/MANDAVEX/protocol` contains the reviewed prototype, CI and Pages workflow on `main`; the remote branch ref was verified after each push.
- Direct BSC RPC at block 135734359 reported non-empty Agent ID runtime code (8,756 bytes; keccak256 `0xc4006e6e6ffaaf6996116617392beabe4f5f0a0795841322f91c2ceac34d6ace`); ERC-721 and ERC-721 Metadata `supportsInterface` returned true, enumerable returned false. EIP-1967 implementation slot read zero; this alone does not rule out other proxy designs. Record: `evidence/agent-id-bsc-rpc-check.json`.
- `npm test`: 21 tests passed on 2026-11-26, including local EVM lifecycle/adversarial checks, browser Arena scenarios, SDK/source checks, and block-pinned BSC fork checks. Latest fork block: 135760977. Report: `evidence/runtime-test-report.txt`.
- Latest BSC fork test at block 135760977 loaded the production registry's code (8,756 bytes), deployed the Guard with that registry constructor argument, measured 869,531 gas on the fork receipt, and confirmed a locally generated non-holder is rejected at the execution boundary. This does not demonstrate a qualifying holder's positive path. The fork uses Hardhat EDR's configured modern hardfork compatibility schedule, not an archival emulation of historical BSC EVM upgrades.
- Read-only BSC mainnet RPC estimate at block 135741871: 877,599 gas estimate, 1,053,118 gas limit with 20% headroom, 0.05 gwei sampled price, and 0.0000526559 BNB estimated fee at that sampled price. Unsigned deployment preparation only; fees change and no transaction was sent. Evidence: `evidence/bsc-mainnet-deployment-estimate.json`.
- Reproducible scripts `npm run estimate:bsc-deployment` and `npm run prepare:bsc-deployment` are available. The latter creates unsigned calldata and reads no private key.
- Slither 0.11.6 analyzed the Guard with 102 detectors and reported 3 observations: timestamp use for expiry, inline assembly for signature parsing, and low-level `staticcall` for fail-closed Agent ID lookup. Details and limitations: `evidence/slither-report.txt`. No claim of an independent audit is made.
- Solidity source compiles with solc 0.8.39 (optimizer 200, Paris EVM). `npm audit --audit-level=low` found 0 vulnerabilities in the current lockfile on 2026-11-26.
- GitHub Actions CI and Pages workflows succeeded for public commit `f61525b873a4009e494a19a3bd85e326ab411cf1`. Public page, build metadata, main script, browser worker and compiled artifacts returned HTTP 200; metadata reports the matching commit. The live browser Arena completed valid and payload-tampering scenarios. Evidence: `evidence/public-arena-deployment.json`.

## Unverified
- Registry runtime code and basic ERC-721 interface behavior were queried; authoritative verified source, complete ABI, proxy/upgrade mechanism, and identity lifecycle have not been independently established.
- No holder-positive-path fork test: no genuine Agent ID test account/key was supplied, and the test intentionally does not impersonate a holder.
- The live preview now includes the browser Arena, but wallet connection/RPC behavior has not been end-to-end tested and there is no configured Guard address or transaction submission. No real user interactions, qualifying adoption evidence, or competition submission exist.

## Current decisions
- See DECISIONS.md. Small immutable contract, no custody, execution-time Agent ID checks; no mainnet token.

## Next
1. Review official registry source/ABI and establish a live BNB-denominated deployment fee estimate.
2. Implement the browser-connected mandate lifecycle after an explicit, reviewed deployment; keep unavailable actions disabled.
3. Complete Passport, Arena, Genesis, adoption evidence and agent onboarding only after core execution is deployed.
4. Mainnet contract deployment requires a human-controlled wallet confirmation and disclosed gas; no keys or budget are available here.
5. Recruit genuine Agent ID holders only after the product is deployed; no manufactured activity.

## Phase III — 2026-11-26

Current repository state is Phase III in progress. The experimental Guard is still undeployed and has no production address. The browser Arena exercises compiled Guard bytecode in an isolated worker through controlled demo signers; 13 scenarios and a baseline comparison are represented in `evidence/local-arena-run.json`. Latest `npm test` passes 21 tests. CI and Pages deployed commit `f61525b`; a live browser run passed both a valid local mandate and a payload-tampering rejection. A public observed holder passes both identity gates on the fork, but execution stops at intentionally invalid signature. These results do not establish successful holder authorization or mainnet execution.

The official wallet EIP-712 + contract-call flow has been researched from Binance documentation, and a guarded local skill artifact has been added at `skills/mandavex-agentic-wallet/SKILL.md`; neither has been connected or executed. Local Genesis remains device-only; a Cloudflare Pages function and D1 migration exist but the database binding is a placeholder and the service is not deployed or configured. The reviewed checkpoint is published on GitHub `main` and live at the Pages preview. See `ACCEPTANCE_GATES.md` and `NEXT_ACTIONS.md`.

## Operation Titanium update — 2026-11-26

IMPLEMENTED BUT UNVERIFIED. Added a fixed task collaboration state machine to the immutable Guard: owner-authorized submission, distinct reviewer acceptance of the exact artifact hash, and auditable state-transition events. Both transitions use the existing identity, typed-signature, scope, time, replay, revocation and use-limit checks. No arbitrary calls, custody, or asset movement were introduced. The browser Arena runs this same compiled contract and locally verifies successful submission/acceptance plus rejected self-review and artifact substitution. Local simulation receipts are explicitly not mainnet activity.

The SDK and preparation-only CLI now encode both task actions and produce unsigned execution/revocation calldata. A local receipt explorer surfaces saved Arena evidence on this device. Eight indexer tests include reorganization and historical-identity cases; six Genesis tests cover mock-service behavior. Latest full test run: 40 passed, 0 failed; compile and browser build passed; dependency audit found 0 vulnerabilities. Release `467cbbf` is on public Pages; CI and deployment succeeded, public metadata matches, and the main script, worker and artifacts return HTTP 200. The new workflow has not yet had an interactive browser smoke test. Cloudflare dashboard account authentication is pending the founder's action on the handed-off OAuth consent screen. No credentials were entered or stored by the agent.

## Cloudflare Genesis connection — 2026-11-27

IMPLEMENTED BUT UNVERIFIED. Starting checkpoint: `f345192`. Cloudflare dashboard authentication completed through the existing Google session. GitHub displayed the Cloudflare Workers and Pages authorization request; the user must complete that security authorization in the handed-off browser before repository linking can continue. The Pages drag-and-drop dashboard does not compile the `functions/` directory; official Cloudflare docs require Git integration or Wrangler. Genesis now supports the existing GitHub Pages frontend through a configurable endpoint and exact-origin CORS for `https://mandavex.github.io`, with a tested OPTIONS preflight and rejection of unrelated origins. Full `npm test`: 41 passed, including block-pinned BSC fork checks at `135932095`; Solidity compilation and browser build passed; authorized npm audit found 0 vulnerabilities. Wrangler 4.168.0 is a development dependency. Its local emulator successfully applied the D1 migration and retained a synthetic test row across CLI processes. The emulator did not provide `cf-connecting-ip`, so local HTTP registration correctly failed closed; mock handler coverage passed. Commit `219f49b` was pushed to the public repository; CI/Pages succeeded and public metadata reported that commit. No Cloudflare Pages project, remote D1 database, secret, remote migration, or deployment has yet been verified; Genesis stays inactive until the full checklist passes. Evidence and reusable procedures: `evidence/titanium-cloudflare-preparation.md` and `skills/mandavex-cloudflare-genesis/SKILL.md`.

## Adoption dashboard — 2026-11-27

IMPLEMENTED BUT UNVERIFIED. Public Adoption panel and build-time snapshot generator are now derived from the deployment manifest plus an optional real indexer report. Current output is `BLOCKED · NOT RUN` with candidate and qualifying counts shown as unknown because no Guard is deployed. Four focused tests cover the pre-deployment state, missing report, candidate-versus-qualification labeling, and rejection of fixture or mismatched reports. Full suite: 45 passed at BSC fork block `135936170`; browser build and dependency audit passed. The dashboard has not yet been visually smoke-tested in desktop/mobile browser; publish after that check. Evidence: `evidence/adoption-dashboard-validation.md`.
