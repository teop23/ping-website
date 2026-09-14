// Self-hosted card storage for PING share cards.
//
// Runs on the owner's own machine (Docker), reached by Cloudflare Pages
// Functions through a Cloudflare Tunnel. Zero external dependencies on
// purpose - this is a small trusted service behind a tunnel, not a public
// API, and every extra dependency is one more thing to patch on a machine
// nobody watches daily.
//
// Endpoints:
//   GET  /healthz                    -> 200 "ok", no auth (Docker healthcheck)
//   PUT  /cards/:id                  -> store a card PNG (auth required)
//   GET  /cards/:id                  -> fetch a card PNG (auth required)
//   HEAD /cards/:id                  -> existence check, no body (auth required)
//   GET  /gallery                    -> the gallery document as JSON (auth required)
//   PUT  /gallery                    -> replace the gallery document (auth required)
//
// Auth: every route but /healthz requires `Authorization: Bearer <token>`,
// compared in constant time against AUTH_TOKEN. Reads are gated too, even
// though the only client is Cloudflare Functions - the tunnel hostname is
// otherwise just another PNG server on the internet.

import http from 'node:http';
import crypto from 'node:crypto';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';

const PORT = Number(process.env.PORT || 8787);
const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), 'data');
const CARDS_DIR = path.join(DATA_DIR, 'cards');
const GALLERY_FILE = path.join(DATA_DIR, 'gallery.json');
const AUTH_TOKEN = process.env.AUTH_TOKEN || '';

/** Largest card this service will accept. A real card is 55-135 KB. */
const MAX_CARD_BYTES = 2 * 1024 * 1024;
/** Largest gallery document. ~480 entries of {id,traits,at} is well under 200 KB. */
const MAX_GALLERY_BYTES = 2 * 1024 * 1024;

/** Same shape as the id shareId() produces in functions/_lib.ts: 12 base36 chars.
 *  Validated strictly so nothing resembling a path segment reaches fs.* calls. */
const ID_PATTERN = /^[0-9a-z]{1,32}$/;

fs.mkdirSync(CARDS_DIR, { recursive: true });

/** Constant-time compare that also hides length differences (hash first, then
 *  timingSafeEqual, which itself requires equal-length buffers). */
const safeEqual = (a, b) => {
  const ah = crypto.createHash('sha256').update(a).digest();
  const bh = crypto.createHash('sha256').update(b).digest();
  return crypto.timingSafeEqual(ah, bh);
};

const isAuthorized = (req) => {
  if (!AUTH_TOKEN) return false; // refuse to run authless by accident
  const header = req.headers['authorization'] || '';
  const match = /^Bearer (.+)$/.exec(header);
  if (!match) return false;
  return safeEqual(match[1], AUTH_TOKEN);
};

const send = (res, status, body, headers = {}) => {
  res.writeHead(status, headers);
  res.end(body);
};

const sendJson = (res, status, obj) =>
  send(res, status, JSON.stringify(obj), { 'Content-Type': 'application/json' });

