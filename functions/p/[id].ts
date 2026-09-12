import { BOT_USER_AGENT, kvCardStore, renderOgPage, titleFromTraits } from '../_lib';

/**
 * The share link itself: buildaping.com/p/<id>.
 *
 * Same bot/human split as /api/og, but the card image is a stored object
 * rather than a live render, and the trait selection comes from what was
 * stored at share time instead of from the URL. A human still lands on the
 * builder with that exact character loaded.
 */

interface Env {
  PING_CARDS?: KVNamespace;
}

interface PageContext {
  request: Request;
  env: Env;
  params: { id?: string | string[] };
}

export const onRequestGet = async ({ request, env, params }: PageContext): Promise<Response> => {
  const url = new URL(request.url);
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const card = env.PING_CARDS && id ? await kvCardStore(env.PING_CARDS).get(id) : null;
  // An unknown id is a link to a character nobody stored - send the person to
  // the builder rather than showing them a 404 they can do nothing with.
  if (!card) return Response.redirect(url.origin, 302);

  const traits = new URLSearchParams(card.traits);

  if (!BOT_USER_AGENT.test(request.headers.get('user-agent') || '')) {
    const search = card.traits ? `?${card.traits}` : '';
    return Response.redirect(`${url.origin}/${search}`, 302);
  }

  return renderOgPage({
    imageUrl: `${url.origin}/api/image/p/${id}.png`,
    pageUrl: url.href,
    title: titleFromTraits(traits),
    description: `Build your own PING at ${url.host}`,
  });
};
