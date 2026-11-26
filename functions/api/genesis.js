const REGISTRY = '0x60b9262456de011f7d15a54cdd8c48baaa8b022f';
const RATE_WINDOW_SECONDS = 600;
const RATE_LIMIT = 6;

function json(data, status = 200, request, env) {
  const headers = { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' };
  const origin = request?.headers.get('origin');
  if (origin && env?.GENESIS_ALLOWED_ORIGIN && origin === env.GENESIS_ALLOWED_ORIGIN) {
    headers['access-control-allow-origin'] = origin;
    headers.vary = 'Origin';
  }
  return new Response(JSON.stringify(data), { status, headers });
}

function normalizeWallet(value) {
  if (typeof value !== 'string' || !/^0x[0-9a-fA-F]{40}$/.test(value)) return null;
  return value.toLowerCase();
}

async function identityAtLatest(rpcUrl, wallet) {
  const call = async (method, params) => {
    const response = await fetch(rpcUrl, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }) });
    if (!response.ok) throw new Error('RPC unavailable');
    const data = await response.json();
    if (data.error || !data.result) throw new Error('RPC unavailable');
    return data.result;
  };
  const [chainHex, blockHex] = await Promise.all([call('eth_chainId', []), call('eth_blockNumber', [])]);
  if (BigInt(chainHex) !== 56n) throw new Error('Unexpected identity network');
  const data = `0x70a08231${wallet.slice(2).toLowerCase().padStart(64, '0')}`;
  const balance = await call('eth_call', [{ to: REGISTRY, data }, blockHex]);
  return { verified: BigInt(balance) > 0n, block: Number(BigInt(blockHex)) };
}

async function rateLimit(request, env) {
  if (!env.RATE_LIMIT_SALT || !env.DB) throw new Error('Service is not configured');
  const address = request.headers.get('cf-connecting-ip');
  if (!address) throw new Error('Request could not be rate limited');
  const bytes = new TextEncoder().encode(`${env.RATE_LIMIT_SALT}:${address}`);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  const key = [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
  const start = Math.floor(Date.now() / 1000 / RATE_WINDOW_SECONDS) * RATE_WINDOW_SECONDS;
  await env.DB.prepare(`INSERT INTO genesis_rate_limits(key, window_start, request_count) VALUES(?, ?, 1)
    ON CONFLICT(key, window_start) DO UPDATE SET request_count = request_count + 1`).bind(key, start).run();
  const row = await env.DB.prepare('SELECT request_count FROM genesis_rate_limits WHERE key = ? AND window_start = ?').bind(key, start).first();
  if (Number(row?.request_count) > RATE_LIMIT) return false;
  await env.DB.prepare('DELETE FROM genesis_rate_limits WHERE window_start < ?').bind(start - RATE_WINDOW_SECONDS * 3).run();
  return true;
}

export async function onRequestPost({ request, env }) {
  if (!env.DB || !env.RATE_LIMIT_SALT) return json({ status: 'BLOCKED', message: 'Shared registration is not configured.' }, 503, request, env);
  try {
    if (!(await rateLimit(request, env))) return json({ status: 'BLOCKED', message: 'Too many attempts. Try again later.' }, 429, request, env);
    const raw = await request.text();
    if (new TextEncoder().encode(raw).byteLength > 4096) return json({ status: 'INVALID', message: 'Registration details are too large.' }, 413, request, env);
    let input;
    try { input = JSON.parse(raw); } catch { return json({ status: 'INVALID', message: 'Registration details must be valid JSON.' }, 400, request, env); }
    if (!input || !['community', 'agent'].includes(input.program)) return json({ status: 'INVALID', message: 'Choose a supported registration program.' }, 400, request, env);
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    let wallet = null;
    let normalizedWallet = null;
    let handle = null;
    let normalizedHandle = null;
    let identityStatus = 'not_applicable';
    let identityBlock = null;
    let reviewStatus = 'pending_review';

    if (input.program === 'community') {
      if (input.handle !== undefined && input.handle !== null && input.handle !== '') {
        if (typeof input.handle !== 'string' || !/^@?[A-Za-z0-9_]{1,15}$/.test(input.handle)) return json({ status: 'INVALID', message: 'Enter a public X handle with up to 15 letters, numbers, or underscores.' }, 400, request, env);
        handle = input.handle.replace(/^@/, '');
        normalizedHandle = handle.toLowerCase();
      }
    } else {
      normalizedWallet = normalizeWallet(input.wallet);
      if (!normalizedWallet) return json({ status: 'INVALID', message: 'Enter a valid public wallet address. Never provide a private key or seed phrase.' }, 400, request, env);
      wallet = `0x${normalizedWallet.slice(2)}`;
      try {
        const result = await identityAtLatest(env.BSC_RPC_URL || 'https://bsc-dataseed.binance.org', wallet);
        identityStatus = result.verified ? 'verified_at_registration' : 'not_verified_at_registration';
        identityBlock = result.block;
        reviewStatus = result.verified ? 'pending_review' : 'identity_not_verified';
      } catch {
        identityStatus = 'unknown';
      }
    }

    try {
      await env.DB.prepare(`INSERT INTO genesis_registrations
        (id, program, wallet_address, normalized_wallet, x_handle, normalized_handle, identity_status, identity_block, review_status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
        .bind(id, input.program, wallet, normalizedWallet, handle, normalizedHandle, identityStatus, identityBlock, reviewStatus, createdAt).run();
    } catch (error) {
      if (/unique/i.test(error.message || '')) return json({ status: 'DUPLICATE', message: 'This wallet or public handle already has a registration for this program.' }, 409, request, env);
      throw error;
    }
    return json({ status: 'REGISTERED', registrationId: id, program: input.program, createdAt, reviewStatus, identityStatus, identityBlock, priorityAccess: 'pending eligibility review', credential: 'not issued; future readiness only' }, 201, request, env);
  } catch {
    return json({ status: 'BLOCKED', message: 'Registration could not be completed. No success was recorded.' }, 503, request, env);
  }
}

export function onRequestOptions({ request, env }) {
  const origin = request.headers.get('origin');
  if (!origin || origin !== env.GENESIS_ALLOWED_ORIGIN) return new Response(null, { status: 403, headers: { 'cache-control': 'no-store' } });
  return new Response(null, { status: 204, headers: {
    'access-control-allow-origin': origin,
    'access-control-allow-methods': 'GET, POST, OPTIONS',
    'access-control-allow-headers': 'content-type',
    'access-control-max-age': '600',
    'cache-control': 'no-store',
    vary: 'Origin',
  } });
}

export async function onRequestGet({ request, env }) {
  if (!env.DB) return json({ status: 'BLOCKED', message: 'Shared registration is not configured.' }, 503, request, env);
  const id = new URL(request.url).searchParams.get('id') || '';
  if (!/^[0-9a-f-]{36}$/i.test(id)) return json({ status: 'INVALID', message: 'A valid registration reference is required.' }, 400, request, env);
  try {
    const row = await env.DB.prepare('SELECT id, program, wallet_address, x_handle, identity_status, identity_block, review_status, created_at FROM genesis_registrations WHERE id = ?').bind(id).first();
    if (!row) return json({ status: 'NOT_FOUND' }, 404, request, env);
    return json({ status: 'REGISTERED', registration: row }, 200, request, env);
  } catch {
    return json({ status: 'BLOCKED', message: 'Registration status is temporarily unavailable.' }, 503, request, env);
  }
}
