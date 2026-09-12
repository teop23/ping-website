import { TraitCategory } from '../types';

/**
 * Paint order for a composited character, back to front.
 *
 * Deliberately not the order the category tabs are listed in: body and face go
 * down before head so hats sit over hair and masks.
 *
 * This is the app-side authority. Two others exist by necessity, because they
 * run in different build systems that cannot share a module cheaply:
 *   - scripts/generate-index.mjs, which stamps renderOrder into the manifest
 *   - functions/_lib.ts, for the Cloudflare Pages bundle
 * traitLoader compares this list against the manifest on load and warns if they
 * drift, so a change in one place cannot silently disagree with another.
 */
export const TRAIT_RENDER_ORDER: TraitCategory[] = [
  'aura',
  'body',
  'face',
  'mouth',
  'head',
  'right_hand',
  'left_hand',
  'accessory',
];

/** Sorts any objects carrying a `category` into paint order. */
export const byRenderOrder = <T extends { category: string }>(items: T[]): T[] =>
  [...items].sort(
    (a, b) =>
      TRAIT_RENDER_ORDER.indexOf(a.category as TraitCategory) -
      TRAIT_RENDER_ORDER.indexOf(b.category as TraitCategory)
  );

/**
 * Categories that paint BEHIND the base character art.
 *
 * The render order above is the order of the *traits* among themselves; it
 * says nothing about where the base penguin goes, and every renderer used to
 * paint the base first and the ordered traits after it. That put `aura` — the
 * first trait — on top of the character instead of glowing behind it, which is
 * exactly what shipped. The stack is: these categories, then the base art,
 * then everything else, still in TRAIT_RENDER_ORDER.
 *
 * Mirrored in functions/_lib.ts for the Cloudflare bundle, and asserted equal
 * by traitOrder.test.ts, per the three-authorities note above.
 */
export const UNDER_BASE_CATEGORIES: TraitCategory[] = ['aura'];

export const paintsUnderBase = (category: string): boolean =>
  (UNDER_BASE_CATEGORIES as string[]).includes(category);

/**
 * Splits anything carrying a `category` into the layers that paint before the
 * base art and the layers that paint after it, each already in paint order.
 */
export const splitAtBase = <T extends { category: string }>(
  items: T[]
): { under: T[]; over: T[] } => {
  const ordered = byRenderOrder(items);
  return {
    under: ordered.filter((item) => paintsUnderBase(item.category)),
    over: ordered.filter((item) => !paintsUnderBase(item.category)),
  };
};
