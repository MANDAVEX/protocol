---
name: mandavex-cloudflare-genesis
description: Provision or troubleshoot MANDAVEX Genesis on free Cloudflare Pages and D1. Use for the Pages Functions deployment, D1 migration, bindings, exact-origin website connection, or service verification.
---

# MANDAVEX Cloudflare Genesis

Operate only the MANDAVEX Pages project and Genesis database. Preserve the $0.00 limit: free Pages and D1 only, no paid plan, domain purchase, or unrelated account changes. Do not claim the service is active until production persistence and failure checks pass.

## Pages deployment path

- Pages Functions in the repository's root `functions/` directory require Git integration or Wrangler. Cloudflare dashboard drag-and-drop does not compile this directory. See [Cloudflare Direct Upload docs](https://developers.cloudflare.com/pages/get-started/direct-upload/).
- For Git integration, select only `MANDAVEX/protocol` when GitHub offers repository scope. Use repository root `.`, build command `npm ci && npm run build:web`, and output directory `apps/web`.
- Treat `wrangler.toml` as the Pages configuration source of truth. Keep its D1 binding named `DB`, the migration directory `infra/cloudflare/migrations`, and `GENESIS_ALLOWED_ORIGIN=https://mandavex.github.io`. Replace the database ID placeholder only with the ID returned by the authorized Cloudflare account.
- `.dev.vars`, `.dev.vars.*`, and `.wrangler/` are ignored by Git. Keep local secrets and Wrangler persistence/auth state out of tracked files.
- The static GitHub Pages site reads its API endpoint from `<meta name="mandavex-genesis-api">`. Once the actual Pages URL is known, set its full `/api/genesis` URL and publish that frontend update. The Function only emits CORS access for the exact configured GitHub Pages origin; never use `*`.

## D1 and secrets

- Create only the free D1 database named `mandavex-genesis`, then bind it as `DB` to the Pages project.
- Apply `infra/cloudflare/migrations/0001_genesis.sql` to the remote database only after confirming the target database ID and using Wrangler's explicit `--remote` option. Local migrations use `--local` and a task-specific temporary `--persist-to` folder.
- `RATE_LIMIT_SALT` is required and must be configured as an encrypted Pages secret. Never put its value in `wrangler.toml`, source control, terminal logs, or public build variables. Generate a fresh random value for the project; confirm at action time before submitting the new secret to Cloudflare.
- Keep OAuth access within the requested Cloudflare account and selected MANDAVEX repository. Never request, inspect, or store passwords, browser cookies, recovery codes, or raw OAuth tokens. Pause for the user on account-access consent, MFA, CAPTCHA, or another platform-required human authorization.

## Local validation on Windows

- Wrangler 4.168.0 is a project dev dependency. Its first install stalled during npm reification; `npm ci --ignore-scripts` restored the updated lockfile and succeeded after about four minutes. Confirm `npm exec -- wrangler --version` before using it.
- The default Wrangler log directory was not writable in the managed desktop environment. Set `XDG_CONFIG_HOME` to a task-specific directory under `$env:TEMP`; keep all Wrangler authentication state outside the repository.
- `wrangler pages dev` initially failed under restricted execution because workerd could not resolve repository paths and access its temporary SQLite file. Run the local emulator with the approved local execution permissions and a temporary `--persist-to` directory. This does not authorize remote access or deployment.
- Cloudflare's local Pages emulator did not expose `cf-connecting-ip` to this local client, even when the request attempted to set the header. Genesis correctly failed closed with 503 before writing. Do not add a production fallback for this platform-owned header. Use the API unit tests for rate-limit handler paths, and use Wrangler's local D1 commands for schema and persistence checks.
- Verified local D1 procedure: `npm exec -- wrangler d1 migrations apply mandavex-genesis --local --persist-to <temp-dir> --force`; then use a separate `wrangler d1 execute ... --local --persist-to <same-temp-dir>` process to confirm the test row is still present. Use only synthetic records in this local database.

## Release gates

1. Review exact GitHub application scope and complete human consent before repository linking.
2. Verify the chosen Pages build and successful deployment before configuring the live frontend endpoint.
3. Confirm D1 binding, migration status, encrypted `RATE_LIMIT_SALT`, and exact allowed origin in production and preview settings.
4. Test create, duplicate, invalid input, rate limit, Agent ID lookup (verified and RPC-failure states), status link, persistence from independent sessions, CORS rejection, and D1 failure handling against the real free service.
5. Record the project URL/deployment, database ID (not secrets), observed settings, tests, and $0.00 cost. Keep the form inactive or clearly unavailable if any gate is missing.

Current verified state and evidence live in `evidence/titanium-cloudflare-preparation.md` and `PROJECT_STATE.md`. The remote Cloudflare project and database are not yet confirmed there; local D1 and mocked handler evidence must never be described as production verification.
