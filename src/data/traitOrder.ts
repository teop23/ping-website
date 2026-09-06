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
