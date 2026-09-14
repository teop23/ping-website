import { describe, expect, it } from 'vitest';
import { rollRandomTraits as rollInBuilder } from '../src/data/randomCharacter';
import {
  TRAIT_ORDER,
  escapeHtml,
  hashString,
  CARD,
  cardGeometry,
  captionFromTraits,
  noStore,
  pickBgColor,
  rollRandomTraits,
  seedFromParams,
  canonicalTraits,
  shareId,
  validateTraits,
  titleFromTraits,
  toTitleCase,
  isValidXHandle,
  unavatarUrl,
  addToGallery,
  galleryPage,
  parseGallery,
  loadPhoto,
  MAX_PHOTO_BYTES,
} from './_lib';

/**
 * These cover the bugs that actually shipped, not the happy path:
 * a random background baked into a year-long immutable cache, an unescaped
 * handle reaching the markup, and cache headers that appended instead of
 * replacing.
 */

describe('pickBgColor', () => {
  it('returns the same colour for the same seed', () => {
    const seed = 'head=cowboy-hat&face=cool-glasses';
    const first = pickBgColor(seed);
    for (let i = 0; i < 50; i++) expect(pickBgColor(seed)).toBe(first);
  });

  it('separates different seeds across the palette', () => {
    const seeds = Array.from({ length: 40 }, (_, i) => `head=hat-${i}`);
    expect(new Set(seeds.map(pickBgColor)).size).toBeGreaterThan(1);
  });

  it('always returns a hex colour', () => {
    for (let i = 0; i < 25; i++) {
      expect(pickBgColor(`seed-${i}`)).toMatch(/^#[0-9A-F]{6}$/i);
    }
  });
});

describe('seedFromParams', () => {
  it('is independent of parameter order', () => {
    const a = new URLSearchParams('head=cap&face=monocle&body=dress');
    const b = new URLSearchParams('body=dress&head=cap&face=monocle');
    expect(seedFromParams(a)).toBe(seedFromParams(b));
  });

  it('ignores the keys it is told to ignore', () => {
    const withNoise = new URLSearchParams('head=cap&type=banner&ts=1700000000');
    const without = new URLSearchParams('head=cap');
    expect(seedFromParams(withNoise, ['type', 'ts'])).toBe(seedFromParams(without, ['type', 'ts']));
  });

  it('gives the square and the banner of one character the same colour', () => {
    const square = new URLSearchParams('head=crown');
    const banner = new URLSearchParams('head=crown&type=banner');
    expect(pickBgColor(seedFromParams(square, ['type', 'ts']))).toBe(
      pickBgColor(seedFromParams(banner, ['type', 'ts']))
    );
  });
});

describe('hashString', () => {
  it('is deterministic and unsigned', () => {
    expect(hashString('ping')).toBe(hashString('ping'));
    expect(hashString('ping')).toBeGreaterThanOrEqual(0);
  });

  it('separates similar inputs', () => {
    expect(hashString('head=cap')).not.toBe(hashString('head=cop'));
  });
});

describe('escapeHtml', () => {
  it('neutralises a script payload', () => {
    const escaped = escapeHtml('"><script>alert(1)</script>');
    expect(escaped).not.toContain('<script>');
    expect(escaped).not.toContain('"');
  });

  it('escapes every dangerous character', () => {
    expect(escapeHtml(`&<>"'`)).toBe('&amp;&lt;&gt;&quot;&#39;');
  });
});

describe('titleFromTraits', () => {
  it('falls back when nothing is selected', () => {
    expect(titleFromTraits(new URLSearchParams())).toBe('You have 1 new PING');
  });

  it('names the traits in paint order, not query order', () => {
    const params = new URLSearchParams('head=cowboy-hat&aura=fire-aura');
    expect(titleFromTraits(params)).toBe('PING with Fire Aura and Cowboy Hat');
  });

  it('summarises once past three traits', () => {
    const params = new URLSearchParams('aura=fire-aura&body=dress&face=monocle&head=crown');
    expect(titleFromTraits(params)).toContain('+1 more');
  });
});

describe('captionFromTraits', () => {
  it('names up to three traits in paint order and counts the rest', () => {
    const params = new URLSearchParams('head=crown&face=monocle&aura=fire-aura&body=dress&type=banner');
    expect(captionFromTraits(params)).toEqual({ names: ['Fire Aura', 'Dress', 'Monocle'], more: 1 });
  });

  it('is empty for a bare PING', () => {
    expect(captionFromTraits(new URLSearchParams('type=banner'))).toEqual({ names: [], more: 0 });
  });
});

describe('toTitleCase', () => {
  it('converts kebab-case for display', () => {
    expect(toTitleCase('cowboy-hat')).toBe('Cowboy Hat');
  });
});

describe('noStore', () => {
  it('replaces the cache header rather than appending to it', () => {
    const cached = new Response('x', {
      headers: { 'Cache-Control': 'public, immutable, max-age=31536000' },
    });
    const header = noStore(cached).headers.get('Cache-Control');
    expect(header).toBe('no-store');
    expect(header).not.toContain('max-age');
  });

  it('preserves status, body and other headers', async () => {
    const source = new Response('x', { status: 201, headers: { 'Content-Type': 'image/png' } });
    const result = noStore(source);
    expect(result.status).toBe(201);
    expect(result.headers.get('Content-Type')).toBe('image/png');
    expect(await result.text()).toBe('x');
  });
});

describe('TRAIT_ORDER', () => {
  it('paints body and face before head so hats sit on top', () => {
    expect(TRAIT_ORDER.indexOf('body')).toBeLessThan(TRAIT_ORDER.indexOf('head'));
    expect(TRAIT_ORDER.indexOf('face')).toBeLessThan(TRAIT_ORDER.indexOf('head'));
  });

  it('has no duplicates', () => {
    expect(new Set(TRAIT_ORDER).size).toBe(TRAIT_ORDER.length);
  });
});

describe('cardGeometry', () => {
  it('centres the character on both axes', () => {
    for (const isBanner of [false, true]) {
      const g = cardGeometry(isBanner);
      expect(g.traitLeft + g.character / 2).toBeCloseTo(g.width / 2);
      expect(g.traitTop + g.character / 2).toBeCloseTo(g.height / 2);
      expect(g.baseLeft + g.baseSize / 2).toBeCloseTo(g.width / 2);
      expect(g.baseTop + g.baseSize / 2).toBeCloseTo(g.height / 2);
    }
  });

  it('keeps the square card at the trait art native size', () => {
    expect(cardGeometry(false).character).toBe(512);
  });

  it('holds the banner aspect ratio while shrinking the raster', () => {
    // Output raster size is what pushes this over the free tier's CPU budget,
    // so the banner is deliberately smaller than the conventional 1200x630.
    const g = cardGeometry(true);
    expect(g.width / g.height).toBeCloseTo(1200 / 630, 2);
    expect(g.width * g.height).toBeLessThan(1200 * 630 * 0.5);
  });

  it('stays above the size scrapers need for a large card', () => {
    expect(CARD.banner.width).toBeGreaterThanOrEqual(600);
    expect(CARD.banner.height).toBeGreaterThanOrEqual(315);
  });

  it('moves a captioned banner character to the right edge, base still centred on it', () => {
    const g = cardGeometry(true, true);
    expect(g.traitLeft + g.character).toBeLessThan(g.width);
    expect(g.traitLeft).toBeGreaterThan((g.width - g.character) / 2);
    expect(g.baseLeft + g.baseSize / 2).toBeCloseTo(g.traitLeft + g.character / 2);
    expect(cardGeometry(false, true)).toEqual(cardGeometry(false));
  });

  it('scales the character with the frame', () => {
    const square = cardGeometry(false);
    const banner = cardGeometry(true);
    expect(banner.character / banner.width).toBeCloseTo(512 / 1200, 2);
    expect(square.baseSize / square.character).toBeCloseTo(banner.baseSize / banner.character);
  });
});

describe('canonicalTraits', () => {
  it('is independent of the order params were written in', () => {
    const a = canonicalTraits(new URLSearchParams('head=crown&aura=blue-aura'));
    const b = canonicalTraits(new URLSearchParams('aura=blue-aura&head=crown'));
    expect(a).toBe(b);
    expect(a).toBe('aura=blue-aura&head=crown');
  });

  it('drops empty slots and anything outside the eight categories', () => {
    const canonical = canonicalTraits(new URLSearchParams('head=crown&type=banner&ts=123'));
    expect(canonical).toBe('head=crown');
  });

  it('is empty for a bare character', () => {
    expect(canonicalTraits(new URLSearchParams(''))).toBe('');
  });
});

describe('shareId', () => {
  it('is stable for the same character', async () => {
    const canonical = 'aura=blue-aura&head=crown';
    expect(await shareId(canonical)).toBe(await shareId(canonical));
  });

  it('differs between characters', async () => {
    expect(await shareId('head=crown')).not.toBe(await shareId('head=beanie'));
  });

  it('is a short url-safe token', async () => {
    expect(await shareId('head=crown')).toMatch(/^[0-9a-z]{12}$/);
  });
});

describe('validateTraits', () => {
  const index = { head: ['crown', 'beanie'], aura: ['blue-aura'] };

  it('accepts a selection drawn from the index', () => {
    expect(validateTraits(new URLSearchParams('head=crown&aura=blue-aura'), index)).toBeNull();
  });

  it('rejects an unknown category', () => {
    expect(validateTraits(new URLSearchParams('wings=big'), index)).toMatch(/category/);
  });

  it('rejects a trait that is not in its category', () => {
    expect(validateTraits(new URLSearchParams('head=sombrero'), index)).toMatch(/trait/);
  });
});

describe('rollRandomTraits', () => {
  // The builder's Randomize and /api/image/random.png must roll the same way.
  it('picks identically to the builder copy for the same rng', () => {
    const lcg = (seed: number) => () => ((seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296);
    const pools = ['aura', 'body', 'face', 'mouth', 'head'].map((c) =>
      Array.from({ length: 7 }, (_, i) => `${c}-${i}`)
    );
    for (let seed = 1; seed <= 50; seed++) {
      expect(rollRandomTraits(pools, 0.45, lcg(seed))).toEqual(rollInBuilder(pools, 0.45, lcg(seed)));
    }
  });
});

describe('isValidXHandle', () => {
  it('accepts real-shaped handles', () => {
    expect(isValidXHandle('elonmusk')).toBe(true);
    expect(isValidXHandle('jack')).toBe(true);
    expect(isValidXHandle('a_b_c_123')).toBe(true);
    expect(isValidXHandle('a'.repeat(15))).toBe(true);
  });

  it('rejects anything that is not a bare handle', () => {
    expect(isValidXHandle('')).toBe(false);
    expect(isValidXHandle('a'.repeat(16))).toBe(false);
    expect(isValidXHandle('has space')).toBe(false);
    expect(isValidXHandle('has-dash')).toBe(false);
    expect(isValidXHandle('@elonmusk')).toBe(false);
    expect(isValidXHandle('../etc/passwd')).toBe(false);
    expect(isValidXHandle('https://evil.example')).toBe(false);
  });
});

describe('unavatarUrl', () => {
  it('builds a fallback=false unavatar.io URL for the handle', () => {
    const url = unavatarUrl('jack');
    expect(url).toBe('https://unavatar.io/x/jack?fallback=false');
  });

  it('encodes the handle', () => {
    expect(unavatarUrl('a b')).toContain(encodeURIComponent('a b'));
  });
});

describe('gallery index', () => {
  const entry = (id: string, at: number) => ({ id, traits: `head=${id}`, at });

  it('puts the newest first and caps the list', () => {
    let entries = [] as ReturnType<typeof parseGallery>;
    for (let i = 0; i < 5; i++) entries = addToGallery(entries, entry(`c${i}`, i), 3);
    expect(entries.map((e) => e.id)).toEqual(['c4', 'c3', 'c2']);
  });

  it('keeps one slot per id, moving a repeat to the front', () => {
    const entries = addToGallery([entry('a', 1), entry('b', 2)], entry('b', 3));
    expect(entries.map((e) => [e.id, e.at])).toEqual([['b', 3], ['a', 1]]);
  });

  it('treats a missing or malformed document as empty', () => {
    expect(parseGallery(null)).toEqual([]);
    expect(parseGallery({ id: 'x' })).toEqual([]);
    expect(parseGallery([entry('ok', 1), { id: 3 }, null, 'junk'])).toEqual([entry('ok', 1)]);
  });

  it('pages with a next offset until the end', () => {
    const entries = Array.from({ length: 5 }, (_, i) => entry(`c${i}`, i));
    expect(galleryPage(entries, 0, 2)).toMatchObject({ next: 2 });
    expect(galleryPage(entries, 4, 2)).toMatchObject({ items: [entry('c4', 4)], next: null });
    expect(galleryPage(entries, -7, 2).items[0].id).toBe('c0');
    expect(galleryPage(entries, NaN, 2).items[0].id).toBe('c0');
  });
});

describe('loadPhoto', () => {
  const png = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);
  const serve = (body: BodyInit, headers: Record<string, string>, status = 200) =>
    (async () => new Response(body, { status, headers })) as unknown as typeof fetch;

  it('returns a data URI for a small image', async () => {
    const result = await loadPhoto('https://example.com/a.png', serve(png, { 'content-type': 'image/png' }));
    expect(result).toEqual({ dataUri: `data:image/png;base64,${btoa(String.fromCharCode(...png))}` });
  });

  it('refuses anything but https before fetching', async () => {
    let fetched = false;
    const spy = (async () => { fetched = true; return new Response(png); }) as unknown as typeof fetch;
    for (const url of ['http://example.com/a.png', 'data:image/png;base64,AAAA', 'file:///etc/passwd', 'not a url']) {
      expect(await loadPhoto(url, spy)).toMatchObject({ status: 400 });
    }
    expect(fetched).toBe(false);
  });

  it('refuses SVG and non-images', async () => {
    for (const type of ['image/svg+xml', 'text/html']) {
      expect(await loadPhoto('https://example.com/a', serve('<svg/>', { 'content-type': type }))).toMatchObject({ status: 400 });
    }
  });

  it('refuses a photo over the size cap even without a content-length', async () => {
    const big = new Uint8Array(MAX_PHOTO_BYTES + 1);
    expect(await loadPhoto('https://example.com/a.png', serve(big, { 'content-type': 'image/png' }))).toMatchObject({ status: 400 });
  });

  it('reports an upstream failure as 502', async () => {
    expect(await loadPhoto('https://example.com/a.png', serve('', { 'content-type': 'image/png' }, 404))).toMatchObject({ status: 502 });
    const boom = (async () => { throw new Error('timeout'); }) as unknown as typeof fetch;
    expect(await loadPhoto('https://example.com/a.png', boom)).toMatchObject({ status: 502 });
  });
});
