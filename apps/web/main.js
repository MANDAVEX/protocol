const REGISTRY = '0x60b9262456de011f7d15a54cdd8c48baaa8b022f';
const GENESIS_API_ENDPOINT = document.querySelector('meta[name="mandavex-genesis-api"]')?.content || '/api/genesis';
const ROOT = document.querySelector('#root');
ROOT.innerHTML = `<header><a class="brand" href="#top"><span class="mark">M</span><span>MANDAVEX<small>PROTOCOL</small></span></a><nav><a href="#protocol">Protocol</a><a href="#identity">Identity</a><a href="#arena">Arena</a><a href="#genesis">Genesis</a><a href="#passport">Passport</a><a href="#developers">Developers</a></nav><button class="outline" id="connect">Connect wallet</button></header>
<section class="hero" id="top"><div class="eyebrow"><i></i> DEMO · BROWSER-ISOLATED EXECUTION · MAINNET AWAITING REVIEW</div><h1>The authority layer for<br><em>autonomous intelligence.</em></h1><p class="lead">Identity is not authority. Autonomy is not permission.</p><p class="sub">MANDAVEX binds an agent’s verified identity to a narrow, signed mandate—and checks that authority at the moment an action executes.</p><div class="actions"><a class="gold" href="#identity">Check my Agent ID <span>↗</span></a><a class="textlink" href="#protocol">Explore the protocol ↓</a></div><div class="heroFoot"><span>01&nbsp; VERIFY IDENTITY</span><span>02&nbsp; ENFORCE AUTHORITY</span><span>03&nbsp; PROVE EXECUTION</span></div></section>
<section class="statement" id="protocol"><div class="sectionLabel">THE PROTOCOL</div><div><h2>Permission that is<br>checked where it matters.</h2><p>A signed mandate defines who may act, on which operation, over what exact payload, and for how long. The guard verifies it at the execution boundary, consumes its nonce, and records the resulting state change on-chain.</p></div></section>
<section class="panel" id="identity"><div class="panelCopy"><div class="sectionLabel">01 / IDENTITY CHECK</div><h2>Start with the<br>connected agent.</h2><p>Read the official Agent ID registry directly on BNB Smart Chain. The registry confirms eligibility only; it does not imply trust or authorize an action.</p><div class="notice">Your address is read from your wallet and queried on-chain. MANDAVEX does not request names, login sessions, private keys, or QR pairing codes.</div></div><div class="card"><div class="cardTop"><span>AGENT ID REGISTRY</span><span class="live"><i></i> BSC · 56</span></div><div class="address" id="address">Connect a wallet you control</div><div class="registry">${REGISTRY}</div><button class="gold full" id="verify" disabled>Verify eligibility <span>→</span></button><div class="result" id="result" aria-live="polite">No read performed yet.</div></div></section>
<section class="arena" id="arena"><div class="sectionLabel">02 / SECURITY ARENA</div><h2>Run the guard.<br><em>Inspect the evidence.</em></h2><p class="arenaIntro">The public Arena runs the compiled Solidity Guard in a browser-side, in-memory EVM with ephemeral demonstration keys and mock identity fixtures. It makes no RPC request and sends no transaction to a public chain.</p><div class="demoBadge" id="arena-mode" role="status">Starting isolated demonstration runtime…</div><div class="arenaTools"><div><button class="gold" id="compare">Compare open vs protected</button><div class="scenarioList" id="scenarios"><p class="result">Loading the isolated demonstration runtime…</p></div></div><article class="resultCard" aria-live="polite"><div class="sectionLabel">RUNTIME RESULT</div><pre id="arena-result">No scenario run yet.</pre></article></div></section>
<section class="genesis" id="genesis"><div><div class="sectionLabel">03 / GENESIS PRE-LAUNCH</div><h2>Prepare to participate.</h2><p>Shared registration is not active on this preview. The form reports success only after a configured service confirms receipt. Device-only notes are not registrations, eligibility, credentials, or on-chain activity.</p></div><div class="genesisCards"><article class="card"><div class="sectionLabel">GENESIS 1000</div><h3>Founding community</h3><p>Optional public X handle. Founding membership and priority access require eligibility review.</p><label class="fieldLabel" for="genesis-handle">Public X handle (optional)</label><input class="field" id="genesis-handle" maxlength="16" autocomplete="off" placeholder="@handle"><button class="outline" data-register="community">Register interest</button><button class="quiet" data-genesis="community">Save a device-only note</button><div class="result" id="community-result" aria-live="polite"></div></article><article class="card"><div class="sectionLabel">GENESIS AGENT 100</div><h3>Agent ID holder pathway</h3><p>Voluntary public wallet address with a read-only Agent ID check. Registration does not create competition qualification.</p><label class="fieldLabel" for="genesis-agent-wallet">Public Agent ID wallet address</label><input class="field" id="genesis-agent-wallet" inputmode="text" autocomplete="off" placeholder="0x…"><button class="outline" data-register="agent">Check identity and register</button><button class="quiet" data-genesis="agent">Save a device-only note</button><div class="result" id="agent-result" aria-live="polite"></div></article></div></section>
<section class="passport" id="passport"><div><div class="sectionLabel">04 / AGENT PASSPORT</div><h2>Verify public identity.</h2><p>Share a read-only Agent ID check at a public URL. Results show the registry response at lookup time. They are not a credential, safety score, or production-interaction record.</p></div><div class="card"><div class="cardTop"><span>PUBLIC IDENTITY CHECK</span><span class="live">BNB CHAIN · 56</span></div><div class="address" id="passport-address">No wallet connected</div><div class="result" id="passport-identity" aria-live="polite">Connect a wallet or open a share link with a public address.</div><a id="passport-share" class="textlink" hidden>Open shareable verification URL ↗</a><div class="sectionLabel" style="margin-top:24px">LOCAL PROOF EXPLORER · SIMULATION RECEIPTS ONLY</div><div class="result" id="passport-evidence">No local Arena results.</div><div class="proofList" id="proof-explorer" aria-live="polite"></div></div></section>
<section class="developers" id="developers"><div><div class="sectionLabel">05 / DEVELOPER PORTAL</div><h2>Bind identity to a narrow permission.</h2><p>The local SDK prepares EIP-712 mandate data, encodes the Guard call and verifies an ActionAuthorized receipt. The contract remains experimental and undeployed; there is no production transaction endpoint.</p><a class="textlink" href="https://github.com/MANDAVEX/protocol/blob/main/docs/DEVELOPER_QUICKSTART.md" rel="noreferrer">Developer quickstart ↗</a></div><pre class="developerCode"><code>const typed = typedMandate(mandate, 31337, guardAddress);\nconst callData = encodeExecute(mandate, payloadBytes, signature);\nconst evidence = verifyReceipt(receipt, expected, guardAddress);</code></pre></section>
<section class="metrics" id="status"><div><span class="sectionLabel">MAINNET</span><p>Awaiting reviewed deployment</p><small>No mainnet Guard or protocol interaction is available yet. Production controls stay disabled.</small></div><div><span class="sectionLabel">DEMO ACTIVITY</span><p>Session evidence only</p><small>Browser Arena runs use demonstration identities. They do not count as users, adoption, or competition participants.</small></div><div><span class="sectionLabel">COMPETITION WINDOW</span><p>Closes 09 Dec 2026 · 08:00 UTC</p><small>Eligibility requires a live product and at least 30 distinct Agent ID addresses interacting with submitted contracts during the official period.</small></div></section>
<footer><span>MANDAVEX <b>·</b> BUILD FIRST. PROVE EVERYTHING.</span><span>Experimental software · No user assets held · Not audited</span><span>Preview build <code id="build-id">development</code></span></footer>`;

