import { BOT_USER_AGENT, renderOgPage } from '../../../_lib';

interface OgContext {
  request: Request;
  params: Record<string, string | string[]>;
}

export async function onRequest(context: OgContext) {
  const url = new URL(context.request.url);
  const SITE_URL = url.origin;
  const raw = context.params.handle;
  const handle = (Array.isArray(raw) ? raw[0] : raw) || '';

  if (!handle) {
    return new Response('Missing X (Twitter) handle', { status: 400 });
  }

  // Handles are [A-Za-z0-9_], max 15. Rejecting anything else keeps junk out of
  // the upstream lookup and out of the markup.
  if (!/^[A-Za-z0-9_]{1,15}$/.test(handle)) {
    return new Response('Invalid X (Twitter) handle', { status: 400 });
  }

  const imageUrl = `${SITE_URL}/api/image/shirt_by_x.png?handle=${encodeURIComponent(handle)}&type=banner`;

  const userAgent = context.request.headers.get('user-agent') || '';
  if (!BOT_USER_AGENT.test(userAgent)) {
    return Response.redirect(SITE_URL, 302);
  }

  return renderOgPage({
    imageUrl,
    pageUrl: url.href,
    title: `@${handle} is wearing the PING tee`,
    description: 'Put your own profile picture on a PING at pingonsol.com',
  });
}
