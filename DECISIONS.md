# DECISIONS

## 2026-11-27 — task receipts must prove the task transition

The SDK and CLI must verify the Guard's `TaskTransition` alongside `ActionAuthorized` whenever a task receipt is claimed. The verifier binds the expected task ID, status, artifact hash and mandate ID; expected parties can also be checked. Rationale: an authorization event alone does not prove the exact task artifact was submitted or accepted. Verification remains fail-closed and manifest-gated until a production Guard exists. This is an off-contract change and does not alter the frozen Guard candidate bytecode.

## 2026-11-25 — Start from a minimal immutable guard
The workspace had no prior source or Git history. Start with one immutable execution-boundary contract rather than a multi-contract framework. This limits privilege surface and makes the core use case reviewable.

## 2026-11-25 — Require Agent ID for issuer and executor
The competition requires meaningful integration. Checking both mandate author and executor during execution makes Agent ID part of authorization, not merely onboarding. Registry call failures fail closed.

## 2026-11-25 — No mainnet deployment or token now
No deployer credentials, budget approval, contract review or deployment evidence exists. Avoid financial activity; keep the base protocol independent of a future MDVX token.

## 2026-11-25 — Reuse the existing public repository and Apache license
The MANDAVEX GitHub organization has a public `protocol` repository on `main` with one existing Apache-2.0 license commit. The local workspace was empty. The remote is configured locally and fetched; code has not been pushed, and account ownership/write access has not been verified. Use the existing Apache-2.0 license rather than creating conflicting licensing.

## 2026-11-26 — Publish the reviewed prototype and add CI
The owner-controlled public repository was verified in the signed-in GitHub session. After lifecycle/fork tests, Slither review, dependency audit, and a credential-pattern scan, publish the reviewed prototype. CI runs EVM/fork tests, compilation, dependency audit, and a JavaScript syntax check. The separate GitHub Pages workflow was later approved, enabled, and verified.

## 2026-11-26 — Enable GitHub Pages Actions source
The user approved publishing the static preview and its Pages workflow permissions. The initial run failed at setup while the repository Pages source was disabled. GitHub Actions was selected as the source; the next workflow and CI run succeeded and the page plus assets were verified over HTTPS. The deployed page remains a preview, not the complete protocol workflow.

## 2026-11-26 — Keep the public Arena isolated from production authority

- The browser Arena bundles compiled Guard and mock identity-registry artifacts into a dedicated worker and creates a fresh in-memory EVM per run. Demo signing keys are ephemeral and never used for wallet or mainnet authorization.
- The browser Arena demonstrates local authorization outcomes without a service, RPC, connected wallet, or real funds. UI and evidence identify this as a demo; it does not count as Agent ID adoption or production execution.
- Genesis shared registration stays unconfigured until the Cloudflare D1 binding and privacy/retention behavior are reviewed. A placeholder database identifier is not deployable service configuration.

## 2026-11-26 — Publish the browser Arena as a disclosed demo

- Published reviewed commit `f61525b` to the existing public repository and GitHub Pages workflow after local tests, compile/build, dependency audit and source review passed.
- The public Arena runs the compiled Guard in a browser-only EVM with ephemeral keys and mock identities. It is explicitly labeled as demo execution and submits no public-chain transaction.
- CI and Pages succeeded; the deployed build metadata matches the commit. A live browser run showed successful scoped execution and payload-tampering rejection. These results do not verify production deployment, Agent ID holder signing, or adoption.

## 2026-11-26 — Add fixed permission-bound task collaboration

- Extend the existing immutable Guard with only two new action selectors: task submission and exact-hash review acceptance. Both share the existing EIP-712, execution-time Agent ID, expiry, nonce, use-limit, revocation and signature checks; the Guard still makes no arbitrary external calls and holds no assets.
- Store task owner, contributor, reviewer, state and artifact hash on the Guard. Acceptance requires the owner's fresh mandate, an Agent ID executor distinct from the contributor, and the submitted artifact hash. Artifact bytes remain off-chain and must be independently checked by the reviewer.
- Keep the browser workflow on the compiled Solidity implementation, using local mock identities and ephemeral demo keys. This workflow is simulation evidence only; production wallet transactions remain disabled until a deployment is reviewed.

## 2026-11-26 — Keep Genesis on a free Pages service with an exact frontend origin

