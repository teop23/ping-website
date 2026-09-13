// Shared helpers for the Pages Functions. Files prefixed with _ are not routed.

import launchConfig from '../launch.config.mjs';

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

/**
 * Categories that paint BEHIND the base character art.
 *
 * TRAIT_ORDER orders the traits among themselves only; the base penguin is
 * drawn separately, and drawing it before every trait put `aura` on top of the
 * character instead of behind it. The stack is: these categories, then the
 * base art, then the rest of TRAIT_ORDER.
 *
 * App-side authority is src/data/traitOrder.ts; traitOrder.test.ts asserts the
 * two agree.
 */
export const UNDER_BASE_CATEGORIES = ['aura'];

export const paintsUnderBase = (category: string): boolean =>
  UNDER_BASE_CATEGORIES.includes(category);

/**
 * Splits trait selections into what paints before the base art and what paints
 * after it, each sorted into TRAIT_ORDER.
 */
export const splitAtBase = <T extends { category: string }>(
  items: T[]
): { under: T[]; over: T[] } => {
  const ordered = [...items].sort(
    (a, b) => TRAIT_ORDER.indexOf(a.category) - TRAIT_ORDER.indexOf(b.category)
  );
  return {
    under: ordered.filter((item) => paintsUnderBase(item.category)),
    over: ordered.filter((item) => !paintsUnderBase(item.category)),
  };
};

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
  <meta property="og:image:width" content="${CARD.banner.width}" />
  <meta property="og:image:height" content="${CARD.banner.height}" />
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

/**
 * Card geometry, shared by every image endpoint.
 *
 * The banner is 800x420 rather than the conventional 1200x630. Output raster
 * size, not layer count, is what pushes this over the free tier's per-request
 * CPU budget: measured on the live deployment, a TWO-trait 1200x630 card failed
 * 4/10 while an EIGHT-trait 512x512 one failed 3/10. 800x420 holds the same
 * 1.905:1 shape at 44% of the pixels, and stays well above the 300x157 floor
 * that X and Facebook need to render a large summary card rather than
 * downgrading to a thumbnail.
 *
 * The character keeps its proportion of the frame, so the composition is
 * unchanged - it is the same picture, rasterised smaller.
 */
export const CARD = {
  square: { width: 512, height: 512 },
  banner: { width: 800, height: 420 },
};

/** The base art is drawn larger than the trait box; traits register to the box. */
export const BASE_SCALE = 1.4;

export const cardGeometry = (isBanner: boolean) => {
  const { width, height } = isBanner ? CARD.banner : CARD.square;
  // Traits are authored square and fill the character box.
  const character = isBanner ? Math.round((CARD.banner.width / 1200) * 512) : 512;
  const baseSize = character * BASE_SCALE;

  return {
    width,
    height,
    character,
    baseSize,
    baseTop: (height - baseSize) / 2,
    baseLeft: (width - baseSize) / 2,
    traitTop: (height - character) / 2,
    traitLeft: (width - character) / 2,
  };
};

/** A real character usually has empty slots, so a random one should too.
 *  Sourced from /launch.config.mjs, the same place src/utils/constants.ts
 *  reads it from - this used to be a second hand-typed copy that had to be
 *  kept in sync by hand. */
export const EMPTY_TRAIT_CHANCE = launchConfig.emptyTraitChance;

/** At most one trait per category, each category empty with `emptyChance`.
 *  App-side authority is src/data/randomCharacter.ts; its test asserts the
 *  two pick identically for the same rng. */
export const rollRandomTraits = <T>(
  pools: ReadonlyArray<ReadonlyArray<T>>,
  emptyChance: number,
  rng: () => number = Math.random
): T[] => {
  const picked: T[] = [];
  for (const pool of pools) {
    if (pool.length === 0) continue;
    if (rng() < emptyChance) continue;
    picked.push(pool[Math.min(pool.length - 1, Math.floor(rng() * pool.length))]);
  }
  return picked;
};

/* ------------------------------------------------------------------ *
 * Stored share cards
 *
 * A share used to be a query string: the card URL carried the traits, and
 * every scrape of that URL ran a fresh satori render. That render is the
 * single thing that has broken in production twice (an empty 200 when the
 * isolate exhausted its CPU budget mid-response, and a zero-length PNG cached
 * at the edge), and it is the reason a card can be slow or blank in the
 * composer. Rendering once, when the user clicks Tweet, and storing the bytes
 * turns the bot's request into a static read.
 *
 * Ids are content-addressed - the same character always produces the same id -
 * so a re-share is a read, sharing is idempotent, and storage grows with
 * distinct characters rather than with clicks.
 * ------------------------------------------------------------------ */

export interface CardStore {
  get(key: string): Promise<{ body: ArrayBuffer; traits: string } | null>;
  put(key: string, body: ArrayBuffer, traits: string): Promise<void>;
}

/**
 * KV today, R2 the day it is enabled on the account. Everything above this
 * line is storage-agnostic; only this adapter knows which one is in play.
 */
export const kvCardStore = (namespace: KVNamespace): CardStore => ({
  async get(key) {
    const { value, metadata } = await namespace.getWithMetadata<{ traits: string }>(key, {
      type: 'arrayBuffer',
    });
    if (!value) return null;
    return { body: value, traits: metadata?.traits ?? '' };
  },
  async put(key, body, traits) {
    // The trait string rides in metadata rather than a second key: one write
    // per character keeps the 1,000-writes/day free ceiling meaningful, and
    // metadata (1 KiB) is far more room than eight short slot names need.
    await namespace.put(key, body, { metadata: { traits } });
  },
});

/**
 * The canonical form of a character: trait slots in paint order, empties
 * dropped. Two users who build the same character produce the same string,
 * hence the same id, hence one stored card between them.
 */
export const canonicalTraits = (params: URLSearchParams): string =>
  TRAIT_ORDER.map((category) => [category, params.get(category)] as const)
    .filter((entry): entry is [string, string] => Boolean(entry[1]))
    .map(([category, trait]) => `${category}=${trait}`)
    .join('&');

/**
 * Content-addressed id. SHA-256 rather than the FNV hash used for background
 * colours: at 32 bits a collision becomes likely in the tens of thousands of
 * characters, and a collision here would serve one user's card for another's
 * link. 12 base36 characters is ~62 bits, which is not close to a problem.
 */
export const shareId = async (canonical: string): Promise<string> => {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(canonical));
  const bytes = new Uint8Array(digest);
  let value = 0n;
  for (let i = 0; i < 8; i++) value = (value << 8n) | BigInt(bytes[i]);
  return value.toString(36).padStart(13, '0').slice(0, 12);
};

/** A card smaller than this is the empty-body failure, not a picture. */
export const MIN_CARD_BYTES = 1024;

/**
 * Validates a trait selection against the generated index, which is the same
 * closed enum the image endpoints enforce. Returns an error string rather than
 * throwing so callers can decide the status code.
 */
export const validateTraits = (
  params: URLSearchParams,
  index: Record<string, string[]>
): string | null => {
  const categories = Object.keys(index);
  for (const [category, trait] of params.entries()) {
    if (!categories.includes(category)) return `Invalid category "${category}"`;
    if (!index[category].includes(trait)) return `Invalid trait "${trait}" for "${category}"`;
  }
  return null;
};
