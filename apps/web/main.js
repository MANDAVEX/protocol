const REGISTRY = '0x60b9262456de011f7d15a54cdd8c48baaa8b022f';
const ROOT = document.querySelector('#root');
ROOT.innerHTML = `<header><a class="brand" href="#top"><span class="mark">M</span><span>MANDAVEX<small>PROTOCOL</small></span></a><nav><a href="#protocol">Protocol</a><a href="#identity">Identity</a><a href="#status">Status</a></nav><button class="outline" id="connect">Connect wallet</button></header>
<section class="hero" id="top"><div class="eyebrow"><i></i> BNB SMART CHAIN · PROTOCOL PREVIEW</div><h1>The authority layer for<br><em>autonomous intelligence.</em></h1><p class="lead">Identity is not authority. Autonomy is not permission.</p><p class="sub">MANDAVEX binds an agent’s verified identity to a narrow, signed mandate—and checks that authority at the moment an action executes.</p><div class="actions"><a class="gold" href="#identity">Check my Agent ID <span>↗</span></a><a class="textlink" href="#protocol">Explore the protocol ↓</a></div><div class="heroFoot"><span>01&nbsp; VERIFY IDENTITY</span><span>02&nbsp; ENFORCE AUTHORITY</span><span>03&nbsp; PROVE EXECUTION</span></div></section>
<section class="statement" id="protocol"><div class="sectionLabel">THE PROTOCOL</div><div><h2>Permission that is<br>checked where it matters.</h2><p>A signed mandate defines who may act, on which operation, over what exact payload, and for how long. The guard verifies it at the execution boundary, consumes its nonce, and records the resulting state change on-chain.</p></div></section>
<section class="panel" id="identity"><div class="panelCopy"><div class="sectionLabel">01 / IDENTITY CHECK</div><h2>Start with the<br>connected agent.</h2><p>Read the official Agent ID registry directly on BNB Smart Chain. The registry confirms eligibility only; it does not imply trust or authorize an action.</p><div class="notice">Your address is read from your wallet and queried on-chain. MANDAVEX does not request names, login sessions, private keys, or QR pairing codes.</div></div><div class="card"><div class="cardTop"><span>AGENT ID REGISTRY</span><span class="live"><i></i> BSC · 56</span></div><div class="address" id="address">Connect a wallet you control</div><div class="registry">${REGISTRY}</div><button class="gold full" id="verify" disabled>Verify eligibility <span>→</span></button><div class="result" id="result" aria-live="polite">No read performed yet.</div></div></section>
<section class="metrics" id="status"><div><span class="sectionLabel">LIVE NETWORK DATA</span><p>Not yet available</p><small>MANDAVEX deployment and indexed activity are not live. We publish no invented adoption or transaction statistics.</small></div><div><span class="sectionLabel">PRODUCT STATUS</span><p>Runtime-tested prototype</p><small>The Guard lifecycle and rejection paths run in local EVM tests. A BSC fork confirms production-registry rejection for a non-holder. The prototype is not deployed or audited.</small></div><div><span class="sectionLabel">COMPETITION WINDOW</span><p>Closes 09 Dec 2026 · 08:00 UTC</p><small>Eligibility requires a live product and at least 30 distinct Agent ID addresses interacting with submitted contracts during the official period.</small></div></section>
<footer><span>MANDAVEX <b>·</b> BUILD FIRST. PROVE EVERYTHING.</span><span>Experimental software · No user assets held · Not audited</span><span>Preview build <code id="build-id">development</code></span></footer>`;

fetch(new URL('build-info.json', import.meta.url)).then((response) => {
  if (!response.ok) throw new Error('Build metadata unavailable');
  return response.json();
}).then((build) => {
  document.querySelector('#build-id').textContent = `${build.commit.slice(0, 7)} · ${build.builtAt}`;
}).catch(() => {});

const connectButton = document.querySelector('#connect');
const verifyButton = document.querySelector('#verify');
const status = document.querySelector('#result');
let account = '';
connectButton.addEventListener('click', async () => {
  status.textContent = '';
  if (!window.ethereum) { status.textContent = 'No browser wallet found. Use a wallet you control; never share a seed phrase or pairing code.'; return; }
  try {
    [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });
    connectButton.textContent = `${account.slice(0, 6)}…${account.slice(-4)}`;
    document.querySelector('#address').textContent = account;
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