- Use Cloudflare Pages Functions and D1 for shared Genesis registration, with the migration and D1 binding kept in `wrangler.toml` and source control. Dashboard drag-and-drop does not compile the Functions directory; Git integration or Wrangler is required.
- Keep the existing GitHub Pages site as the public frontend. Its configurable Genesis API endpoint may target the Cloudflare Pages service, while the API returns browser CORS headers only for the exact configured `https://mandavex.github.io` origin. No wildcard origin or credentialed browser requests are allowed.
- The Pages Function remains fail-closed if D1 or the private rate-limit salt is missing. The service is not active until database migration, secret binding, deployed endpoint, privacy/retention review, and independent-client persistence checks succeed.

## 2026-11-27 — Generate the public adoption panel from reviewed evidence

- Build `apps/web/adoption-status.json` from the deployment manifest and optional saved indexer report. Before a BNB deployment or matching scan exists, show `BLOCKED`/`NOT RUN` and unknown counts instead of zero or demo totals.
- Only accept reports that identify BNB Chain 56, the manifest Guard, official Agent ID registry, a valid deployment-bounded block range, unique candidate senders, and `IMPLEMENTED BUT UNVERIFIED` evidence status. The panel keeps indexer candidates separate from official competition qualification.

## Phase III status — 2026-11-26

- Added a production-registry holder fork probe. It proves an observed holder passes both issuer and executor identity checks. The probe deliberately uses an empty signature and therefore does not claim successful authorization or execution.
- Added source evidence for the holder's successful Agent ID mint and block-pinned `balanceOf`, plus a Phase III gate matrix. Current full results: 18/18 runtime tests pass.
- Official Agentic Wallet documentation describes a supported Developer Mode workflow for EIP-712 signing and external contract calls with preview and user confirmation. The integration remains untested; see `docs/AGENTIC_WALLET_WORKFLOW.md`.
- GitHub Pages logs on commit `bbcbec3` showed `upload-pages-artifact` completed and created a `github-pages` artifact, but `deploy-pages` immediately found zero artifacts. This matches the documented intermittent lookup race in [actions/deploy-pages issue 451](https://github.com/actions/deploy-pages/issues/451). The workflow now moves upload and deployment to separate dependent jobs, pins current major action versions and scopes `pages: write`/`id-token: write` to deployment only. The repair was verified by the successful CI and Pages runs for commit `465c3884bb9881dea28a33c19807c527a4dc390c`; the independent page reported the same deployed commit.
- Added a local Binance Agentic Wallet workflow skill with a hard stop until a reviewed Guard deployment exists. It follows the official EIP-712 and contract-call preview/execute path, keeps wallet approval explicit, forbids secrets and QR pairing, and does not assert integration testing. This adds operating guidance only; no contract architecture changed.
- Added a loopback-only Arena server that starts a separate Hardhat EVM on port 18547 and serves the web app on port 4173. Each scenario deploys fresh MockAgentId and Guard fixtures and uses controlled local keys. The browser never receives fixture private keys; scenario runs are server-side and explicitly labeled local. This avoids collision with the BSC fork test port and keeps the demonstration independent of paid infrastructure.

## 2026-11-27 — Bound authorization time and make registry failure typed/fail-closed

- Limit each mandate's validity window to 24 hours and make expiry exclusive (`block.timestamp >= expiry`). This reduces exposure while preserving the chain timestamp as an explicit consensus assumption.
- Replace manual signature calldata assembly with bounds-checked calldata slices and keep strict 65-byte/low-s/v validation.
- Read Agent ID through the typed registry interface with `try/catch`; registry reverts and decode failures yield no identity and the Guard rejects before state changes.
- Add reproducible fuzz coverage for malformed payloads and signatures and verify state/nonce/use invariants remain unchanged after rejection.

## 2026-11-27 — Verify receipts from independent chain data

- Add an SDK verifier that checks RPC chain ID, transaction/receipt, Guard destination, canonical receipt block and expected Guard event. Add a CLI that is blocked unless the reviewed Guard is present in the deployment manifest.
- The browser Passport remains a public identity lookup and a device-local demo receipt explorer; it does not elevate local hashes into chain proofs.

## 2026-11-27 — Keep browser end-to-end checks reproducible

- Pin Playwright as a development dependency and add `npm run test:browser` for local desktop/mobile layout, browser EVM actions, task acceptance and receipt explorer assertions. Add `npm run test:browser:public` for the same read-only smoke against published Pages. Both create only local fixture evidence and send no BNB RPC transaction.
- Mobile smoke revealed the hero footer overlapping actions. At the mobile breakpoint the footer now flows after the buttons, and the Playwright test guards both overlap and horizontal overflow.
