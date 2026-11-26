const test = require('node:test');
const assert = require('node:assert/strict');

let api;
test('Genesis Pages handlers load', async () => { api = await import('../functions/api/genesis.js'); });

class MockD1 {
  constructor() { this.registrations = new Map(); this.requests = new Map(); this.rateKey = null; this.failStatus = false; this.failInsert = false; }
  prepare(sql) {
    return { bind: (...values) => ({
      run: async () => {
        if (sql.includes('genesis_rate_limits')) {
          const [key, start] = values; this.rateKey = key;
          const mapKey = `${key}:${start}`; this.requests.set(mapKey, (this.requests.get(mapKey) || 0) + 1);
          return {};
        }
        if (sql.includes('INSERT INTO genesis_registrations')) {
          if (this.failInsert) throw new Error('D1 unavailable');
          const [id, program, wallet, normalizedWallet, handle, normalizedHandle, identityStatus, identityBlock, reviewStatus, createdAt] = values;
          const duplicate = [...this.registrations.values()].some((row) => row.program === program &&
            ((normalizedWallet && row.normalized_wallet === normalizedWallet) || (normalizedHandle && row.normalized_handle === normalizedHandle)));
          if (duplicate) throw new Error('UNIQUE constraint failed');
          this.registrations.set(id, { id, program, wallet_address: wallet, normalized_wallet: normalizedWallet, x_handle: handle, normalized_handle: normalizedHandle, identity_status: identityStatus, identity_block: identityBlock, review_status: reviewStatus, created_at: createdAt });
          return {};
        }
        return {};
      },
      first: async () => {
        if (sql.includes('SELECT request_count')) return { request_count: this.requests.get(`${values[0]}:${values[1]}`) || 0 };
        if (sql.includes('SELECT id, program')) {
          if (this.failStatus) throw new Error('D1 unavailable');
          const row = this.registrations.get(values[0]);
          if (!row) return null;
          const { normalized_wallet, normalized_handle, ...publicRow } = row;
          return publicRow;
        }
        return null;
      },
    }) };
  }
}

function env(DB = new MockD1()) { return { DB, RATE_LIMIT_SALT: 'test-only-salt', GENESIS_ALLOWED_ORIGIN: 'https://mandavex.github.io' }; }
function request(body, { ip = '203.0.113.7' } = {}) {
  return new Request('https://example.test/api/genesis', { method: 'POST', headers: { 'content-type': 'application/json', 'cf-connecting-ip': ip }, body: JSON.stringify(body) });
}

test('Genesis fails closed when shared database or rate limit configuration is absent', async () => {
  const unavailable = await api.onRequestPost({ request: request({ program: 'community' }), env: {} });
  assert.equal(unavailable.status, 503);
  assert.equal((await unavailable.json()).status, 'BLOCKED');
  const noIp = await api.onRequestPost({ request: new Request('https://example.test/api/genesis', { method: 'POST', body: '{"program":"community"}' }), env: env() });
  assert.equal(noIp.status, 503);
});

test('Genesis CORS allows only the production website and serves its JSON preflight', async () => {
  const bindings = env();
  const allowed = await api.onRequestOptions({ request: new Request('https://api.example.test/api/genesis', { method: 'OPTIONS', headers: { origin: 'https://mandavex.github.io', 'access-control-request-method': 'POST', 'access-control-request-headers': 'content-type' } }), env: bindings });
  assert.equal(allowed.status, 204);
  assert.equal(allowed.headers.get('access-control-allow-origin'), 'https://mandavex.github.io');
  assert.match(allowed.headers.get('access-control-allow-methods'), /POST/);

  const denied = await api.onRequestOptions({ request: new Request('https://api.example.test/api/genesis', { method: 'OPTIONS', headers: { origin: 'https://attacker.example' } }), env: bindings });
  assert.equal(denied.status, 403);
  assert.equal(denied.headers.get('access-control-allow-origin'), null);

  const response = await api.onRequestPost({ request: new Request('https://api.example.test/api/genesis', { method: 'POST', headers: { origin: 'https://mandavex.github.io', 'content-type': 'application/json', 'cf-connecting-ip': '203.0.113.7' }, body: '{"program":"community"}' }), env: bindings });
  assert.equal(response.headers.get('access-control-allow-origin'), 'https://mandavex.github.io');
});

