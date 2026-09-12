import { kvCardStore } from '../../../_lib';

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
 */

interface Env {
  PING_CARDS?: KVNamespace;
}

interface ImageContext {
  env: Env;
  params: { id?: string | string[] };
}

export const onRequestGet = async ({ env, params }: ImageContext): Promise<Response> => {
  const raw = Array.isArray(params.id) ? params.id[0] : params.id;
  const id = raw?.replace(/\.png$/, '');
  if (!env.PING_CARDS || !id) return new Response('Not found', { status: 404 });

  const card = await kvCardStore(env.PING_CARDS).get(id);
  if (!card) return new Response('Not found', { status: 404 });

  return new Response(card.body, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