/** Reads the request body, refusing anything over `limit` bytes. */
const readBody = (req, limit) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    let total = 0;
    req.on('data', (chunk) => {
      total += chunk.length;
      if (total > limit) {
        reject(Object.assign(new Error('payload too large'), { code: 'TOO_LARGE' }));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });

const cardPaths = (id) => ({
  png: path.join(CARDS_DIR, `${id}.png`),
  meta: path.join(CARDS_DIR, `${id}.json`),
});

const handlePutCard = async (req, res, id) => {
  if (!ID_PATTERN.test(id)) return sendJson(res, 400, { error: 'invalid id' });

  const contentType = (req.headers['content-type'] || '').split(';')[0].trim().toLowerCase();
  if (contentType !== 'image/png') return sendJson(res, 400, { error: 'expected image/png' });

  let body;
  try {
    body = await readBody(req, MAX_CARD_BYTES);
  } catch (err) {
    if (err.code === 'TOO_LARGE') return sendJson(res, 413, { error: 'card too large' });
    return sendJson(res, 400, { error: 'failed to read body' });
  }
  if (body.length === 0) return sendJson(res, 400, { error: 'empty body' });

  const traits = req.headers['x-ping-traits'] ? decodeURIComponent(req.headers['x-ping-traits']) : '';
  const { png, meta } = cardPaths(id);

  await fsp.writeFile(png, body);
  await fsp.writeFile(meta, JSON.stringify({ traits, createdAt: Date.now() }));
  return sendJson(res, 200, { id, bytes: body.length });
};

const handleGetCard = async (req, res, id, headOnly) => {
  if (!ID_PATTERN.test(id)) return sendJson(res, 400, { error: 'invalid id' });
  const { png, meta } = cardPaths(id);

  let bytes;
  try {
    bytes = await fsp.readFile(png);
  } catch {
    return sendJson(res, 404, { error: 'not found' });
  }

  let traits = '';
  try {
    traits = JSON.parse(await fsp.readFile(meta, 'utf8')).traits ?? '';
  } catch {
    // Metadata missing or corrupt: still serve the image, just without traits.
  }

  const headers = {
    'Content-Type': 'image/png',
    'Content-Length': String(bytes.length),
    'X-Ping-Traits': encodeURIComponent(traits),
  };
  if (headOnly) return send(res, 200, null, headers);
  return send(res, 200, bytes, headers);
};

const handleGetGallery = async (_req, res) => {
  try {
    const raw = await fsp.readFile(GALLERY_FILE, 'utf8');
    return send(res, 200, raw, { 'Content-Type': 'application/json' });
  } catch {
    return send(res, 200, '[]', { 'Content-Type': 'application/json' });
  }
};

const handlePutGallery = async (req, res) => {
  let body;
  try {
    body = await readBody(req, MAX_GALLERY_BYTES);
  } catch (err) {
    if (err.code === 'TOO_LARGE') return sendJson(res, 413, { error: 'gallery too large' });
    return sendJson(res, 400, { error: 'failed to read body' });
  }

  let parsed;
  try {
    parsed = JSON.parse(body.toString('utf8'));
  } catch {
    return sendJson(res, 400, { error: 'invalid json' });
  }
  if (!Array.isArray(parsed)) return sendJson(res, 400, { error: 'expected a json array' });

  await fsp.writeFile(GALLERY_FILE, JSON.stringify(parsed));
  return sendJson(res, 200, { count: parsed.length });
};

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url || '/', 'http://localhost');
    const method = req.method || 'GET';

    if (method === 'GET' && url.pathname === '/healthz') {
      return send(res, 200, 'ok', { 'Content-Type': 'text/plain' });
    }

    if (!isAuthorized(req)) return sendJson(res, 401, { error: 'unauthorized' });

    const cardMatch = /^\/cards\/([^/]+)$/.exec(url.pathname);
    if (cardMatch) {
      const id = decodeURIComponent(cardMatch[1]);
      if (method === 'PUT') return await handlePutCard(req, res, id);
      if (method === 'GET') return await handleGetCard(req, res, id, false);
      if (method === 'HEAD') return await handleGetCard(req, res, id, true);
      return sendJson(res, 405, { error: 'method not allowed' });
    }

    if (url.pathname === '/gallery') {
      if (method === 'GET') return await handleGetGallery(req, res);
      if (method === 'PUT') return await handlePutGallery(req, res);
      return sendJson(res, 405, { error: 'method not allowed' });
    }

    return sendJson(res, 404, { error: 'not found' });
  } catch (err) {
    console.error('storage service error:', err);
    return sendJson(res, 500, { error: 'internal error' });
  }
});

// A slow or stalled client (or one that never finishes sending headers)
// would otherwise hold a connection open indefinitely - this is a small
// trusted service, but it's still reachable from the internet through the
// tunnel, so bound both.
server.requestTimeout = 15_000;
server.headersTimeout = 10_000;

// Only listen when run directly, so the test file can import the server
// without binding a port.
if (import.meta.url === `file://${process.argv[1]?.replace(/\\/g, '/')}` || import.meta.url === `file://${process.argv[1]}`) {
  server.listen(PORT, () => {
    console.log(`ping card storage listening on :${PORT}, data dir ${DATA_DIR}`);
    if (!AUTH_TOKEN) console.error('WARNING: AUTH_TOKEN is not set - every request will be refused');
  });
}

export { server, safeEqual, ID_PATTERN };
