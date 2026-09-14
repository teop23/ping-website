import {
  MIN_CARD_BYTES,
  addToGallery,
  canonicalTraits,
  isValidPingMessage,
  selectCardStore,
  shareId,
  shareInput,
  validateTraits,
  type CardStore,
} from '../_lib';

/**
 * Creates a shareable PING.
 *
 * POST /api/share { "head": "cowboy-hat", "aura": "blue-aura", ... }
 *   -> { "id": "...", "url": "https://host/p/<id>" }
 *
 * The render happens HERE, inside a request a human made by clicking Tweet,
 * and the bytes are stored. By the time X's scraper arrives, /p/<id> serves a
 * stored object. That inversion is the whole feature: the scraper's request no
 * longer contains a render that can exhaust the isolate's CPU budget.
 *
 * Idempotent by construction - the id is a hash of the trait selection, so
 * re-sharing the same character is a read, and two people who build the same
 * character share one stored card.
 */

interface Env {
  PING_CARDS?: KVNamespace;
  CARD_STORE_URL?: string;
  CARD_STORE_TOKEN?: string;
  CARD_STORE_ACCESS_ID?: string;
  CARD_STORE_ACCESS_SECRET?: string;
}

interface ShareContext {
  request: Request;
  env: Env;
  waitUntil: (promise: Promise<unknown>) => void;
}

/** Best-effort: a gallery write failing must never fail the share. */
const recordInGallery = async (
  store: CardStore,
  id: string,
  traits: string,
  message?: string
): Promise<void> => {
  try {
    const entries = await store.getGallery();
    await store.putGallery(
      addToGallery(entries, { id, traits, at: Date.now(), ...(message ? { message } : {}) })
    );
  } catch {
    // Swallowed on purpose; see above.
  }
};

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });

export const onRequestPost = async ({ request, env, waitUntil }: ShareContext): Promise<Response> => {
  try {
    // No store configured (neither the remote box nor KV) is not an error
    // the user should see: the client falls back to the legacy query-param
    // share URL, which still works.
    const store = selectCardStore(env);
    if (!store) return json({ error: 'Card storage is not configured' }, 503);

    const origin = new URL(request.url).origin;
    const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
    if (!body || typeof body !== 'object') return json({ error: 'Expected a JSON object' }, 400);

    // "message" names a PING's message, not a trait category - it does not
    // go through the trait params below, or validateTraits would 400 it as
    // an unknown category.
    const params = new URLSearchParams();
    for (const [category, trait] of Object.entries(body)) {
      if (category === 'message') continue;
      if (typeof trait === 'string' && trait) params.set(category, trait);
    }

    // A PING's message: presets only (PING_MESSAGES, mirrored from
    // src/utils/pingCard.ts). Anything else - free text, a typo, an empty
    // string sent explicitly - is a 400, not a silently dropped field.
    const rawMessage = typeof body.message === 'string' ? body.message : undefined;
    if (rawMessage !== undefined && !isValidPingMessage(rawMessage)) {
      return json({ error: 'Invalid message' }, 400);
    }
    const message = rawMessage || undefined;

    const index: Record<string, string[]> = await fetch(new URL('/traits-index.json', request.url).href)
      .then((response) => response.json());

    const invalid = validateTraits(params, index);
    if (invalid) return json({ error: invalid }, 400);

    const canonical = canonicalTraits(params);
    // Message-less hashes exactly `canonical`, unchanged from before this
    // feature existed - see shareInput in _lib.ts.
    const id = await shareId(shareInput(canonical, message));

    const existing = await store.get(id);
    if (existing) return json({ id, url: `${origin}/p/${id}`, cached: true });

    // Render through the existing endpoint rather than a second copy of the
    // compositing JSX - one renderer, one place for it to be right. A
    // message routes to the notification layout; no message is today's
    // captioned banner, unchanged.
    const cardUrl = message
      ? `${origin}/api/image/custom.png?${canonical}${canonical ? '&' : ''}type=notification&message=${encodeURIComponent(message)}`
      : `${origin}/api/image/custom.png?${canonical}${canonical ? '&' : ''}type=banner&caption=1`;
    let card: ArrayBuffer | null = null;
    const failures: string[] = [];
    for (let attempt = 0; attempt < 2 && !card; attempt++) {
      const rendered = await fetch(cardUrl, { headers: { 'Cache-Control': 'no-cache' } });
      if (!rendered.ok) {
        failures.push(`status ${rendered.status}`);
        continue;
      }
      const bytes = await rendered.arrayBuffer();
      // The known failure mode is a 200 carrying nothing. Storing that would
      // make a broken card permanent, which is worse than not storing it.
      if (bytes.byteLength >= MIN_CARD_BYTES) card = bytes;
      else failures.push(`200 with ${bytes.byteLength} bytes`);
    }

    if (!card) {
      // "200 with 0 bytes" is the isolate running out of CPU mid-render; a
      // status code is something else. Visible in `wrangler pages deployment tail`.
      console.error(`share ${id}: card render failed (${failures.join('; ')}) for ${canonical}`);
      return json({ error: 'Card render failed' }, 502);
    }

    await store.put(id, card, canonical, message);
    // Only first-time (traits, message) pairs reach this line, so the
    // gallery gains one entry per distinct card, never per click.
    waitUntil(recordInGallery(store, id, canonical, message));
    return json({ id, url: `${origin}/p/${id}`, cached: false });
  } catch (err) {
    console.error('share failed:', err);
    return json({ error: 'Internal error' }, 500);
  }
};
