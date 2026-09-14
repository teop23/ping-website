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
const traitNames = (params: URLSearchParams): string[] =>
  TRAIT_ORDER.map((category) => params.get(category))
    .filter((value): value is string => Boolean(value))
    .map(toTitleCase);

/** How many trait names a caption or title spells out before summarising. */
export const NAMED_TRAITS = 3;

/** The names a share card prints: the first few in paint order, plus how many were left out. */
export const captionFromTraits = (params: URLSearchParams): { names: string[]; more: number } => {
  const names = traitNames(params);
  return { names: names.slice(0, NAMED_TRAITS), more: Math.max(0, names.length - NAMED_TRAITS) };
};

export const titleFromTraits = (params: URLSearchParams): string => {
  const names = traitNames(params);

  if (names.length === 0) return 'You have 1 new PING';
  if (names.length <= NAMED_TRAITS) return `PING with ${listPhrase(names)}`;
  return `PING with ${listPhrase(names.slice(0, NAMED_TRAITS))} +${names.length - NAMED_TRAITS} more`;
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

// X/Twitter handles: letters, digits, underscore, 1-15 chars. Anything else
// isn't a real handle and shouldn't reach the upstream avatar resolver.
const X_HANDLE_PATTERN = /^[A-Za-z0-9_]{1,15}$/;

export const isValidXHandle = (handle: string): boolean => X_HANDLE_PATTERN.test(handle);

// How long our own redirect gets cached. unavatar.io's free tier caches each
// resolved avatar behind Cloudflare for 28 days on its own (a `ttl` override
// is a paid-plan-only param and 403s with ETTL for free callers) - this just
// controls how long OUR redirect response is reused before re-checking.
export const UNAVATAR_TTL_SECONDS = 86400;

// unavatar.io/x/<handle> is a keyless, public avatar resolver (no scraped
// endpoint, no spoofed headers). `fallback=false` makes it 404 instead of
// serving a generic placeholder image for a handle with no avatar, which is
// what lets the caller tell "unknown user" apart from "has default avatar".
export const unavatarUrl = (handle: string): string =>
  `https://unavatar.io/x/${encodeURIComponent(handle)}?fallback=false`;

/** Largest photo /api/image/shirt.png will print. An X avatar is ~50 KB. */
export const MAX_PHOTO_BYTES = 2 * 1024 * 1024;
const PHOTO_TIMEOUT_MS = 5000;
/** Raster formats satori decodes. SVG is left out on purpose: it is markup, not pixels. */
const PHOTO_TYPES = ['image/png', 'image/jpeg'];

/**
 * Fetches a user-supplied photo for the shirt endpoint and returns it as a
 * data URI, or an error string for a 400/502.
 *
 * The URL used to go straight into satori's <img>, which fetched whatever it
 * was pointed at: any scheme, any size, no timeout. A 50 MB image or a slow
 * host then burned the isolate's CPU budget and came back as an empty 200.
 * Fetching it here first lets the endpoint refuse those before rendering.
 */
export const loadPhoto = async (
  raw: string,
  fetchFn: typeof fetch = fetch
): Promise<{ dataUri: string } | { error: string; status: number }> => {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return { error: 'photo must be a URL', status: 400 };
  }
  if (url.protocol !== 'https:') return { error: 'photo must be an https URL', status: 400 };

  let response: Response;
  try {
    response = await fetchFn(url.href, { signal: AbortSignal.timeout(PHOTO_TIMEOUT_MS) });
  } catch {
    return { error: 'Could not fetch photo', status: 502 };
  }
  if (!response.ok) return { error: 'Could not fetch photo', status: 502 };

  const type = (response.headers.get('content-type') || '').split(';')[0].trim().toLowerCase();
  if (!PHOTO_TYPES.includes(type)) return { error: 'photo must be a PNG or JPEG image', status: 400 };
  if (Number(response.headers.get('content-length') || 0) > MAX_PHOTO_BYTES) {
    return { error: 'photo is too large', status: 400 };
  }

  const bytes = new Uint8Array(await response.arrayBuffer());
  if (bytes.byteLength > MAX_PHOTO_BYTES) return { error: 'photo is too large', status: 400 };

  let binary = '';
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }
  return { dataUri: `data:${type};base64,${btoa(binary)}` };
};

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

