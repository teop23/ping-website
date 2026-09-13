import { describe, expect, it } from 'vitest';
import { rollRandomTraits as rollInBuilder } from '../src/data/randomCharacter';
import {
  TRAIT_ORDER,
  escapeHtml,
  hashString,
  CARD,
  cardGeometry,
  noStore,
  pickBgColor,
  rollRandomTraits,
  seedFromParams,
  canonicalTraits,
  shareId,
  validateTraits,
  titleFromTraits,
  toTitleCase,
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
    expect(titleFromTraits(new URLSearchParams())).toBe('Build your own PING');
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