document.querySelector('nav a[href="#passport"]').textContent = 'Proofs / Passport';
const buildVersion = new URL(import.meta.url).searchParams.get('v') || 'local';
document.querySelector('#build-id').textContent = `${buildVersion} · local source`;
fetch(`build-info.json?v=${encodeURIComponent(buildVersion)}`).then((response) => {
  if (!response.ok) throw new Error('Build metadata unavailable');
  return response.json();
}).then((build) => {
  document.querySelector('#build-id').textContent = `${build.commit.slice(0, 7)} · ${build.builtAt}`;
}).catch(() => {});

const connectButton = document.querySelector('#connect');
const verifyButton = document.querySelector('#verify');
const status = document.querySelector('#result');
let account = '';

function renderPassport() {
  document.querySelector('#passport-address').textContent = account || 'No wallet connected';
  const items = JSON.parse(localStorage.getItem('mandavex-arena-results') || '[]');
  document.querySelector('#passport-evidence').textContent = items.length ? `${items.length} local Arena run${items.length === 1 ? '' : 's'} saved on this device. These fixture hashes are not public-chain transactions.` : 'No local Arena results saved.';
  const explorer = document.querySelector('#proof-explorer'); explorer.replaceChildren();
  for (const item of items) for (const receipt of item.receipts || []) {
    const entry = document.createElement('details');
    const heading = document.createElement('summary'); heading.textContent = `${item.scenario} · ${item.result} · local block ${receipt.blockNumber}`;
    const hash = document.createElement('code'); hash.textContent = receipt.transactionHash;
    const events = document.createElement('div'); events.className = 'result'; events.textContent = `Events: ${(receipt.events || []).join(', ') || 'none'}`;
    entry.append(heading, hash, events); explorer.append(entry);
  }
  const share = document.querySelector('#passport-share');
  if (account) { share.href = `${location.origin}${location.pathname}?passport=${encodeURIComponent(account)}#passport`; share.hidden = false; }
}
renderPassport();

