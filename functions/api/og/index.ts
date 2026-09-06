import { BOT_USER_AGENT, renderOgPage, titleFromTraits } from '../../_lib';

interface OgContext {
  request: Request;
  params: Record<string, string | string[]>;
}

export async function onRequest(context: OgContext) {
  const url = new URL(context.request.url);
  const SITE_URL = url.origin;

  // url.search is '' when no traits are picked, which used to produce
  // 'custom.png&type=banner' with no '?' at all and a broken card.
  const imageParams = new URLSearchParams(url.searchParams);
  imageParams.set('type', 'banner');
  const imageUrl = `${SITE_URL}/api/image/custom.png?${imageParams.toString()}`;

  const userAgent = context.request.headers.get('user-agent') || '';
  if (!BOT_USER_AGENT.test(userAgent)) {
    // Keep the trait params so a human following the link lands on the same
    // character the card showed them, instead of an empty builder.
    return Response.redirect(`${SITE_URL}/${url.search}`, 302);
  }

  return renderOgPage({
    imageUrl,
    pageUrl: url.href,
    title: titleFromTraits(url.searchParams),
    description: 'Build your own PING at pingonsol.com',
  });
}