/** Room kept right of a captioned banner's character, and left of its text. */
export const CAPTION_INSET = 48;

/**
 * A captioned banner moves the character to the right edge so the trait names
 * get the left side; everything else about the frame is unchanged.
 */
export const cardGeometry = (isBanner: boolean, captioned = false) => {
  const { width, height } = isBanner ? CARD.banner : CARD.square;
  // Traits are authored square and fill the character box.
  const character = isBanner ? Math.round((CARD.banner.width / 1200) * 512) : 512;
  const baseSize = character * BASE_SCALE;
  const traitLeft = isBanner && captioned ? width - character - CAPTION_INSET : (width - character) / 2;

  return {
    width,
    height,
    character,
    baseSize,
    baseTop: (height - baseSize) / 2,
    baseLeft: traitLeft - (baseSize - character) / 2,
    traitTop: (height - character) / 2,
    traitLeft,
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

/**
 * GalleryEntry is declared further down; forward-reference it here so
 * CardStore can carry gallery operations too ("gallery goes through the same
 * store" - see docs/HANDOFF.md). TypeScript resolves this fine since both
 * live in the same module; only the reading order looks backwards.
 */
export interface CardStore {
  get(key: string): Promise<{ body: ArrayBuffer; traits: string } | null>;
  put(key: string, body: ArrayBuffer, traits: string): Promise<void>;
  getGallery(): Promise<GalleryEntry[]>;
  putGallery(entries: GalleryEntry[]): Promise<void>;
}

/**
 * KV today, R2 the day it is enabled on the account, or the owner's own box
 * (httpCardStore below) once the tunnel is up. Everything above this line is
 * storage-agnostic; only this adapter knows which one is in play.
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
  async getGallery() {
    return parseGallery(await namespace.get(GALLERY_KEY, 'json'));
  },
  async putGallery(entries) {
    await namespace.put(GALLERY_KEY, JSON.stringify(entries));
  },
});

/** Options for httpCardStore. Mirrors the Pages secrets the owner sets once
 *  the tunnel is running: CARD_STORE_URL, CARD_STORE_TOKEN. */
export interface HttpCardStoreOptions {
  /** Public tunnel hostname, e.g. https://cards.example.com. No trailing slash. */
  baseUrl: string;
  token: string;
  /** Kept short: a Function has its own CPU/wall budget, and the whole point
   *  is that a slow or unreachable home box must fail fast into the existing
   *  503-and-fall-back-to-query-param path, not hang the request. */
  timeoutMs?: number;
  fetchFn?: typeof fetch;
}

const DEFAULT_HTTP_STORE_TIMEOUT_MS = 4000;

/**
 * Talks HTTP to the self-hosted storage service (storage/server.js) behind a
 * Cloudflare Tunnel. Same CardStore shape as kvCardStore, so callers never
 * know which one they got - see selectCardStore.
 */
export const httpCardStore = ({
  baseUrl,
  token,
  timeoutMs = DEFAULT_HTTP_STORE_TIMEOUT_MS,
  fetchFn = fetch,
}: HttpCardStoreOptions): CardStore => {
  const url = (path: string) => `${baseUrl.replace(/\/$/, '')}${path}`;
  const headers = { Authorization: `Bearer ${token}` };

  return {
    async get(key) {
      const response = await fetchFn(url(`/cards/${encodeURIComponent(key)}`), {
        headers,
        signal: AbortSignal.timeout(timeoutMs),
      });
      if (response.status === 404) return null;
      if (!response.ok) throw new Error(`card store GET failed: ${response.status}`);
      const body = await response.arrayBuffer();
      const traitsHeader = response.headers.get('x-ping-traits');
      return { body, traits: traitsHeader ? decodeURIComponent(traitsHeader) : '' };
    },
    async put(key, body, traits) {
      const response = await fetchFn(url(`/cards/${encodeURIComponent(key)}`), {
        method: 'PUT',
        headers: {
          ...headers,
          'Content-Type': 'image/png',
          'X-Ping-Traits': encodeURIComponent(traits),
        },
        body,
        signal: AbortSignal.timeout(timeoutMs),
      });
      if (!response.ok) throw new Error(`card store PUT failed: ${response.status}`);
    },
    async getGallery() {
      const response = await fetchFn(url('/gallery'), {
        headers,
        signal: AbortSignal.timeout(timeoutMs),
      });
      if (!response.ok) throw new Error(`card store gallery GET failed: ${response.status}`);
      return parseGallery(await response.json());
    },
    async putGallery(entries) {
      const response = await fetchFn(url('/gallery'), {
        method: 'PUT',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify(entries),
        signal: AbortSignal.timeout(timeoutMs),
      });
      if (!response.ok) throw new Error(`card store gallery PUT failed: ${response.status}`);
    },
  };
};

/**
 * Picks the remote store when the owner has configured it, otherwise KV -
 * kept working on purpose so nothing breaks before the tunnel exists. Returns
 * null when neither is configured, same as an absent KV binding did before:
 * callers turn that into the existing 503 (see functions/api/share.ts),
 * which the client already treats as "fall back to the query-param URL".
 */
export const selectCardStore = (env: {
  PING_CARDS?: KVNamespace;
  CARD_STORE_URL?: string;
  CARD_STORE_TOKEN?: string;
}): CardStore | null => {
  if (env.CARD_STORE_URL && env.CARD_STORE_TOKEN) {
    return httpCardStore({ baseUrl: env.CARD_STORE_URL, token: env.CARD_STORE_TOKEN });
  }
  if (env.PING_CARDS) return kvCardStore(env.PING_CARDS);
  return null;
};

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

/* ------------------------------------------------------------------
 * Gallery of shared characters.
 *
 * One KV document holding the newest ids, not a KV list over the card keys:
 * list operations are capped at 1,000/day on the free plan while reads are
 * 100,000/day, and a single get serves a whole page. The cost is one extra
 * write per new character, and a lost entry if two first-time shares land in
 * the same second (KV is last-write-wins). Losing a gallery slot is harmless;
 * the card itself is already stored.
 * ------------------------------------------------------------------ */

export const GALLERY_KEY = 'gallery:index';
export const GALLERY_MAX = 480;
export const GALLERY_PAGE_SIZE = 24;

export interface GalleryEntry {
  id: string;
  traits: string;
  /** Unix ms. */
  at: number;
}

/** Newest first, one slot per id, capped. Pure so it can be tested without KV. */
export const addToGallery = (
  entries: GalleryEntry[],
  entry: GalleryEntry,
  max = GALLERY_MAX
): GalleryEntry[] => [entry, ...entries.filter((e) => e.id !== entry.id)].slice(0, max);

/** A malformed or missing document is an empty gallery, never an error. */
export const parseGallery = (raw: unknown): GalleryEntry[] =>
  Array.isArray(raw)
    ? raw.filter(
        (e): e is GalleryEntry =>
          Boolean(e) &&
          typeof e.id === 'string' &&
          typeof e.traits === 'string' &&
          typeof e.at === 'number'
      )
    : [];

export const galleryPage = (entries: GalleryEntry[], offset: number, size = GALLERY_PAGE_SIZE) => {
  const start = Number.isInteger(offset) && offset > 0 ? offset : 0;
  const items = entries.slice(start, start + size);
  return { items, next: start + size < entries.length ? start + size : null };
};

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