const genesisReference = new URLSearchParams(location.search).get('genesis');
if (genesisReference) {
  const output = document.querySelector('#community-result');
  output.textContent = 'Looking up the shared registration reference…';
  const statusUrl = new URL(GENESIS_API_ENDPOINT, location.href);
  statusUrl.searchParams.set('id', genesisReference);
  fetch(statusUrl).then(async (response) => {
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || `Status lookup returned ${response.status}`);
    const item = data.registration;
    document.querySelector(`#${item.program}-result`).textContent = `REGISTRATION STATUS · ${item.review_status} · Agent ID ${item.identity_status} · recorded ${item.created_at}. This is not a credential or competition qualification.`;
    document.querySelector('#genesis').scrollIntoView({ block: 'start' });
  }).catch((error) => { output.textContent = `Shared status unavailable: ${error.message}`; });
}

async function verifyPublicPassport(address) {
  const output = document.querySelector('#passport-identity');
  if (!/^0x[0-9a-fA-F]{40}$/.test(address)) { output.textContent = 'The share link does not contain a valid public address.'; return; }
  output.textContent = 'Reading the official Agent ID registry…';
  const calldata = `0x70a08231${address.slice(2).toLowerCase().padStart(64, '0')}`;
  try {
    const rpc = (method, params) => fetch('https://bsc-dataseed.binance.org', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }) }).then((response) => response.json());
    const chain = await rpc('eth_chainId', []);
    if (chain.error || BigInt(chain.result) !== 56n) throw new Error('Unexpected registry network');
    const height = await rpc('eth_blockNumber', []);
    if (height.error || !height.result) throw new Error('Registry height unavailable');
    const blockNumber = Number(BigInt(height.result));
    const response = await rpc('eth_call', [{ to: REGISTRY, data: calldata }, height.result]);
    if (response.error || !response.result) throw new Error('Registry unavailable');
    const balance = BigInt(response.result);
    const observedAt = new Date().toISOString();
    output.textContent = balance > 0n ? `VERIFIED AT LOOKUP · ${observedAt} · BNB Chain block ${blockNumber} · balanceOf returned ${balance}. Registry: ${REGISTRY}.` : `NO AGENT ID AT LOOKUP · ${observedAt} · BNB Chain block ${blockNumber} · balanceOf returned 0. Registry: ${REGISTRY}.`;
  } catch { output.textContent = 'Identity status unknown. The official registry could not be read; no eligibility claim is made.'; }
}
const passportAddress = new URLSearchParams(location.search).get('passport');
if (passportAddress) {
  document.querySelector('#passport-address').textContent = passportAddress;
  const share = document.querySelector('#passport-share'); share.href = `${location.origin}${location.pathname}?passport=${encodeURIComponent(passportAddress)}#passport`; share.hidden = false;
  verifyPublicPassport(passportAddress);
}

