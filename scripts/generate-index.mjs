import { mkdir, readdir, readFile, stat, writeFile } from 'fs/promises';
import path from 'path';
import { decodePng, encodeRgba, readPngSize, resizeRgba } from './lib/png.mjs';

/**
 * Builds the trait manifest from public/traits and validates the assets.
 *
 * The trait system used to be a filename convention parsed independently in ten
 * different files, with no check that an added PNG actually conformed. A badly
 * named or malformed asset shipped silently and only showed up as a missing
 * layer in the builder or the image API.
 *
 * This emits two files:
 *   traits-index.json     category -> [name]. The shape the app and the
 *                         Pages Functions already consume. Unchanged.
 *   traits-manifest.json  the full picture: render order, UI order, labels,
 *                         and per-trait dimensions.
 *
 * It also emits render-sized copies of the art under public/traits-512 and
 * public/ping-768.png. The image Functions composite from those, not from the
 * masters. See RENDER_PX below for why that is not an optimisation.
 *
 * Hard failures stop the build. Soft issues are reported and let it through,
 * because the existing library predates the rules.
 */

// UI order: how the category tabs are listed in the builder.
const CATEGORIES = [
  { id: 'aura', label: 'Aura' },
  { id: 'head', label: 'Head' },
  { id: 'face', label: 'Face' },
  { id: 'mouth', label: 'Mouth' },
  { id: 'body', label: 'Body' },
  { id: 'right_hand', label: 'Right Hand' },
  { id: 'left_hand', label: 'Left Hand' },
  { id: 'accessory', label: 'Accessory' },
];

// Paint order, back to front. Deliberately NOT the UI order: body and face go
// down before head so hats sit on top of hair and masks.
const RENDER_ORDER = [
  'aura',
  'body',
  'face',
  'mouth',
  'head',
  'right_hand',
  'left_hand',
  'accessory',
];

/** Traits below this render soft when the API scales them up. */
const MIN_RECOMMENDED_PX = 512;

/**
 * The size the image API actually draws a trait at, and therefore the size it
 * should be handed.
 *
 * This is a correctness fix, not a saving. Decode cost in a Worker scales with
 * SOURCE pixels, not output size: compositing eight ~1147px masters plus the
 * base was enough to exhaust the isolate's CPU budget partway through the
 * response. Because the 200 and its headers had already been flushed, the
 * failure surfaced as a valid 200 with a zero-length body rather than an error
 * - intermittently, worse the more traits were selected, and never
 * reproducibly in `wrangler pages dev`, which has no CPU limit. Measured at 8
 * traits it failed 3/6 through the custom domain and 5/6 direct to pages.dev.
 *
 * Masters stay in public/traits and remain the source of truth for the editor
 * and for any future re-render at a larger size.
 */
const RENDER_PX = 512;

/** The base is drawn at 512 * 1.4; give it enough pixels to not be upscaled. */
const BASE_RENDER_PX = 768;

const TRAITS_DIR = path.resolve('public/traits');
const RENDER_DIR = path.resolve(`public/traits-${RENDER_PX}`);
const BASE_SRC = path.resolve('public/ping.png');
const BASE_OUT = path.resolve(`public/ping-${BASE_RENDER_PX}.png`);
const INDEX_OUT = path.resolve('public/traits-index.json');
const MANIFEST_OUT = path.resolve('public/traits-manifest.json');

/**
 * Rebuild a derived image only when it is missing or older than its source.
 * The whole library is ~14s from cold, which is fine in CI but tedious on every
 * local build.
 */
const isStale = async (source, derived) => {
  try {
    const [a, b] = await Promise.all([stat(source), stat(derived)]);
    return a.mtimeMs > b.mtimeMs;
  } catch {
    return true;
  }
};

const downscale = async (sourcePath, outPath, target) => {
  const image = decodePng(await readFile(sourcePath));
  // Never upscale: a 320px trait stays 320px rather than being inflated to 512
  // and pretending to detail it does not have.
  const size = Math.min(target, image.width);
  const resized = size === image.width ? image : resizeRgba(image, size, size);
  await writeFile(outPath, encodeRgba(resized));
  return size;
};

