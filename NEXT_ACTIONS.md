# Next Actions

Updated: 2026-11-26 02:00 UTC.

## Last completed

- Recovered and preserved the transferred MANDAVEX workspace.
- Published the reviewed browser Arena release on GitHub `main` at product commit `f61525b`.
- `npm test`: 21 passed, 0 failed. Latest BSC fork block: 135760977.
- `npm run compile:contracts`, `npm run build:web`, and `npm audit --audit-level=low` succeeded; audit found 0 vulnerabilities.
- GitHub CI and Pages passed. Live build metadata and page assets match the release. Public browser smoke passed both a valid local mandate and a payload-tampering rejection.
- Recorded current acceptance gates and deployment evidence in `ACCEPTANCE_GATES.md` and `evidence/public-arena-deployment.json`.

## Current state

- The public site has a real browser-side EVM Arena. It uses ephemeral keys and mock identity, makes no RPC call, and sends no public-chain transaction.
- Mainnet Guard remains undeployed, unaudited, and without a production address. There is no successful real-holder signature or qualifying production interaction.
- Shared Genesis is preparatory only: Cloudflare D1 has not been created or connected, and no signup service is active.
- The submission deadline is 2026-12-09 08:00 UTC. Eligibility requires a live product and at least 30 distinct Agent ID addresses interacting with participating contracts during the submission period.

## Exact next engineering task

Add focused tests around `scripts/index-activity.cjs` for candidate classification, time windows, canonical receipts, and local-fixture handling. Keep candidate counts separate from official qualifying-user determinations. Then run the full suite and publish only after review.

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