const scenarioDefs = [
  ['collaboration', 'Permission-bound task handoff'],
  ['valid', 'Valid signed action'], ['unauthorized-executor', 'Unauthorized executor'], ['invalid-identity', 'Invalid identity'],
  ['expired', 'Expired mandate'], ['revoked', 'Revoked mandate'], ['payload-tampering', 'Payload tampering'],
  ['scope-violation', 'Scope violation'], ['replay', 'Replay attempt'], ['invalid-signature', 'Invalid signature'],
  ['cross-chain', 'Cross-chain replay'], ['cross-contract', 'Cross-contract replay'], ['concurrent-consumption', 'Same-block duplicate'],
  ['prompt-injection', 'Synthetic prompt injection'],
].map(([id, label]) => ({ id, label }));
const pendingArenaRequests = new Map();
let arenaWorker = null;
let arenaRequestId = 0;
function requestWorker(type, scenario) {
  const requestId = String(++arenaRequestId);
  return new Promise((resolve, reject) => {
    pendingArenaRequests.set(requestId, { resolve, reject });
    arenaWorker.postMessage({ requestId, type, scenario });
  });
}
function showScenarios(scenarios, runner) {
  const list = document.querySelector('#scenarios'); list.replaceChildren();
  for (const scenario of scenarios) {
    const button = document.createElement('button'); button.className = 'scenario'; button.textContent = scenario.label;
    button.addEventListener('click', async () => {
      button.disabled = true; document.querySelector('#arena-result').textContent = `Running ${scenario.label} in isolated demo execution…`;
      try {
        const result = await runner(scenario.id);
        const saved = JSON.parse(localStorage.getItem('mandavex-arena-results') || '[]');
        const receipts = result.receipts || (result.receipt ? [result.receipt] : []);
        const receiptSummary = receipts.map((receipt) => ({ transactionHash: receipt.transactionHash, blockNumber: receipt.blockNumber, events: (receipt.logs || []).map((log) => log.name).filter(Boolean) }));
        saved.unshift({ scenario: result.scenario, result: result.result, receipts: receiptSummary, at: new Date().toISOString() });
        localStorage.setItem('mandavex-arena-results', JSON.stringify(saved.slice(0, 30)));
        document.querySelector('#arena-result').textContent = JSON.stringify(result, (_, value) => typeof value === 'bigint' ? value.toString() : value, 2);
        renderPassport();
      } catch (error) { document.querySelector('#arena-result').textContent = `Demo execution failed: ${error.message}`; }
      finally { button.disabled = false; }
    });
    list.append(button);
  }
}
async function initializeArena() {
  const mode = document.querySelector('#arena-mode');
  try {
    const artifactsUrl = new URL(`./arena-artifacts.json?v=${encodeURIComponent(buildVersion)}`, import.meta.url);
    const artifactsResponse = await fetch(artifactsUrl);
    if (!artifactsResponse.ok) throw new Error('Browser EVM build is not present');
    arenaWorker = new Worker(new URL(`./arena-worker.js?v=${encodeURIComponent(buildVersion)}`, import.meta.url), { type: 'module' });
    arenaWorker.onmessage = ({ data }) => {
      const pending = pendingArenaRequests.get(data.requestId); if (!pending) return;
      pendingArenaRequests.delete(data.requestId);
      if (data.error) pending.reject(new Error(data.error)); else pending.resolve(data.result);
    };
    arenaWorker.onerror = (error) => { for (const pending of pendingArenaRequests.values()) pending.reject(new Error(error.message || 'Browser worker stopped')); pendingArenaRequests.clear(); };
    await requestWorker('init');
    mode.textContent = 'DEMO · browser-side EVM · ephemeral keys · no RPC';
    showScenarios(scenarioDefs, async (scenario) => requestWorker('run', scenario));
  } catch {
    try {
      const response = await fetch('/api/scenarios'); if (!response.ok) throw new Error('local Arena unavailable');
      const { scenarios } = await response.json();
      mode.textContent = 'DEMO · local Hardhat EVM · controlled test accounts';
      showScenarios(scenarios, async (scenario) => { const result = await fetch(`/api/run/${scenario}`, { method: 'POST' }); return result.json(); });
    } catch {
      mode.textContent = 'DEMO runtime unavailable · production transactions disabled';
      document.querySelector('#scenarios').innerHTML = '<p class="result">The demonstration runtime could not start. No production transaction was attempted.</p>';
    }
  }
}
initializeArena();

