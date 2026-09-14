import { selectCardStore } from '../../../_lib';

/**
 * A stored share card, served as a static object.
 *
 * The route is [id] rather than [id].png because Pages matches a dynamic
 * segment whole - a partial-segment filename would not route. The trailing
 * .png is stripped here instead, so the URL can still end in an extension for
 * the benefit of scrapers and anyone reading the link.
 *
 * Unlike /api/image/custom.png this one is safe to cache hard, and should be:
 * the id is a hash of the trait selection, so the bytes behind a given URL can
 * never change. The no-store dance and the zone Cache Rule that endpoint needs
 * exist because its body comes from a render that can fail; this body was
 * rendered once, verified non-empty, and stored.
 *
 * Now that storage can be the owner's own box behind a tunnel, most reads
 * should never reach it: this explicitly puts hits into the zone's Cache API
 * (`caches.default`) alongside the immutable header, so a repeat scrape or
 * gallery thumbnail is served from the edge rather than round-tripping to
 * whatever is currently backing selectCardStore.
 */

interface Env {
  PING_CARDS?: KVNamespace;
  CARD_STORE_URL?: string;
  CARD_STORE_TOKEN?: string;
}

interface ImageContext {
  request: Request;
  env: Env;
  params: { id?: string | string[] };
  waitUntil: (promise: Promise<unknown>) => void;
}

export const onRequestGet = async ({ request, env, params, waitUntil }: ImageContext): Promise<Response> => {
  const raw = Array.isArray(params.id) ? params.id[0] : params.id;
  const id = raw?.replace(/\.png$/, '');
  const store = selectCardStore(env);
  if (!store || !id) return new Response('Not found', { status: 404 });

  // GET-only, no query string variance, and the response never changes for a
  // given id - a plain Request keyed on the URL is all the cache needs.
  const cache = caches.default;
  const cached = await cache.match(request);
  if (cached) return cached;

  const card = await store.get(id);
  if (!card) return new Response('Not found', { status: 404 });

  const response = new Response(card.body, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
  // Populating the edge cache is not on the critical path for this response.
  waitUntil(cache.put(request, response.clone()));
  return response;
};
