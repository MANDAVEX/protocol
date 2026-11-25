# Phase II acceptance status

Updated: 2026-11-26 (Africa/Algiers). Evidence is scoped to the stated result; nothing below implies a mainnet deployment or a genuine Agent ID holder action unless explicitly stated.

| Acceptance gate | Status | Evidence and limits |
|---|---|---|
| Runtime EVM tests | VERIFIED | `npm test`: 17/17 passed; local Hardhat EVM plus BSC fork. See `evidence/runtime-test-report.txt`. |
| Mandate lifecycle | VERIFIED | Local test executes, consumes nonce/use, emits receipt event, revokes and rejects expired mandates. Demo counter only. |
| Adversarial authorization checks | VERIFIED | Wrong identity, caller, signer, scope, replay, malformed signature and 128 seeded payload mutations reject without state changes. Local fixture identities only. |
| Official Agent ID fork integration | PARTIALLY IMPLEMENTED | Fork loads production BSC registry code and confirms a non-holder is rejected. No genuine holder positive-path test; verified source/proxy/lifecycle analysis remains incomplete. |
| Functional flagship product | PARTIALLY IMPLEMENTED | Guard contract, SDK typed-data helper and wallet-connected identity preview exist. The browser has no Guard address, signing/submission, revocation flow, proof page or adoption index. |
| Official GitHub repository | VERIFIED | Reviewed source and CI on `main`; CI and Pages workflow passed. See `evidence/github-pages-deployment.json` for the verified deployment commit. |
| Public HTTPS application | VERIFIED | Static preview at `https://mandavex.github.io/protocol/` and assets returned HTTP 200 in an independent browser. This is a prototype preview, not a deployed protocol application. See `evidence/github-pages-deployment.json`. |
| Mainnet deployment readiness | PARTIALLY IMPLEMENTED | Immutable constructor, no owner function, compiler settings, static-analysis evidence, and unsigned transaction preparation exist. No independent audit, holder-positive path, BscScan verification package or mainnet receipt. |
| Deployment gas/cost | VERIFIED | At BSC block 135741871, estimate was 877,599 gas with 1,053,118 gas limit at 0.05 gwei, or 0.0000526559 BNB at that sampled price. This is an estimate, not a guaranteed inclusion fee. See `evidence/bsc-mainnet-deployment-estimate.json`. |
| Genesis onboarding | NOT IMPLEMENTED | No founding credential system, passport, onboarding flow or evidence-backed adoption dashboard. |
| Qualifying Agent ID participation | NOT IMPLEMENTED | No Guard contract is deployed, so no qualifying addresses can be counted from MANDAVEX contract activity. No participants are fabricated. |
| Competition package | PARTIALLY IMPLEMENTED | Official deadline/rules and competitor notes updated. No qualifying live interaction data or submission. |
| Token-ready extension layer | NOT IMPLEMENTED | Economic research exists; no verification-fee, validator, governance, collateral or service-credit interfaces are implemented. No tradable token is deployed. |

## Remaining blockers

- A genuine Agent ID holder must participate in a positive-path test and any qualifying interaction through their own wallet.
- Production registry verified source, proxy architecture and lifecycle need primary-source review.
- Contract needs independent security review before mainnet deployment.
- Deployment requires an authorized wallet and disclosed gas budget; neither was provided or used.
- Product scope beyond the prototype, Genesis, agent skill, adoption analytics and competition submission remain unfinished.
- `mandavex.io` ownership/availability remains unverified; the static preview currently uses a GitHub Pages URL.
