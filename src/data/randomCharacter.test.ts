import { describe, expect, it } from 'vitest';
import launchConfig from '../../launch.config.mjs';
import { rollRandomTraits } from './randomCharacter';

/** Deterministic rng (mulberry32) so a failing roll can be replayed. */
const seeded = (seed: number) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const CATEGORIES = ['aura', 'body', 'face', 'mouth', 'head', 'right_hand', 'left_hand', 'accessory'];
const pools = CATEGORIES.map((category) =>
  Array.from({ length: 20 }, (_, i) => ({ category, id: `${category}-${i}` }))
);

describe('rollRandomTraits', () => {
  it('never picks two traits from the same category', () => {
    const rng = seeded(1);
    for (let i = 0; i < 2000; i++) {
      const picked = rollRandomTraits(pools, launchConfig.emptyTraitChance, rng);
      const categories = picked.map((t) => t.category);
      expect(new Set(categories).size).toBe(categories.length);
    }
  });

  it('leaves each category empty 40-50% of the time with the shipped config', () => {
    expect(launchConfig.emptyTraitChance).toBeGreaterThanOrEqual(0.4);
    expect(launchConfig.emptyTraitChance).toBeLessThanOrEqual(0.5);

    const rng = seeded(2);
    const runs = 20000;
    const filled = Object.fromEntries(CATEGORIES.map((c) => [c, 0]));
    for (let i = 0; i < runs; i++) {
      for (const t of rollRandomTraits(pools, launchConfig.emptyTraitChance, rng)) filled[t.category]++;
    }
    for (const category of CATEGORIES) {
      const emptyRate = 1 - filled[category] / runs;
      expect(emptyRate).toBeGreaterThan(0.4);
      expect(emptyRate).toBeLessThan(0.5);
    }
  });

  it('reaches every trait in a pool', () => {
    const rng = seeded(3);
    const seen = new Set<string>();
    for (let i = 0; i < 5000; i++) {
      for (const t of rollRandomTraits(pools, 0.45, rng)) seen.add(t.id);
    }
    expect(seen.size).toBe(CATEGORIES.length * 20);
  });

  it('skips empty pools and handles the edge chances', () => {
    expect(rollRandomTraits([[], ['a']], 0)).toEqual(['a']);
    expect(rollRandomTraits([['a'], ['b']], 1)).toEqual([]);
    expect(rollRandomTraits([['a', 'b']], 0, () => 0.9999999999)).toEqual(['b']);
  });
});