const categoryIds = CATEGORIES.map((c) => c.id);
const TRAIT_PATTERN = new RegExp(`^trait-(.+)_(${categoryIds.join('|')})$`);

const toLabel = (name) => name.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

const files = await readdir(TRAITS_DIR);

const traits = [];
const errors = [];
const warnings = [];
const seen = new Map();

for (const file of files.sort()) {
  if (!/\.png$/i.test(file)) {
    warnings.push(`${file}: not a .png, ignored`);
    continue;
  }

  const match = file.replace(/\.png$/i, '').match(TRAIT_PATTERN);
  if (!match) {
    errors.push(`${file}: does not match trait-<name>_<category>.png, or category is unknown`);
    continue;
  }

  const [, name, category] = match;
  const id = `${name}_${category}`;

  if (seen.has(id)) {
    errors.push(`${file}: duplicate trait id "${id}", already defined by ${seen.get(id)}`);
    continue;
  }
  seen.set(id, file);

  const buffer = await readFile(path.join(TRAITS_DIR, file));
  const size = readPngSize(buffer);

  if (!size) {
    errors.push(`${file}: not a readable PNG`);
    continue;
  }

  // Traits are layered over a square base, so a non-square one cannot register.
  if (size.width !== size.height) {
    errors.push(`${file}: must be square, got ${size.width}x${size.height}`);
    continue;
  }

  if (size.width < MIN_RECOMMENDED_PX) {
    warnings.push(
      `${file}: ${size.width}px is below the ${MIN_RECOMMENDED_PX}px minimum and will look soft when scaled up`
    );
  }

  traits.push({
    id,
    name,
    label: toLabel(name),
    category,
    file: `/traits/${file}`,
    renderFile: `/traits-${RENDER_PX}/${file}`,
    width: size.width,
    height: size.height,
    bytes: buffer.length,
  });
}

if (errors.length > 0) {
  console.error(`\nTrait validation failed with ${errors.length} error(s):`);
  errors.forEach((e) => console.error(`  x ${e}`));
  console.error('');
  process.exit(1);
}

// Legacy shape: category -> [name]. Still what the app loader and the image
// functions read, so it keeps working untouched.
const index = {};
for (const trait of traits) {
  (index[trait.category] ??= []).push(trait.name);
}

const manifest = {
  version: 1,
  generatedAt: new Date().toISOString(),
  renderOrder: RENDER_ORDER,
  categories: CATEGORIES.map((c) => ({
    ...c,
    count: traits.filter((t) => t.category === c.id).length,
  })),
  traits,
};

await writeFile(INDEX_OUT, JSON.stringify(index, null, 2));
await writeFile(MANIFEST_OUT, JSON.stringify(manifest, null, 2));

// --- render-sized art for the image Functions ---
await mkdir(RENDER_DIR, { recursive: true });

let rebuilt = 0;
for (const trait of traits) {
  const source = path.join(TRAITS_DIR, path.basename(trait.file));
  const derived = path.join(RENDER_DIR, path.basename(trait.file));
  if (!(await isStale(source, derived))) continue;
  await downscale(source, derived, RENDER_PX);
  rebuilt++;
}

if (await isStale(BASE_SRC, BASE_OUT)) {
  await downscale(BASE_SRC, BASE_OUT, BASE_RENDER_PX);
  rebuilt++;
}

console.log(
  rebuilt > 0
    ? `Rendered ${rebuilt} image(s) at <=${RENDER_PX}px into public/traits-${RENDER_PX}.`
    : `Render-sized art already current in public/traits-${RENDER_PX}.`
);

const sizes = new Set(traits.map((t) => t.width));
console.log(
  `Generated ${traits.length} traits across ${Object.keys(index).length} categories, ${sizes.size} distinct resolutions.`
);

if (warnings.length > 0) {
  console.warn(`${warnings.length} warning(s):`);
  warnings.forEach((w) => console.warn(`  ! ${w}`));
}
