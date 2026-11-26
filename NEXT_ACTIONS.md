# Next Actions

Updated: 2026-11-26 02:00 UTC.

## Operation Titanium progress — 2026-11-26

- Implemented fixed permission-bound task submission and review acceptance in the Guard, Arena, SDK and preparation-only CLI, including unsigned revoke calldata. Local EVM tests verify exact-hash acceptance, distinct reviewer enforcement, and rejection of self-review, wrong owner, duplicate tasks and malformed payloads.
- Added eight focused indexer tests covering canonical receipts, reorg rejection, failed receipts, direct versus relayed senders, address de-duplication, competition-window edges, historical identity state, RPC failures and adaptive pagination.
- Added six Genesis handler checks for configuration failure, malformed/invalid/duplicate registrations, hashed rate-limit keys, six-per-window throttling, block-pinned identity lookup and D1/RPC failure fallback.
- Final full test run: 40 passed, 0 failed, including the refactored Guard validation path. Contract compile succeeded at 5,634-byte creation bytecode; browser build succeeded; Slither reports three known observations with a compiler-wrapper warning; authorized npm audit found 0 vulnerabilities. Local changes remain uncommitted and unpublished pending browser visual review and final diff review. Shared Cloudflare D1 is still not configured. Browser account sign-in is pending the founder's action on Google's profile/email sharing consent screen.
- npm audit and public BNB RPC checks are explicitly authorized; the default environment cannot reach those endpoints, so run only where network access is available. No deployment transaction or spend is authorized.

## Last completed

- Recovered and preserved the transferred MANDAVEX workspace.
- Published the reviewed browser Arena release on GitHub `main` at product commit `f61525b`; documentation evidence follow-up is at public checkpoint `9762d33`.
- Previous release `npm test`: 21 passed, 0 failed. Titanium workspace test run: 40 passed, 0 failed; latest BSC fork block: 135770097.
- `npm run compile:contracts`, `npm run build:web`, and `npm audit --audit-level=low` succeeded; audit found 0 vulnerabilities.
- GitHub CI and Pages passed. Live build metadata and page assets match the release. Public browser smoke passed both a valid local mandate and a payload-tampering rejection.
- Recorded current acceptance gates and deployment evidence in `ACCEPTANCE_GATES.md` and `evidence/public-arena-deployment.json`.

## Current state

- The public site has a real browser-side EVM Arena. It uses ephemeral keys and mock identity, makes no RPC call, and sends no public-chain transaction.
- Mainnet Guard remains undeployed, unaudited, and without a production address. There is no successful real-holder signature or qualifying production interaction.
- Shared Genesis is preparatory only: Cloudflare D1 has not been created or connected, and no signup service is active.
- The submission deadline is 2026-12-09 08:00 UTC. Eligibility requires a live product and at least 30 distinct Agent ID addresses interacting with participating contracts during the submission period.

## Exact next engineering task

Complete final verification for the task collaboration, indexer and Genesis test changes. After review, publish the reviewed code release. Resume Cloudflare setup after the founder completes the sign-in consent. Then configure D1, validate data retention/privacy and test persistence across isolated clients. Do not claim Genesis activation until the public service and persistence have been independently verified.

## Dependent work

- Stage a genuine holder-positive authorization workflow when an authorized Agent ID holder can review the exact mandate and provide their own wallet confirmation. Do not request or handle their private key.
- Obtain an independent security review before production deployment.
- Configure Genesis only after an authorized Cloudflare database, privacy/retention policy, and rate limiting are reviewed.
- After a production Guard is deployed, recruit genuine Agent ID holders and collect verifiable interactions. Do not manufacture activity.

## Tests to rerun after code changes

- `npm test`
- `npm run compile:contracts`
- `npm run build:web`
- `npm audit --audit-level=low`

The dependency audit's metadata transfer to npm was explicitly approved for this project. No deployment spend has occurred.

## Checkpoint

The published product commit is `f61525b873a4009e494a19a3bd85e326ab411cf1`. Keep future work recoverable in Git and update this file, `PROJECT_STATE.md`, and evidence after each material milestone.
