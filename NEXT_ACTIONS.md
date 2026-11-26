# Next Actions

## Active continuation — Cloudflare Genesis

- Await the user's click or cancellation on GitHub's Cloudflare Workers and Pages authorization screen; do not accept the new security access on their behalf.
- Resume GitHub repository linking after the user returns. Create only a free Pages project and free D1 database; preserve the project-level D1 binding and apply `infra/cloudflare/migrations/0001_genesis.sql`.
- Wrangler 4.168.0 is installed and its local D1 migration procedure is verified. Once the remote D1 ID and Pages project exist, use the explicit `--remote` migration path, configure `RATE_LIMIT_SALT` as an encrypted secret (never commit it), deploy Pages Functions, and set the production `mandavex-genesis-api` meta endpoint to the verified `pages.dev` URL.
- Verify the production UI and API from distinct browser contexts against D1: registration persistence, duplicate handling, invalid data, rate limits, identity lookup, OPTIONS/CORS allowlist, status reference and storage/RPC failures. Do not activate Genesis until every check passes.
- Then continue the remaining Titanium priorities: desktop/mobile workflow smoke, privacy/retention policy, public adoption dashboard, wallet integration review, security hardening and competition evidence. Keep mainnet transaction count zero unless independently verified real interactions exist.

Updated: 2026-11-27 00:20 UTC.

## Operation Titanium progress — 2026-11-26

- Implemented fixed permission-bound task submission and review acceptance in the Guard, Arena, SDK and preparation-only CLI, including unsigned revoke calldata. Local EVM tests verify exact-hash acceptance, distinct reviewer enforcement, and rejection of self-review, wrong owner, duplicate tasks and malformed payloads.
- Added eight focused indexer tests covering canonical receipts, reorg rejection, failed receipts, direct versus relayed senders, address de-duplication, competition-window edges, historical identity state, RPC failures and adaptive pagination.
- Added six Genesis handler checks for configuration failure, malformed/invalid/duplicate registrations, hashed rate-limit keys, six-per-window throttling, block-pinned identity lookup and D1/RPC failure fallback.
- Final previous full test run: 40 passed, 0 failed, including the refactored Guard validation path. The current follow-up run passes 41/41; contract compile, browser build, and authorized dependency audit pass. Release `f345192` was the starting checkpoint for this continuation. Cloudflare dashboard sign-in is complete; GitHub Workers and Pages authorization remains with the user. Shared Cloudflare D1 is not configured.
- npm audit and public BNB RPC checks are explicitly authorized; the default environment cannot reach those endpoints, so run only where network access is available. No deployment transaction or spend is authorized.

## Last completed

- Recovered and preserved the transferred MANDAVEX workspace.
- Published the initial browser Arena release at `f61525b`, documentation checkpoint `9762d33`, and Titanium task collaboration at `467cbbf` on GitHub `main` and Pages.
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

Resume the handed-off browser session after the founder completes Google's sign-in consent, then verify the public collaboration workflow on desktop and mobile. Continue to free D1 setup and Genesis deployment, keeping the service inactive until persistence, privacy, rate limits, duplicate behavior and failure paths are verified against real Cloudflare D1. Do not claim Genesis activation until that end-to-end check succeeds.

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
