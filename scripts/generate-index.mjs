import { readdir, readFile, writeFile } from 'fs/promises';
import path from 'path';

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

const TRAITS_DIR = path.resolve('public/traits');
const INDEX_OUT = path.resolve('public/traits-index.json');
const MANIFEST_OUT = path.resolve('public/traits-manifest.json');

const categoryIds = CATEGORIES.map((c) => c.id);
const TRAIT_PATTERN = new RegExp(`^trait-(.+)_(${categoryIds.join('|')})$`);

/** Dimensions straight from the PNG IHDR chunk. No decode, no dependency. */
const readPngSize = (buffer) => {
  if (buffer.length < 24 || buffer.slice(1, 4).toString() !== 'PNG') return null;
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
};

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

const sizes = new Set(traits.map((t) => t.width));
console.log(
  `Generated ${traits.length} traits across ${Object.keys(index).length} categories, ${sizes.size} distinct resolutions.`
);

if (warnings.length > 0) {
  console.warn(`${warnings.length} warning(s):`);
  warnings.forEach((w) => console.warn(`  ! ${w}`));
}
