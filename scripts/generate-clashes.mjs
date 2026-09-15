import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { decodePng, resizeRgba } from './lib/png.mjs';

/**
 * Builds public/trait-clashes.json: trait pairs the random roll must never put
 * together. The manual builder still allows them; only Randomize and
 * /api/image/random.png read this file.
 *
 * A random 750-PING audit found that most bad-looking shuffles were not a
 * broken trait but two fine traits drawn on the same spot: a held item on top
 * of an accessory, a party blower through a microphone, sayian-1's hair over
 * whatever the face slot holds. A trait edit cannot fix those without breaking
 * the trait on its own, so the roll avoids the pair instead.
 *
 * Two kinds of rule, both tuned by eye on contact sheets of sample pairs:
 *   - overlap rules, measured on the alpha of the render copies. They cover new
 *     art automatically, so this runs in prebuild after generate-index.mjs.
 *   - named rules, for clashes the overlap cannot tell apart from a fine
 *     stack (a cap over glasses overlaps as much as sayian-1 over glasses).
 *
 * Output: { pairs: { "<name>_<category>": ["<name>_<category>", ...] } }, each
 * unordered pair listed once, under the key that sorts first.
 */

const RES = 256;
const OPAQUE = 128;
/** Ignore specks: a few pixels of outline touching is not a clash. */
const MIN_PIXELS = 30;

const HANDS = ['right_hand', 'left_hand'];

/** Pixels to grow the second layer by before measuring: objects that touch
 *  read as stacked even with no overlap. */
const TOUCH = 6;

/** [categoryA, categoryB, test, grow?]; `n` is overlap pixels, `a`/`b` each layer's opaque pixels,
 *  `x`/`y` the two trait keys. */
const OVERLAP_RULES = [
  // Both sit beside PING at the same height, so even touching reads as clutter
  // (a fumo standing on a pet, a speaker on a fumo's head).
  ...HANDS.map((hand) => ['accessory', hand, ({ n }) => n >= 10, TOUCH]),
  // Something in the beak running under headphone cups, ear flaps, a santa
  // pompom or the clown nose. sayian-1's fringe and a mustache sit fine.
  ['mouth', 'head', ({ n, a, b, x, y }) =>
    n / Math.min(a, b) >= 0.1 && !x.startsWith('mustache-only_') && !y.startsWith('sayian-1_')],
  // Something in the beak crossing or touching a held item: a pipe over a
  // grenade, a party blower through a rifle, a wheat stalk on a can.
  ...HANDS.map((hand) => ['mouth', hand, ({ n }) => n >= 10, TOUCH]),
  // Hats and face gear only clash with a held item when it cuts well into them.
  ...HANDS.flatMap((hand) => [
    ['head', hand, ({ n, a, b }) => n / Math.min(a, b) >= 0.35],
    ['face', hand, ({ n, a, b }) => n / Math.min(a, b) >= 0.35],
  ]),
];

/** Full-face gear: anything drawn in the beak floats on top of the mask. */
const MASKS = ['mF-dOOM-mask', 'master-chief-helmet', 'helm-of-domination', 'doom-helmet'];

const NAMED_RULES = [
  // The fringe covers the right eye and whatever is on it.
  { a: 'sayian-1_head', category: 'face' },
  // Its spikes poke through every hat.
  { a: 'helm-of-domination_face', category: 'head' },
  ...MASKS.flatMap((mask) =>
    ['beard', 'fish-in-beak', 'mustache-only', 'pacifier'].map((mouth) => ({ a: `${mask}_face`, b: `${mouth}_mouth` }))
  ),
  ...['hello-kitty-mask', 'ski-mask'].flatMap((mask) =>
    ['fish-in-beak', 'mustache-only'].map((mouth) => ({ a: `${mask}_face`, b: `${mouth}_mouth` }))
  ),
];

const index = JSON.parse(await readFile('public/traits-index.json', 'utf8'));
const RENDER_DIR = path.resolve('public/traits-512');

const masks = new Map();
const maskOf = async (key) => {
  if (!masks.has(key)) {
    const image = decodePng(await readFile(path.join(RENDER_DIR, `trait-${key}.png`)));
    const { data } = image.width === RES ? image : resizeRgba(image, RES, RES);
    const opaque = [];
    const bits = new Uint8Array(RES * RES);
    for (let p = 0; p < RES * RES; p++) {
      if (data[p * 4 + 3] > OPAQUE) {
        opaque.push(p);
        bits[p] = 1;
      }
    }
    masks.set(key, { opaque, bits, grown: new Map() });
  }
  return masks.get(key);
};

const grow = (mask, radius) => {
  if (!mask.grown.has(radius)) {
    const out = new Uint8Array(RES * RES);
    for (const p of mask.opaque) {
      const x = p % RES;
      const y = (p - x) / RES;
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          const X = x + dx;
          const Y = y + dy;
          if (X >= 0 && Y >= 0 && X < RES && Y < RES && dx * dx + dy * dy <= radius * radius) out[Y * RES + X] = 1;
        }
      }
    }
    mask.grown.set(radius, out);
  }
  return mask.grown.get(radius);
};

const overlap = async (keyA, keyB, radius = 0) => {
  const [a, b] = await Promise.all([maskOf(keyA), maskOf(keyB)]);
  let n = 0;
  if (radius > 0) {
    const bits = grow(b, radius);
    for (const p of a.opaque) n += bits[p];
  } else {
    const [small, large] = a.opaque.length <= b.opaque.length ? [a, b] : [b, a];
    for (const p of small.opaque) n += large.bits[p];
  }
  return { n, a: a.opaque.length, b: b.opaque.length };
};

const keysIn = (category) => (index[category] ?? []).map((name) => `${name}_${category}`);
const allKeys = new Set(Object.keys(index).flatMap(keysIn));
const exists = (key) => allKeys.has(key);

const pairs = new Set();
const add = (x, y) => pairs.add(x < y ? `${x}\n${y}` : `${y}\n${x}`);

for (const [catA, catB, test, radius = 0] of OVERLAP_RULES) {
  for (const x of keysIn(catA)) {
    for (const y of keysIn(catB)) {
      const o = await overlap(x, y, radius);
      if ((radius > 0 || o.n >= MIN_PIXELS) && test({ ...o, x, y })) add(x, y);
    }
  }
}

const missing = [];
for (const rule of NAMED_RULES) {
  if (!exists(rule.a)) {
    missing.push(rule.a);
    continue;
  }
  if (rule.b) {
    if (exists(rule.b)) add(rule.a, rule.b);
    else missing.push(rule.b);
    continue;
  }
  for (const y of keysIn(rule.category)) {
    if ((await overlap(rule.a, y)).n >= MIN_PIXELS) add(rule.a, y);
  }
}
if (missing.length > 0) {
  // A renamed or removed trait: the rule is dead, not the build.
  console.warn(`generate-clashes: named rules reference missing traits: ${[...new Set(missing)].join(', ')}`);
}

const grouped = {};
for (const pair of [...pairs].sort()) {
  const [x, y] = pair.split('\n');
  (grouped[x] ??= []).push(y);
}

await writeFile('public/trait-clashes.json', JSON.stringify({ pairs: grouped }, null, 1));
console.log(`generate-clashes: ${pairs.size} pairs the random roll avoids.`);
