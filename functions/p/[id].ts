import { BOT_USER_AGENT, selectCardStore, renderOgPage, titleFromTraits } from '../_lib';

/**
 * The share link itself: buildaping.com/p/<id>.
 *
 * Same bot/human split as /api/og, but the card image is a stored object
 * rather than a live render, and the trait selection comes from what was
 * stored at share time instead of from the URL. A person gets the showcase
 * page for that character (src/pages/Showcase.tsx).
 */

interface Env {
  ASSETS: Fetcher;
  PING_CARDS?: KVNamespace;
  CARD_STORE_URL?: string;
  CARD_STORE_TOKEN?: string;
}

interface PageContext {
  request: Request;
  env: Env;
  params: { id?: string | string[] };
}

export const onRequestGet = async ({ request, env, params }: PageContext): Promise<Response> => {
  const url = new URL(request.url);
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const store = selectCardStore(env);
  const card = store && id ? await store.get(id) : null;
  // An unknown id is a link to a character nobody stored - send the person to
  // the builder rather than showing them a 404 they can do nothing with.
  if (!card) return Response.redirect(url.origin, 302);

  const traits = new URLSearchParams(card.traits);

  // A person gets the showcase page: the app shell, whose /p/:id route loads
  // the card from /api/card/<id>. It used to redirect to the home page, which
  // opened on the hero with the character somewhere below the fold.
  if (!BOT_USER_AGENT.test(request.headers.get('user-agent') || '')) {
    return env.ASSETS.fetch(new URL('/', url.origin));
  }

  return renderOgPage({
    imageUrl: `${url.origin}/api/image/p/${id}.png`,
    pageUrl: url.href,
    title: titleFromTraits(traits),
    description: `Send one back at ${url.host}`,
  });
};
