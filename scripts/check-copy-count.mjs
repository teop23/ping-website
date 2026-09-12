import { readFile } from 'fs/promises';
import path from 'path';

/**
 * The trait count used to be quoted as a hand-typed literal in 4 files
 * (hero, roadmap, meta tags, OG banner) that couldn't read the manifest at
 * runtime, and it drifted (it sat at 176 for a while after the library grew
 * to 239). That's fixed structurally now: src/utils/constants.ts and
 * functions/api/og/banner.png.tsx import public/traits-manifest.json
 * directly, and index.html gets the count injected at build time from the
 * same manifest by the injectLaunchValues Vite plugin (vite.config.ts) via
 * an __TRAIT_COUNT__ placeholder.
 *
 * This script is the regression guard for that structure, in two modes:
 *
 *   node scripts/check-copy-count.mjs
 *     Pre-build: fails if any of the files that used to hardcode the count
 *     have a hand-typed number again instead of the placeholder/derivation.
 *     Runs in `prebuild`, before the manifest necessarily reflects the final
 *     trait set for this build.
 *
 *   node scripts/check-copy-count.mjs --post-build
 *     Post-build: fails if dist/index.html doesn't contain the real count
 *     (i.e. the placeholder was left unreplaced, or is stale). Runs in
 *     `postbuild`, after vite build and after the manifest is final.
 */
const STALE_COUNT_PATTERN = /\bTRAIT_COUNT\s*=\s*\d+|\b\d{2,4}\s+traits\b/;

const SOURCE_FILES_MUST_NOT_HARDCODE = [
  'src/pages/Home.tsx',
  'src/utils/constants.ts',
  'functions/api/og/banner.png.tsx',
];

const args = process.argv.slice(2);
const postBuild = args.includes('--post-build');
const flag = args.indexOf('--expect');
let expected;
if (flag >= 0) {
  expected = Number(args[flag + 1]);
} else {
  const manifest = JSON.parse(await readFile(path.resolve('public/traits-manifest.json'), 'utf8'));
  expected = manifest.traits.length;
}

const errors = [];

if (postBuild) {
  // The one place the count is still text, not a module import: verify the
  // build-time token replacement actually happened and produced the right
  // number.
  const distPath = path.resolve('dist/index.html');
  const html = await readFile(distPath, 'utf8').catch(() => null);
  if (html === null) {
    errors.push(`${distPath}: not found - run \`npm run build\` first`);
  } else if (html.includes('__TRAIT_COUNT__')) {
    errors.push('dist/index.html: __TRAIT_COUNT__ placeholder was never replaced');
  } else {
    const matches = [...html.matchAll(/(\d{2,4})\s+traits\b/g)].map((m) => Number(m[1]));
    if (matches.length === 0) {
      errors.push('dist/index.html: found no "<n> traits" text after build');
    } else if (matches.some((n) => n !== expected)) {
      errors.push(`dist/index.html: says ${[...new Set(matches)].join('/')} traits, library has ${expected}`);
    }
  }
} else {
  // Pre-build: guard against a literal count creeping back into the files
  // that are supposed to derive it from the manifest instead.
  for (const file of SOURCE_FILES_MUST_NOT_HARDCODE) {
    const text = await readFile(path.resolve(file), 'utf8');
    if (STALE_COUNT_PATTERN.test(text)) {
      errors.push(`${file}: has a hardcoded trait count again - it should derive TRAIT_COUNT from public/traits-manifest.json`);
    }
  }
  // index.html should carry the placeholder, not a number, at source level.
  const indexHtml = await readFile(path.resolve('index.html'), 'utf8');
  if (!indexHtml.includes('__TRAIT_COUNT__')) {
    errors.push('index.html: missing the __TRAIT_COUNT__ placeholder - did someone hardcode a number instead?');
  }
  if (STALE_COUNT_PATTERN.test(indexHtml.replace(/__TRAIT_COUNT__/g, ''))) {
    errors.push('index.html: has a hardcoded trait count alongside (or instead of) the __TRAIT_COUNT__ placeholder');
  }
}

if (errors.length > 0) {
  console.error(`\nTrait count copy check failed (${errors.length}):`);
  errors.forEach((e) => console.error(`  x ${e}`));
  process.exit(1);
}
console.log(
  postBuild
    ? `dist/index.html correctly quotes ${expected} traits.`
    : `No hardcoded trait counts found; the library currently has ${expected}.`
);
