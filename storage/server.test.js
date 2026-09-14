import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

// DATA_DIR and AUTH_TOKEN must be set before server.js is imported: it reads
// them at module load time and creates the cards dir immediately.
const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ping-card-storage-test-'));
process.env.DATA_DIR = dataDir;
process.env.AUTH_TOKEN = 'test-token';

const { server, safeEqual, ID_PATTERN } = await import('./server.js');

let baseUrl;

before(async () => {
  await new Promise((resolve) => server.listen(0, resolve));
  const { port } = server.address();
  baseUrl = `http://127.0.0.1:${port}`;
});

after(async () => {
  await new Promise((resolve) => server.close(resolve));
  fs.rmSync(dataDir, { recursive: true, force: true });
});

const png = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10, 1, 2, 3, 4]);
const auth = { Authorization: 'Bearer test-token' };

test('safeEqual is true for equal strings and false otherwise', () => {
  assert.equal(safeEqual('abc', 'abc'), true);
  assert.equal(safeEqual('abc', 'abd'), false);
  assert.equal(safeEqual('abc', 'ab'), false);
  assert.equal(safeEqual('', ''), true);
});

test('ID_PATTERN accepts a shareId-shaped id and rejects path traversal', () => {
  assert.equal(ID_PATTERN.test('a1b2c3d4e5f6'), true);
  assert.equal(ID_PATTERN.test('../etc/passwd'), false);
  assert.equal(ID_PATTERN.test('id/with/slash'), false);
  assert.equal(ID_PATTERN.test(''), false);
});

test('GET /healthz needs no auth', async () => {
  const res = await fetch(`${baseUrl}/healthz`);
  assert.equal(res.status, 200);
  assert.equal(await res.text(), 'ok');
});

test('every other route refuses a missing or wrong bearer token', async () => {
  const noAuth = await fetch(`${baseUrl}/cards/abc123def456`);
  assert.equal(noAuth.status, 401);

  const wrongAuth = await fetch(`${baseUrl}/cards/abc123def456`, {
    headers: { Authorization: 'Bearer nope' },
  });
  assert.equal(wrongAuth.status, 401);

  const gallery = await fetch(`${baseUrl}/gallery`);
  assert.equal(gallery.status, 401);
});

test('PUT then GET round-trips a card and its traits', async () => {
  const id = 'roundtrip001';
  const put = await fetch(`${baseUrl}/cards/${id}`, {
    method: 'PUT',
    headers: { ...auth, 'Content-Type': 'image/png', 'X-Ping-Traits': encodeURIComponent('head=crown') },
    body: png,
  });
  assert.equal(put.status, 200);

  const get = await fetch(`${baseUrl}/cards/${id}`, { headers: auth });
  assert.equal(get.status, 200);
  assert.equal(get.headers.get('content-type'), 'image/png');
  assert.equal(decodeURIComponent(get.headers.get('x-ping-traits')), 'head=crown');
  const body = Buffer.from(await get.arrayBuffer());
  assert.deepEqual(body, png);
});

test('HEAD reports existence without a body', async () => {
  const id = 'headcheck001';
  await fetch(`${baseUrl}/cards/${id}`, {
    method: 'PUT',
    headers: { ...auth, 'Content-Type': 'image/png' },
    body: png,
  });

  const hit = await fetch(`${baseUrl}/cards/${id}`, { method: 'HEAD', headers: auth });
  assert.equal(hit.status, 200);

  const miss = await fetch(`${baseUrl}/cards/doesnotexist1`, { method: 'HEAD', headers: auth });
  assert.equal(miss.status, 404);
});

test('GET on an unknown card is a 404', async () => {
  const res = await fetch(`${baseUrl}/cards/unknowncard1`, { headers: auth });
  assert.equal(res.status, 404);
});

test('rejects a body that is not image/png', async () => {
  const res = await fetch(`${baseUrl}/cards/notpng000001`, {
    method: 'PUT',
    headers: { ...auth, 'Content-Type': 'text/plain' },
    body: 'hello',
  });
  assert.equal(res.status, 400);
});

test('rejects an id shaped like a path', async () => {
  const res = await fetch(`${baseUrl}/cards/${encodeURIComponent('../evil')}`, {
    method: 'PUT',
    headers: { ...auth, 'Content-Type': 'image/png' },
    body: png,
  });
  assert.equal(res.status, 400);
});

test('gallery round-trips a JSON document', async () => {
  const empty = await fetch(`${baseUrl}/gallery`, { headers: auth });
  assert.equal(empty.status, 200);
  assert.deepEqual(await empty.json(), []);

  const entries = [{ id: 'a', traits: 'head=crown', at: 1 }];
  const put = await fetch(`${baseUrl}/gallery`, {
    method: 'PUT',
    headers: { ...auth, 'Content-Type': 'application/json' },
    body: JSON.stringify(entries),
  });
  assert.equal(put.status, 200);

  const get = await fetch(`${baseUrl}/gallery`, { headers: auth });
  assert.deepEqual(await get.json(), entries);
});

test('gallery PUT refuses a non-array body', async () => {
  const res = await fetch(`${baseUrl}/gallery`, {
    method: 'PUT',
    headers: { ...auth, 'Content-Type': 'application/json' },
    body: JSON.stringify({ not: 'an array' }),
  });
  assert.equal(res.status, 400);
});

test('server enforces request and headers timeouts, not just the app-level MAX_* caps', () => {
  // A slow/stalled client on a tunnel-reachable service should not hold a
  // connection open forever. Asserted on the config rather than by actually
  // stalling a socket for 15s in a unit test.
  assert.ok(server.requestTimeout > 0 && server.requestTimeout <= 30_000);
  assert.ok(server.headersTimeout > 0 && server.headersTimeout <= server.requestTimeout);
});
