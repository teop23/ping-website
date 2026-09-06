import { describe, expect, it } from 'vitest';
import {
  TRAIT_ORDER,
  escapeHtml,
  hashString,
  noStore,
  pickBgColor,
  seedFromParams,
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

  it('preserves status and other headers', () => {
    const source = new Response('x', { status: 201, headers: { 'Content-Type': 'image/png' } });
    const result = noStore(source);
    expect(result.status).toBe(201);
    expect(result.headers.get('Content-Type')).toBe('image/png');
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
