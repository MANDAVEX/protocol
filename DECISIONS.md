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

## Phase III status — 2026-11-26

- Added a production-registry holder fork probe. It proves an observed holder passes both issuer and executor identity checks. The probe deliberately uses an empty signature and therefore does not claim successful authorization or execution.
- Added source evidence for the holder's successful Agent ID mint and block-pinned `balanceOf`, plus a Phase III gate matrix. Current full results: 18/18 runtime tests pass.
- Official Agentic Wallet documentation describes a supported Developer Mode workflow for EIP-712 signing and external contract calls with preview and user confirmation. The integration remains untested; see `docs/AGENTIC_WALLET_WORKFLOW.md`.
- GitHub Pages logs on commit `bbcbec3` showed `upload-pages-artifact` completed and created a `github-pages` artifact, but `deploy-pages` immediately found zero artifacts. This matches the documented intermittent lookup race in [actions/deploy-pages issue 451](https://github.com/actions/deploy-pages/issues/451). The workflow now moves upload and deployment to separate dependent jobs, pins current major action versions and scopes `pages: write`/`id-token: write` to deployment only. A fresh successful run is still required to verify the repair.
