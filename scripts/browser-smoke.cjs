const { spawn } = require('node:child_process');
const path = require('node:path');
const fs = require('node:fs');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
const screenshotDir = path.join(root, 'evidence/screenshots');
const publicMode = process.argv.includes('--public');
const previewUrl = publicMode ? 'https://mandavex.github.io/protocol/' : 'http://127.0.0.1:4173/';
const server = publicMode ? null : spawn(process.execPath, [path.join(root, 'scripts/dev-server.cjs')], {
  cwd: root, stdio: 'ignore', windowsHide: true,
});

async function waitForServer() {
  if (publicMode) return;
  for (let attempt = 0; attempt < 100; attempt++) {
    if (server.exitCode !== null) throw new Error(`Preview server exited with ${server.exitCode}`);
    try {
      const response = await fetch('http://127.0.0.1:4173/');
      if (response.ok) return;
    } catch { /* wait for the loopback server */ }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error('Local preview did not start');
}

async function run() {
  await waitForServer();
  fs.mkdirSync(screenshotDir, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const results = [];
  try {
    for (const viewport of [
      { name: 'desktop', width: 1440, height: 900 },
      { name: 'mobile', width: 390, height: 844 },
    ]) {
      const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height } });
      const pageErrors = [];
      page.on('pageerror', (error) => pageErrors.push(error.message));
      await page.goto(previewUrl, { waitUntil: 'domcontentloaded' });
      await page.getByRole('button', { name: 'Valid signed action' }).waitFor({ timeout: 30000 });
      const mode = await page.locator('#arena-mode').innerText();
      if (!mode.includes('browser-side EVM')) throw new Error(`${viewport.name}: ${mode}`);

      const bounds = await page.evaluate(() => {
        const actions = document.querySelector('.hero .actions').getBoundingClientRect();
        const foot = document.querySelector('.heroFoot').getBoundingClientRect();
        return { width: document.documentElement.scrollWidth, viewport: innerWidth, actionsBottom: actions.bottom, footTop: foot.top };
      });
      if (bounds.width > bounds.viewport + 1) throw new Error(`${viewport.name}: horizontal overflow ${JSON.stringify(bounds)}`);
      if (bounds.footTop < bounds.actionsBottom - 1) throw new Error(`${viewport.name}: hero footer overlaps actions ${JSON.stringify(bounds)}`);

      await page.getByRole('button', { name: 'Valid signed action' }).click();
      await page.waitForFunction(() => document.querySelector('#arena-result').textContent.includes('"result": "PASS"'), null, { timeout: 30000 });
      const valid = await page.locator('#arena-result').innerText();
      if (!valid.includes('ActionAuthorized') || !valid.includes('transactionHash')) throw new Error(`${viewport.name}: valid receipt missing`);

      await page.getByRole('button', { name: 'Permission-bound task handoff' }).click();
      await page.waitForFunction(() => {
        const text = document.querySelector('#arena-result').textContent;
        return text.includes('"result": "PASS"') && text.includes('Accepted');
      }, null, { timeout: 30000 });
      const collaboration = await page.locator('#arena-result').innerText();
      if (!collaboration.includes('TaskTransition')) throw new Error(`${viewport.name}: task transition evidence missing`);

      const proof = await page.locator('#passport-evidence').innerText();
      const proofCount = await page.locator('#proof-explorer details').count();
      if (!proof.includes('2 local Arena runs') || proofCount < 3) throw new Error(`${viewport.name}: proof explorer did not update`);
      if (pageErrors.length) throw new Error(`${viewport.name}: page errors ${pageErrors.join('; ')}`);

      results.push({
        viewport: viewport.name,
        size: `${viewport.width}x${viewport.height}`,
        horizontalOverflow: false,
        heroOverlap: false,
        runtime: mode,
        validExecutionAndReceipt: 'PASS',
        permissionBoundTaskAndReceipts: 'PASS',
        localProofExplorerReceipts: proofCount,
        pageErrors,
      });
      await page.evaluate(() => window.scrollTo(0, 0));
      const screenshot = path.join(screenshotDir, `${publicMode ? 'public-release' : 'local-demo'}-${viewport.name}.png`);
      await page.screenshot({ path: screenshot, fullPage: true });
      results.at(-1).screenshot = path.relative(root, screenshot).replaceAll(path.sep, '/');
      await page.close();
    }
  } finally {
    await browser.close();
    server?.kill();
  }
  process.stdout.write(`${JSON.stringify({ status: 'VERIFIED', evidenceStatus: 'LOCAL BROWSER SMOKE · DEMO FIXTURES ONLY', results }, null, 2)}\n`);
}

run().catch((error) => {
  server?.kill();
  console.error(error);
  process.exitCode = 1;
});
