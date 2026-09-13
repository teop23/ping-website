import { GALLERY_KEY, galleryPage, parseGallery, titleFromTraits } from '../_lib';

/**
 * Newest shared characters, a page at a time.
 *
 * GET /api/gallery?offset=0
 *   -> { "items": [{ "id", "title", "image", "url", "at" }], "next": 24 | null }
 *
 * Reads one KV document (see GALLERY_KEY in _lib). The response is cached at
 * the edge for a minute so a busy Community page costs a handful of KV reads
 * rather than one per visitor.
 */

interface Env {
  PING_CARDS?: KVNamespace;
}

interface GalleryContext {
  request: Request;
  env: Env;
}

const CACHE_SECONDS = 60;

export const onRequestGet = async ({ request, env }: GalleryContext): Promise<Response> => {
  const url = new URL(request.url);
  const offset = Number(url.searchParams.get('offset') ?? 0);

  const entries = env.PING_CARDS
    ? parseGallery(await env.PING_CARDS.get(GALLERY_KEY, { type: 'json', cacheTtl: CACHE_SECONDS }))
    : [];
  const { items, next } = galleryPage(entries, offset);

  const body = {
    items: items.map((entry) => ({
      id: entry.id,
      title: titleFromTraits(new URLSearchParams(entry.traits)),
      image: `/api/image/p/${entry.id}.png`,
      url: `/p/${entry.id}`,
      at: entry.at,
    })),
    next,
  };

  return new Response(JSON.stringify(body), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': `public, max-age=${CACHE_SECONDS}`,
    },
  });
};
