import {
  MIN_CARD_BYTES,
  canonicalTraits,
  kvCardStore,
  shareId,
  validateTraits,
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
}

interface ShareContext {
  request: Request;
  env: Env;
}

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });

export const onRequestPost = async ({ request, env }: ShareContext): Promise<Response> => {
  try {
    // Absent binding is not an error the user should see: the client falls
    // back to the legacy query-param share URL, which still works.
    if (!env.PING_CARDS) return json({ error: 'Card storage is not configured' }, 503);

    const origin = new URL(request.url).origin;
    const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
    if (!body || typeof body !== 'object') return json({ error: 'Expected a JSON object' }, 400);

    const params = new URLSearchParams();
    for (const [category, trait] of Object.entries(body)) {
      if (typeof trait === 'string' && trait) params.set(category, trait);
    }

    const index: Record<string, string[]> = await fetch(new URL('/traits-index.json', request.url).href)
      .then((response) => response.json());

    const invalid = validateTraits(params, index);
    if (invalid) return json({ error: invalid }, 400);

    const canonical = canonicalTraits(params);
    const id = await shareId(canonical);
    const store = kvCardStore(env.PING_CARDS);

    const existing = await store.get(id);
    if (existing) return json({ id, url: `${origin}/p/${id}`, cached: true });

    // Render through the existing endpoint rather than a second copy of the
    // compositing JSX - one renderer, one place for it to be right.
    const cardUrl = `${origin}/api/image/custom.png?${canonical}${canonical ? '&' : ''}type=banner`;
    let card: ArrayBuffer | null = null;
    for (let attempt = 0; attempt < 2 && !card; attempt++) {
      const rendered = await fetch(cardUrl, { headers: { 'Cache-Control': 'no-cache' } });
      if (!rendered.ok) continue;
      const bytes = await rendered.arrayBuffer();
      // The known failure mode is a 200 carrying nothing. Storing that would
      // make a broken card permanent, which is worse than not storing it.
      if (bytes.byteLength >= MIN_CARD_BYTES) card = bytes;
    }

    if (!card) return json({ error: 'Card render failed' }, 502);

    await store.put(id, card, canonical);
    return json({ id, url: `${origin}/p/${id}`, cached: false });
  } catch (err) {
    return json({ error: `Internal error: ${err}` }, 500);
  }
};
