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

The same scenarios ran against the public Pages release after CI and Pages completed successfully for commit `724b59f2a58232289d3d7f497dacab96abc88333`. `npm run test:browser:public` passed at both viewports and saved:

- [`screenshots/public-release-desktop.png`](screenshots/public-release-desktop.png)
- [`screenshots/public-release-mobile.png`](screenshots/public-release-mobile.png)

The public screenshots show browser-side EVM fixtures, not production wallet execution or mainnet activity. The adoption panel remains blocked and displays unknown counts because no Guard is deployed.
