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
The owner-controlled public repository was verified in the signed-in GitHub session. After lifecycle/fork tests, Slither review, dependency audit, and a credential-pattern scan, publish commit `2158f9ab45f080b2055e2559d1b1e9bfd1fba8d3`. CI runs EVM/fork tests, compilation, dependency audit, and a JavaScript syntax check. A GitHub Pages workflow is prepared separately and remains unpublished pending permission confirmation.

## 2026-11-26 — Enable GitHub Pages Actions source
The user approved publishing the static preview and its Pages workflow permissions. The first run failed at setup while the repository Pages source was disabled. Repository settings now show GitHub Actions as the source; a new run must succeed and the resulting HTTPS page must be checked before calling the site deployed.
