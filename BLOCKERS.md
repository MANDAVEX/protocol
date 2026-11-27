# BLOCKERS

Updated: 2026-11-27 (Africa/Algiers)

## Production activation

- **BLOCKED:** Guard is not deployed. The release candidate is explicitly not approved for mainnet.
- **BLOCKED:** No independent security review. Slither reports the expected timestamp dependency for `validAfter` and exclusive expiry; validator clock tolerance remains a protocol assumption.
- **BLOCKED:** Current project spend authorization is $0. Deployment, the first production execution and gas costs cannot be incurred.
- **BLOCKED:** No genuine Agent ID holder has signed and executed a production mandate. Forked registry state only verified identity gates and stopped at an invalid signature.
- **BLOCKED:** No live Agentic Wallet Developer Mode preview/signing workflow has run against a reviewed deployed Guard. The official CLI workflow is documented and the CLI prepares the supported envelope, but no wallet session is connected.
- **BLOCKED:** No qualifying production interactions or competition submission exist. Official rules require a live product, BNB Chain deployment with verified/open-source source, and 30 distinct Agent ID addresses interacting with submitted contracts during the submission period.

## Product and infrastructure limits

- **PARTIALLY IMPLEMENTED:** Public site, browser EVM Arena, SDK/CLI, local collaboration workflow, receipt verification and adoption indexer are available. The browser Arena is a simulation; the site has no deployed-Guard mandate transaction interface.
- **PARTIALLY IMPLEMENTED:** Passport performs public identity lookup and shows device-local demo evidence; it does not verify production Guard receipts while no Guard exists.
- **BLOCKED:** Genesis has local handlers and a D1 migration but no shared production database or deployed registration service. Cloudflare authentication is postponed in this takeover.
- **NOT IMPLEMENTED:** Independent professional audit/formal verification, recorded product video, actual holder-signed production execution and competition submission.
- Foundry is not installed. Hardhat, seeded fuzz checks, Solidity compilation and Slither are used; this is not a substitute for formal verification or independent audit.

## Verified recovery release

- `main` contains the verified recovery, deployment candidate, public browser screenshots and current handoff records. GitHub CI/Pages and public build metadata match the latest pushed release; see `PROJECT_STATE.md` and `VERIFICATION_REPORT.md`.
- The prior full suite passed 51/51; the Vanguard follow-up full suite passed 52/52, including the read-only BSC fork at `135964180`. Local and public Playwright checks passed at desktop and mobile sizes. No mainnet transaction, paid service or spending occurred.
- The time-sensitive deployment estimate is documented at BSC block `135964279`; recheck before any future human-authorized approval. Current recommended reserve is informational only and does not change the $0 limit.

## Operation Vanguard follow-up

- **IMPLEMENTED BUT UNVERIFIED:** SDK and CLI now verify task-specific `TaskTransition` receipts alongside authorization events. Focused EVM/SDK/CLI qualification passed 20/20. Production receipt verification remains blocked because the manifest has no deployed Guard.
- **BLOCKED:** Independent security review, authorized funding, genuine wallet signing, deployment/source verification, production interface activation, live task workflow, 30 distinct qualifying interactions and competition submission remain incomplete.
- **VERIFIED, limited scope:** exact Guard candidate hashes reproduce; read-only deployment estimate refreshed at BSC block `135964279`; task gas numbers are local mock-registry measurements only. See `evidence/operation-vanguard-qualification.md` and `docs/DEPLOYMENT_COSTS.md`.