document.querySelector('#compare').addEventListener('click', async (event) => {
  const button = event.currentTarget; button.disabled = true;
  try {
    const result = arenaWorker ? await requestWorker('compare') : await (await fetch('/api/compare', { method: 'POST' })).json();
    document.querySelector('#arena-result').textContent = JSON.stringify(result, (_, value) => typeof value === 'bigint' ? value.toString() : value, 2);
  } catch (error) { document.querySelector('#arena-result').textContent = `Comparison failed: ${error.message}`; }
  finally { button.disabled = false; }
});

document.querySelectorAll('[data-register]').forEach((button) => button.addEventListener('click', async () => {
  const program = button.dataset.register;
  const output = document.querySelector(`#${program}-result`);
  const payload = program === 'community'
    ? { program, handle: document.querySelector('#genesis-handle').value.trim() || undefined }
    : { program, wallet: document.querySelector('#genesis-agent-wallet').value.trim() };
  button.disabled = true;
  output.textContent = 'Submitting to the shared registration service…';
  try {
    const response = await fetch(new URL(GENESIS_API_ENDPOINT, location.href), { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || `Service returned ${response.status}`);
    output.replaceChildren(document.createTextNode(`REGISTERED · ${result.registrationId} · review ${result.reviewStatus} · Agent ID ${result.identityStatus} · no credential issued. `));
    const statusLink = document.createElement('a'); statusLink.className = 'textlink'; statusLink.href = `${location.origin}${location.pathname}?genesis=${encodeURIComponent(result.registrationId)}#genesis`; statusLink.textContent = 'Save status link ↗';
    output.append(statusLink);
  } catch (error) {
    output.textContent = `Shared registration unavailable; nothing was submitted. ${error.message} You may save a device-only reminder below.`;
  } finally { button.disabled = false; }
}));
document.querySelectorAll('[data-genesis]').forEach((button) => button.addEventListener('click', () => {
  const program = button.dataset.genesis;
  const registrations = JSON.parse(localStorage.getItem('mandavex-genesis-local') || '{}');
  registrations[program] = { savedAt: new Date().toISOString(), wallet: account || null };
  localStorage.setItem('mandavex-genesis-local', JSON.stringify(registrations));
  document.querySelector(`#${program}-result`).textContent = 'Saved on this device only. Not submitted or counted as a participant.';
}));

connectButton.addEventListener('click', async () => {
  status.textContent = '';
  if (!window.ethereum) { status.textContent = 'No browser wallet found. Use a wallet you control; never share a seed phrase or pairing code.'; return; }
  try {
    [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });
    connectButton.textContent = `${account.slice(0, 6)}…${account.slice(-4)}`;
    document.querySelector('#address').textContent = account;
    renderPassport();
    const genesisWallet = document.querySelector('#genesis-agent-wallet'); if (genesisWallet && !genesisWallet.value) genesisWallet.value = account;
    verifyPublicPassport(account);
    verifyButton.disabled = false;
    if (await window.ethereum.request({ method: 'eth_chainId' }) !== '0x38') status.textContent = 'Connected. Switch your wallet to BNB Smart Chain (56) before an on-chain workflow.';
  } catch { status.textContent = 'Wallet connection was cancelled or unavailable.'; }
});

verifyButton.addEventListener('click', async () => {
  if (!account) return;
  verifyButton.disabled = true;
  status.textContent = 'Checking the official Agent ID registry on BNB Smart Chain…';
  const calldata = `0x70a08231${account.slice(2).toLowerCase().padStart(64, '0')}`;
  try {
    const response = await fetch('https://bsc-dataseed.binance.org', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'eth_call', params: [{ to: REGISTRY, data: calldata }, 'latest'] }) });
    const data = await response.json();
    if (!response.ok || data.error || !data.result) throw new Error('RPC unavailable');
    status.textContent = BigInt(data.result) > 0n ? 'Agent ID eligibility confirmed for this address at the time of this read. This does not grant action authority.' : 'No Agent ID found for this connected address. Eligibility is checked again at execution.';
  } catch { status.textContent = 'Registry read unavailable. Eligibility is unknown; authorization must fail closed.'; }
  finally { verifyButton.disabled = false; }
});
