# Desktop and mobile browser smoke

Date: 2026-11-27 (Africa/Algiers)

## Evidence status

VERIFIED for the **local demo UI only**. Playwright 1.65.1 and its Chromium browser exercised the current workspace build at 1440×900 (desktop) and 390×844 (mobile). This does not establish production wallet execution or mainnet activity.

## Results

| Check | Desktop | Mobile |
|---|---|---|
| Browser-isolated EVM initialized; no RPC | PASS | PASS |
| Valid demo action emitted `ActionAuthorized` receipt | PASS | PASS |
| Permission-bound handoff reached accepted state with task receipts | PASS | PASS |
| Passport local proof explorer showed three demo receipts | PASS | PASS |
| Horizontal overflow | None | None |
| Hero action/footer overlap | None | None |
| Browser page errors | 0 | 0 |

The first mobile visual inspection found the hero footer overlapping the action row. The mobile breakpoint now uses normal document flow for that footer and lets actions wrap; subsequent Playwright assertions and screenshot review confirmed separation at 390 px. Full-page screenshots captured by `npm run test:browser`:

- [`screenshots/local-demo-desktop.png`](screenshots/local-demo-desktop.png)
- [`screenshots/local-demo-mobile.png`](screenshots/local-demo-mobile.png)

The pages show the local browser Arena's accepted task receipts and clearly blocked adoption status. They are local demo fixtures, not production activity. Regression command: `npm run test:browser` (after `npx playwright install chromium`).

The dashboard deployment itself is separately covered by the successful GitHub CI and Pages workflows for commit `75e0f355cbca95ae59761e57fce776a5fd73e11c`. Changes made after that commit, including the responsive fix and current contract/SDK work, are local until reviewed and published.
