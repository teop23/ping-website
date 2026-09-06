import { readFileSync } from 'fs';
import { describe, expect, it } from 'vitest';
import { TRAIT_RENDER_ORDER, byRenderOrder } from './traitOrder';

describe('byRenderOrder', () => {
  it('sorts into paint order regardless of input order', () => {
    const input = [
      { category: 'head', id: 'a' },
      { category: 'aura', id: 'b' },
      { category: 'body', id: 'c' },
    ];
    expect(byRenderOrder(input).map((t) => t.category)).toEqual(['aura', 'body', 'head']);
  });

  it('does not mutate its input', () => {
    const input = [{ category: 'head' }, { category: 'aura' }];
    byRenderOrder(input);
    expect(input.map((t) => t.category)).toEqual(['head', 'aura']);
  });

  it('puts hats over hair and masks', () => {
    const sorted = byRenderOrder([
      { category: 'head' },
      { category: 'face' },
      { category: 'body' },
    ]).map((t) => t.category);
    expect(sorted.indexOf('body')).toBeLessThan(sorted.indexOf('head'));
    expect(sorted.indexOf('face')).toBeLessThan(sorted.indexOf('head'));
  });
});

describe('TRAIT_RENDER_ORDER', () => {
  it('has no duplicates', () => {
    expect(new Set(TRAIT_RENDER_ORDER).size).toBe(TRAIT_RENDER_ORDER.length);
  });

  /**
   * The order is declared once per build system: here, in the Node generator,
   * and in the Cloudflare bundle. They cannot share a module cheaply, so this
   * asserts they agree. A failure here means a character composites in one
   * order in the builder and a different one in the image API.
   */
  it('matches the order stamped into the generated manifest', () => {
    const manifest = JSON.parse(readFileSync('public/traits-manifest.json', 'utf8'));
    expect(manifest.renderOrder).toEqual(TRAIT_RENDER_ORDER);
  });

  it('matches the order the Pages Functions use', () => {
    const lib = readFileSync('functions/_lib.ts', 'utf8');
    const block = lib.match(/export const TRAIT_ORDER = \[([\s\S]*?)\];/);
    if (!block) throw new Error('TRAIT_ORDER not found in functions/_lib.ts');
    const fromFunctions = [...block[1].matchAll(/'([a-z_]+)'/g)].map((m) => m[1]);
    expect(fromFunctions).toEqual(TRAIT_RENDER_ORDER);
  });
});
