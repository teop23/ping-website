/**
 * Rolls a random character: for each category, either leave it empty or pick
 * exactly one trait from it. Never two traits from the same category, which is
 * what keeps a shuffled PING readable - two hats or two held items stacked on
 * the same spot is the clutter this exists to avoid.
 *
 * `pools` is one array per category. Empty pools are skipped without consuming
 * a roll. `rng` is injectable so the tests can pin the outcome. `clashes` says
 * which two traits must not be rolled together (see makeClashCheck); a pick is
 * drawn only from the traits that clash with nothing already picked, and a
 * category where everything clashes stays empty.
 *
 * Mirrored as `rollRandomTraits` in functions/_lib.ts for the Cloudflare
 * bundle; functions/_lib.test.ts runs both against the same seeded rng and
 * asserts they pick identically.
 */
export const rollRandomTraits = <T>(
  pools: ReadonlyArray<ReadonlyArray<T>>,
  emptyChance: number,
  rng: () => number = Math.random,
  clashes: (a: T, b: T) => boolean = () => false
): T[] => {
  const picked: T[] = [];
  for (const pool of pools) {
    if (pool.length === 0) continue;
    if (rng() < emptyChance) continue;
    const fits = pool.filter((trait) => !picked.some((other) => clashes(other, trait)));
    if (fits.length === 0) continue;
    picked.push(fits[Math.min(fits.length - 1, Math.floor(rng() * fits.length))]);
  }
  return picked;
};

/** `pairs` as in public/trait-clashes.json (scripts/generate-clashes.mjs):
 *  "<name>_<category>" -> keys it clashes with, each pair listed once. */
export type ClashPairs = Record<string, ReadonlyArray<string>>;

/** Turns the clash file into the `clashes` test rollRandomTraits takes. */
export const makeClashCheck = <T>(pairs: ClashPairs, keyOf: (trait: T) => string) => {
  const set = new Set<string>();
  for (const [a, others] of Object.entries(pairs)) for (const b of others) set.add(`${a}\n${b}`).add(`${b}\n${a}`);
  return (a: T, b: T): boolean => set.has(`${keyOf(a)}\n${keyOf(b)}`);
};

let clashPairs: Promise<ClashPairs> | null = null;

/** The random roll's clash pairs. A failed fetch rolls without them rather than
 *  breaking Randomize, and is retried on the next call. */
export const loadClashPairs = (): Promise<ClashPairs> =>
  (clashPairs ??= fetch('/trait-clashes.json')
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then((file: { pairs?: ClashPairs }) => file.pairs ?? {})
    .catch((error) => {
      console.error('Failed to load trait clashes:', error);
      clashPairs = null;
      return {};
    }));
