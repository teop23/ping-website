import { kvCardStore, titleFromTraits } from '../../_lib';

/**
 * A stored share card's details, for the /p/<id> showcase page.
 *
 * GET /api/card/<id> -> { "id", "title", "traits", "image" }
 *
 * Content-addressed like the card itself, so a hit never changes and can be
 * cached hard. A miss is not cached: the id may be stored a moment later.
 */

interface Env {
  PING_CARDS?: KVNamespace;
}

interface CardContext {
  env: Env;
  params: { id?: string | string[] };
}

const json = (body: unknown, status: number, cache: string): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': cache },
  });

export const onRequestGet = async ({ env, params }: CardContext): Promise<Response> => {
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  if (!env.PING_CARDS || !id) return json({ error: 'Not found' }, 404, 'no-store');

  const card = await kvCardStore(env.PING_CARDS).get(id);
  if (!card) return json({ error: 'Not found' }, 404, 'no-store');

  return json(
    {
      id,
      title: titleFromTraits(new URLSearchParams(card.traits)),
      traits: card.traits,
      image: `/api/image/p/${id}.png`,
      ...(card.message ? { message: card.message } : {}),
    },
    200,
    'public, max-age=31536000, immutable'
  );
};
