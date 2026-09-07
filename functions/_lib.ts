// Shared helpers for the Pages Functions. Files prefixed with _ are not routed.

/**
 * Backgrounds for generated character images.
 *
 * These were ten neon colours left over from the Solana site, none of which
 * belonged to the palette. A shared card is usually the first thing anyone
 * sees of the project, so it now draws from the same tints the site does.
 */
const BG_COLORS = [
  '#F3F1EA',
  '#CCFF00',
];

/** Palette for the site's own share card, mirroring the theme it ships with. */
export const OG_THEME = {
  background: '#F3F1EA',
  ink: '#111C16',
  accent: '#CCFF00',
  accentInk: '#111C16',
};

// FNV-1a. Small, fast, and gives the same number for the same string every time.
export const hashString = (input: string): number => {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
};

// Pick a background from a seed rather than Math.random(). A share URL has to
// render the same image on every scrape, otherwise the card Twitter cached and
// the image the user sees are different pictures.
export const pickBgColor = (seed: string): string =>
  BG_COLORS[hashString(seed) % BG_COLORS.length];

// Stable seed for a request: params sorted, so key order in the URL doesn't matter.
export const seedFromParams = (params: URLSearchParams, ignore: string[] = []): string => {
  const skip = new Set(ignore);
  return [...params.entries()]
    .filter(([key]) => !skip.has(key))
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
};

// ImageResponse defaults to 'public, immutable, no-transform, max-age=31536000',
// which is right for a composite of fixed trait art but wrong for anything that
// rolls fresh output per call. Headers passed into ImageResponse are appended to
// its defaults rather than replacing them, so overriding means rebuilding the
// response with the header set outright.
//
// Note this header alone is not enough behind a proxied custom domain. The zone
// rewrites Cache-Control to its own Browser Cache TTL, and Cloudflare treats a
// .png path as cacheable by extension whatever the origin says - so this
// endpoint got a zero-length entry stored at the edge and then served it back
// as 200/0 bytes (cf-cache-status EXPIRED) on every revalidation. Keeping the
// URL out of the shared cache needs a zone Cache Rule bypassing /api/*; this
// header is the correct origin-side half of that, not a substitute for it.
export const noStore = (response: Response): Response => {
  const headers = new Headers(response.headers);
  headers.set('Cache-Control', 'no-store');
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};

const HTML_ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

// Everything interpolated into the OG markup comes from the URL, so it all
// gets escaped on the way in.
export const escapeHtml = (value: string): string =>
  value.replace(/[&<>"']/g, (char) => HTML_ESCAPES[char]);

export const TRAIT_ORDER = [
  'aura',
  'body',
  'face',
  'mouth',
  'head',
  'right_hand',
  'left_hand',
  'accessory',
];

// kebab-case to Title Case, matching the transform the builder UI uses.
export const toTitleCase = (value: string): string =>
  value.replace(/-/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());

const listPhrase = (items: string[]): string =>
  items.length <= 1
    ? items.join('')
    : `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;

// "PING with a Cowboy Hat and a Bazooka Aura" beats "Check out my custom image!"
// on a timeline, and it costs nothing to build from params we already have.
export const titleFromTraits = (params: URLSearchParams): string => {
  const names = TRAIT_ORDER.map((category) => params.get(category))
    .filter((value): value is string => Boolean(value))
    .map(toTitleCase);

  if (names.length === 0) return 'Build your own PING';
  if (names.length <= 3) return `PING with ${listPhrase(names)}`;
  return `PING with ${listPhrase(names.slice(0, 3))} +${names.length - 3} more`;
};

interface OgPageOptions {
  imageUrl: string;
  pageUrl: string;
  title: string;
  description: string;
}

export const renderOgPage = ({ imageUrl, pageUrl, title, description }: OgPageOptions): Response => {
  const image = escapeHtml(imageUrl);
  const page = escapeHtml(pageUrl);
  const safeTitle = escapeHtml(title);
  const safeDescription = escapeHtml(description);

  return new Response(
    `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${safeTitle}</title>

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${safeTitle}" />
  <meta name="twitter:description" content="${safeDescription}" />
  <meta name="twitter:image" content="${image}" />

  <meta property="og:title" content="${safeTitle}" />
  <meta property="og:description" content="${safeDescription}" />
  <meta property="og:image" content="${image}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${page}" />
</head>
<body>
  <img src="${image}" alt="${safeTitle}" style="max-width: 100%;" />
</body>
</html>`,
    {
      headers: {
        'Content-Type': 'text/html;charset=UTF-8',
        'Cache-Control': 'public, max-age=600',
      },
    }
  );
};

export const BOT_USER_AGENT =
  /Twitterbot|Slackbot|Discordbot|facebookexternalhit|TelegramBot|WhatsApp|LinkedInBot|Pinterest|redditbot/i;

/**
 * Where the image endpoints load art from.
 *
 * Deliberately NOT public/traits, which holds the masters at up to 1147px.
 * Decode cost in a Worker scales with source pixels, not output size, and
 * compositing eight masters plus the base exhausted the isolate's CPU budget
 * partway through the response - after the 200 had been flushed, so it
 * surfaced as a valid 200 with an empty body rather than an error. These are
 * generated by scripts/generate-index.mjs at the size the renderer actually
 * draws them, so nothing is lost visually.
 */
export const RENDER_TRAITS_DIR = '/traits-512';
export const RENDER_BASE_IMAGE = '/ping-768.png';
