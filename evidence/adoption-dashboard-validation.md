# Public adoption dashboard validation

Updated: 2026-11-27

## Evidence status

IMPLEMENTED BUT UNVERIFIED. The public Adoption panel and build-time snapshot generator are implemented. It has not yet been visually checked in desktop/mobile browser and is not deployed in the public site as of this record.

## Local results

- `node --test tests/adoption-status.test.cjs`: 4 passed. Tests cover the pre-deployment view, deployment without a saved scan, candidate versus qualifying count separation, and rejection of fixture or mismatched reports.
- `npm test`: 45 passed, 0 failed. The read-only BSC fork ran at block `135936170`; the holder probe passed the identity gates and stopped at the deliberately invalid signature. No holder signed, no mainnet transaction was sent, and no adoption is claimed.
- `npm run build:web`: passed. It generated `apps/web/adoption-status.json` with `evidenceStatus: BLOCKED`, `scanStatus: NOT RUN`, null candidate/qualification counts, and the reason that no Guard deployment exists. The browser worker built at 767 KiB.
- `npm audit --audit-level=low`: 0 vulnerabilities.

## Data safeguards

The build reads `deployments/manifest.json` and optionally `evidence/adoption-activity.json`. It only accepts a saved scan marked `IMPLEMENTED BUT UNVERIFIED` that matches BNB Chain 56, the deployed Guard, the official Agent ID registry, a deployment-bounded block range, and a unique sender list matching `candidateCount`. Invalid or fixture reports render `BLOCKED` with unknown counts. The UI keeps indexer candidates separate from organizer-determined qualification, and never reads local Arena results into the adoption panel.

Current public evidence remains pending publication, and the UI still needs a desktop/mobile smoke check after the user's required GitHub authorization step.
