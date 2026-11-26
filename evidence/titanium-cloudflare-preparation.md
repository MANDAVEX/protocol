# Cloudflare Genesis preparation

Updated: 2026-11-27

## Status

PARTIALLY IMPLEMENTED. Cloudflare account authentication succeeded through the existing Google account. The Cloudflare Workers and Pages GitHub authorization screen was reached; the user is completing the final authorization. No Pages project, D1 database, secret, production migration, or remote deployment has been verified. The shared registration service remains inactive.

Reviewed local commit `1eea8a0586897b4aacdcb0bea2aaa9a4cf176ce4` was published to the existing public repository and GitHub Pages. CI succeeded at [run 45910841269](https://github.com/MANDAVEX/protocol/actions/runs/45910841269); GitHub Pages succeeded at [run 45910841169](https://github.com/MANDAVEX/protocol/actions/runs/45910841169). Public build metadata reports that exact commit, and `main.js`, `arena-worker.js`, and `arena-artifacts.json` returned HTTP 200. This is the static GitHub Pages build; it does not activate Cloudflare Genesis.

The follow-up evidence commit `219f49bd9819b6732563a58ac6925100f3e71eab` also passed CI ([run 45911022704](https://github.com/MANDAVEX/protocol/actions/runs/45911022704)) and GitHub Pages ([run 45911022703](https://github.com/MANDAVEX/protocol/actions/runs/45911022703)). Public `build-info.json` now reports `219f49bd9819b6732563a58ac6925100f3e71eab` (`2026-11-26T23:27:34Z`).

## Implemented locally

- `wrangler.toml` keeps the Pages project name, output directory, D1 binding placeholder, migration directory, and the single allowed production web origin.
- The public GitHub Pages frontend can be configured with a full Genesis API endpoint in `<meta name="mandavex-genesis-api">`; blank keeps the same-origin route for local/Pages hosting.
- Genesis API CORS reflects only the configured exact origin, varies by `Origin`, answers JSON preflight, and rejects other origins.
- `node --test tests/genesis.test.cjs`: 7 passed, including the origin/preflight checks and the prior validation, persistence mock, duplicate, rate-limit, identity, and failure tests.
- Full `npm test`: 41 passed, 0 failed. The read-only BSC fork ran at block `135932095`; the holder probe passed both identity gates but stopped on the deliberately invalid signature, so it does not prove real holder execution.
- `npm run compile:contracts`: passed with Solidity 0.8.39, 5,634-byte creation bytecode.
- `npm run build:web`: passed, producing a 767 KiB browser worker.
- Authorized `npm audit --audit-level=low`: 0 vulnerabilities.
- Wrangler 4.168.0 CLI runs when `XDG_CONFIG_HOME` points to a writable temporary directory. `wrangler pages dev` ran locally on `127.0.0.1:8788` with a temp D1 store after allowing the local Workerd process to access the managed OneDrive workspace.
- `wrangler d1 migrations apply mandavex-genesis --local --persist-to <temp> --force`: migration `0001_genesis.sql` applied successfully (4 SQL commands). A synthetic test record inserted in one Wrangler process was read in a separate process from the same temporary D1 store.
- Local Pages preflight returned 204 with the configured production origin and 403 for an unrelated origin. API POST remained 503 because the local Pages emulator did not expose `cf-connecting-ip`; explicitly sending that platform-owned header did not make it available to the handler. The D1 migration and independent-process persistence are verified locally, but the full registration API is not end-to-end verified against local D1. Mock handler tests pass.

## Verified setup findings

- Cloudflare's current Pages setup offers Git integration or file upload.
- Dashboard drag-and-drop does not compile the Pages `functions/` directory. Cloudflare documents Git integration or Wrangler for Pages Functions; `_worker.js` advanced mode is also supported for direct upload.
- Pages bindings can be kept in Wrangler configuration. Sensitive values belong in encrypted secrets, not `[vars]` or source control.
- Wrangler `4.168.0` is now a project dev dependency. Its first install stalled during dependency reification, so `npm ci --ignore-scripts` restored the installed tree from the updated lockfile (170 packages added). The CLI reports `4.168.0`; its initial version check also reported that the default per-user log directory is not writable in this managed environment. Run it with `XDG_CONFIG_HOME` set to a task-specific temp directory; never place Wrangler auth state under the source repository. Full tests, compilation, and browser build then passed.

## Required release gates

1. Complete the Cloudflare Workers and Pages authorization in GitHub and connect only `MANDAVEX/protocol`.
2. Configure Pages with root `.`, build `npm ci && npm run build:web`, and output `apps/web` (or verify the equivalent Wrangler configuration during first build).
3. Create the free `mandavex-genesis` D1 database, replace the placeholder database ID, and apply `0001_genesis.sql`.
4. Create an encrypted `RATE_LIMIT_SALT` secret, confirm the D1 binding is named `DB`, and deploy.
5. Set the verified API endpoint in the static frontend metadata and publish the frontend change.
6. Verify persistence across independent sessions and test invalid data, duplicates, rate limiting, identity lookups, status references, exact-origin CORS, and D1/RPC outages.
7. Record deployment IDs/URLs, test evidence, costs ($0.00), and honest evidence statuses before declaring Genesis active.

Reusable local procedures and the Windows/OneDrive findings are recorded in `skills/mandavex-cloudflare-genesis/SKILL.md`.

## Official references

- [Cloudflare Pages Direct Upload and Functions support](https://developers.cloudflare.com/pages/get-started/direct-upload/)
- [Cloudflare Pages Functions configuration and bindings](https://developers.cloudflare.com/pages/functions/wrangler-configuration/)
- [Cloudflare Pages bindings and encrypted secrets](https://developers.cloudflare.com/pages/functions/bindings/)
- [Cloudflare D1 migrations](https://developers.cloudflare.com/d1/reference/migrations/)
