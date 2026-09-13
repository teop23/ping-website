/**
 * Rolls a random character: for each category, either leave it empty or pick
 * exactly one trait from it. Never two traits from the same category, which is
 * what keeps a shuffled PING readable - two hats or two held items stacked on
 * the same spot is the clutter this exists to avoid.
 *
 * `pools` is one array per category. Empty pools are skipped without consuming
 * a roll. `rng` is injectable so the tests can pin the outcome.
 *
 * Mirrored as `rollRandomTraits` in functions/_lib.ts for the Cloudflare
 * bundle; randomCharacter.test.ts runs both against the same seeded rng and
 * asserts they pick identically.
 */
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