test('Genesis reports malformed JSON and D1 read/write failures without claiming success', async () => {
  const bindings = env();
  const malformed = await api.onRequestPost({ request: new Request('https://example.test/api/genesis', { method: 'POST', headers: { 'cf-connecting-ip': '203.0.113.8' }, body: '{' }), env: bindings });
  assert.equal(malformed.status, 400);
  assert.equal((await malformed.json()).status, 'INVALID');

  bindings.DB.failInsert = true;
  const insertFailure = await api.onRequestPost({ request: request({ program: 'community' }), env: bindings });
  assert.equal(insertFailure.status, 503);
  assert.equal((await insertFailure.json()).status, 'BLOCKED');

  bindings.DB.failStatus = true;
  const statusFailure = await api.onRequestGet({ request: new Request('https://example.test/api/genesis?id=123e4567-e89b-12d3-a456-426614174000'), env: bindings });
  assert.equal(statusFailure.status, 503);
  assert.equal((await statusFailure.json()).status, 'BLOCKED');
});

test('Genesis validates inputs, enforces duplicates, and exposes only the public status fields', async () => {
  const bindings = env();
  const invalid = await api.onRequestPost({ request: request({ program: 'unknown' }), env: bindings });
  assert.equal(invalid.status, 400);
  const unsafe = await api.onRequestPost({ request: request({ program: 'agent', wallet: 'seed phrase' }), env: bindings });
  assert.equal(unsafe.status, 400);
  const first = await api.onRequestPost({ request: request({ program: 'community', handle: '@Example_1' }), env: bindings });
  assert.equal(first.status, 201);
  const created = await first.json();
  assert.equal(created.status, 'REGISTERED');
  const duplicate = await api.onRequestPost({ request: request({ program: 'community', handle: '@example_1' }), env: bindings });
  assert.equal(duplicate.status, 409);
  const status = await api.onRequestGet({ request: new Request(`https://example.test/api/genesis?id=${created.registrationId}`), env: bindings });
  const result = await status.json();
  assert.equal(status.status, 200);
  assert.equal(result.registration.x_handle, 'Example_1');
  assert.equal(Object.hasOwn(result.registration, 'normalized_handle'), false);
  const hashedRateKey = [...bindings.DB.requests.keys()][0].split(':')[0];
  assert.equal(hashedRateKey.length, 64);
  assert.equal(hashedRateKey.includes('203.0.113.7'), false);
});

test('Genesis rate limits after six requests in a ten minute window', async () => {
  const bindings = env();
  const results = [];
  for (let i = 0; i < 7; i++) results.push(await api.onRequestPost({ request: request({ program: 'community' }), env: bindings }));
  assert.deepEqual(results.map((item) => item.status), [201, 201, 201, 201, 201, 201, 429]);
});

test('Agent registration records identity at a block-pinned BNB lookup and degrades honestly on RPC failure', async (t) => {
  const realFetch = globalThis.fetch;
  globalThis.fetch = async (_url, options) => {
    const { method } = JSON.parse(options.body);
    const result = method === 'eth_chainId' ? '0x38' : method === 'eth_blockNumber' ? '0x64' : `0x${'00'.repeat(31)}01`;
    return new Response(JSON.stringify({ jsonrpc: '2.0', id: 1, result }), { status: 200, headers: { 'content-type': 'application/json' } });
  };
  try {
    const bindings = env();
    const registered = await api.onRequestPost({ request: request({ program: 'agent', wallet: '0x0000000000000000000000000000000000000001' }), env: bindings });
    const data = await registered.json();
    assert.equal(data.identityStatus, 'verified_at_registration');
    assert.equal(data.identityBlock, 100);
    assert.equal(data.reviewStatus, 'pending_review');
  } finally { globalThis.fetch = realFetch; }

  globalThis.fetch = async () => { throw new Error('RPC unavailable'); };
  try {
    const failed = await api.onRequestPost({ request: request({ program: 'agent', wallet: '0x0000000000000000000000000000000000000002' }), env: env() });
    const data = await failed.json();
    assert.equal(failed.status, 201);
    assert.equal(data.identityStatus, 'unknown');
    assert.equal(data.reviewStatus, 'pending_review');
  } finally { globalThis.fetch = realFetch; }
});
