# DECISIONS

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

## Phase III status — 2026-11-26

- Added a production-registry holder fork probe. It proves an observed holder passes both issuer and executor identity checks. The probe deliberately uses an empty signature and therefore does not claim successful authorization or execution.
- Added source evidence for the holder's successful Agent ID mint and block-pinned `balanceOf`, plus a Phase III gate matrix. Current full results: 18/18 runtime tests pass.
- Official Agentic Wallet documentation describes a supported Developer Mode workflow for EIP-712 signing and external contract calls with preview and user confirmation. The integration remains untested; see `docs/AGENTIC_WALLET_WORKFLOW.md`.
- GitHub Pages logs on commit `bbcbec3` showed `upload-pages-artifact` completed and created a `github-pages` artifact, but `deploy-pages` immediately found zero artifacts. This matches the documented intermittent lookup race in [actions/deploy-pages issue 451](https://github.com/actions/deploy-pages/issues/451). The workflow now moves upload and deployment to separate dependent jobs, pins current major action versions and scopes `pages: write`/`id-token: write` to deployment only. The repair was verified by the successful CI and Pages runs for commit `465c3884bb9881dea28a33c19807c527a4dc390c`; the independent page reported the same deployed commit.
- Added a local Binance Agentic Wallet workflow skill with a hard stop until a reviewed Guard deployment exists. It follows the official EIP-712 and contract-call preview/execute path, keeps wallet approval explicit, forbids secrets and QR pairing, and does not assert integration testing. This adds operating guidance only; no contract architecture changed.
- Added a loopback-only Arena server that starts a separate Hardhat EVM on port 18547 and serves the web app on port 4173. Each scenario deploys fresh MockAgentId and Guard fixtures and uses controlled local keys. The browser never receives fixture private keys; scenario runs are server-side and explicitly labeled local. This avoids collision with the BSC fork test port and keeps the demonstration independent of paid infrastructure.
