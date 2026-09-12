import { readFileSync } from 'fs';
import { describe, expect, it } from 'vitest';
import { TRAIT_RENDER_ORDER, UNDER_BASE_CATEGORIES, paintsUnderBase, splitAtBase } from './traitOrder';

describe('splitAtBase', () => {
  it('sorts an aura under the base and everything else over it', () => {
    const { under, over } = splitAtBase([
      { category: 'head' },
      { category: 'aura' },
      { category: 'body' },
    ]);
    expect(under.map((t) => t.category)).toEqual(['aura']);
    expect(over.map((t) => t.category)).toEqual(['body', 'head']);
  });

  it('keeps paint order within each half regardless of input order', () => {
    const { over } = splitAtBase([{ category: 'accessory' }, { category: 'face' }]);
    expect(over.map((t) => t.category)).toEqual(['face', 'accessory']);
  });

  it('does not mutate its input', () => {
    const input = [{ category: 'head' }, { category: 'aura' }];
    splitAtBase(input);
    expect(input.map((t) => t.category)).toEqual(['head', 'aura']);
  });

  it('only names real categories, each of them under-base-first in paint order', () => {
    UNDER_BASE_CATEGORIES.forEach((category) => {
      expect(TRAIT_RENDER_ORDER).toContain(category);
    });
    const lastUnder = Math.max(...UNDER_BASE_CATEGORIES.map((c) => TRAIT_RENDER_ORDER.indexOf(c)));
    const firstOver = TRAIT_RENDER_ORDER.findIndex((c) => !paintsUnderBase(c));
    expect(lastUnder).toBeLessThan(firstOver);
  });

  it('matches the list the Pages Functions use', () => {
    const lib = readFileSync('functions/_lib.ts', 'utf8');
    const block = lib.match(/export const UNDER_BASE_CATEGORIES = \[([\s\S]*?)\];/);
    if (!block) throw new Error('UNDER_BASE_CATEGORIES not found in functions/_lib.ts');
    const fromFunctions = [...block[1].matchAll(/'([a-z_]+)'/g)].map((m) => m[1]);
    expect(fromFunctions).toEqual(UNDER_BASE_CATEGORIES);
  });
});

/**
 * The real guard. An aura composited on top of the penguin shipped to
 * production for seven sessions because every test asserted the *order array*,
 * which was right, while every renderer painted the base before all traits.
 * Nothing about a correct TRAIT_RENDER_ORDER forces a renderer to put the base
 * in the middle, so this asserts the renderers themselves, by source: the
 * under-base layers must be painted before the base art, and the base art
 * before the rest.
 *
 * functions/api/image/shirt.png.tsx is deliberately absent - it composites one
 * fixed body trait and never an aura.
 */
const SITES: { file: string; under: RegExp; base: RegExp; over: RegExp; sites: number }[] = [
  {
    file: 'src/components/HeroCharacter.tsx',
    under: /\{under\.map\(layer\)\}/g,
    base: /src=\{baseCharacterImage\}/g,
    over: /\{over\.map\(layer\)\}/g,
    sites: 1,
  },
  {
    file: 'src/components/CharacterPreview.tsx',
    under: /under\.forEach\(paint\)/g,
    base: /drawImage\(baseImage,/g,
    over: /over\.forEach\(paint\)/g,
    sites: 3,
  },
  {
    file: 'functions/api/image/custom.png.tsx',
    under: /\{underBase\.map\(/g,
    base: /src=\{baseCharacterImage\}/g,
    over: /\{overBase\.map\(/g,
    sites: 1,
  },
  {
    file: 'functions/api/image/random.png.tsx',
    under: /\{underBase\.map\(/g,
    base: /src=\{baseCharacterImage\}/g,
    over: /\{overBase\.map\(/g,
    sites: 1,
  },
  {
    file: 'functions/api/og/banner.png.tsx',
    under: /\{underBase\.map\(/g,
    base: /RENDER_BASE_IMAGE\}`\}/g,
    over: /\{overBase\.map\(/g,
    sites: 1,
  },
];

const indicesOf = (source: string, pattern: RegExp): number[] =>
  [...source.matchAll(pattern)].map((match) => match.index as number);

describe('every compositing site paints the base between the two halves', () => {
  SITES.forEach(({ file, under, base, over, sites }) => {
    it(file, () => {
      const source = readFileSync(file, 'utf8');
      const unders = indicesOf(source, under);
      const bases = indicesOf(source, base);
      const overs = indicesOf(source, over);

      expect(unders).toHaveLength(sites);
      expect(bases).toHaveLength(sites);
      expect(overs).toHaveLength(sites);

      for (let i = 0; i < sites; i++) {
        expect(unders[i]).toBeLessThan(bases[i]);
        expect(bases[i]).toBeLessThan(overs[i]);
      }
    });
  });
});
