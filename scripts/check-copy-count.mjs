import { readFile } from 'fs/promises';
import path from 'path';

/**
 * The trait count used to be quoted as a hand-typed literal in 4 files
 * (hero, roadmap, meta tags, OG banner) that couldn't read the manifest at
 * runtime, and it drifted (it sat at 176 for a while after the library grew
 * to 239).
 *
 * Two different fixes apply now, depending on where the copy is read:
 *
 *   ON THE PAGE (src/pages/Home.tsx, src/utils/constants.ts) the count is
 *   still quoted, but derived from public/traits-manifest.json at build
 *   time. A visitor looking at the live site sees a true number.
 *
 *   IN SHARE METADATA (index.html's meta/OG/twitter descriptions, and the
 *   OG banner image) the count is GONE, deliberately. A share card is
 *   cached by every platform that scrapes it and re-shared for months; a
 *   number that changes every time a trait is added is guaranteed to be
 *   wrong out there no matter how correctly we derive it at build time. The
 *   copy says something durable instead.
 *
 * This script guards both halves, in two modes:
 *
 *   node scripts/check-copy-count.mjs
 *     Pre-build: fails if a hand-typed count reappears in a file that should
 *     derive it, or if a count reappears anywhere in the share metadata.
 *
 *   node scripts/check-copy-count.mjs --post-build
 *     Post-build: fails if dist/index.html ships a trait count or an
 *     unreplaced placeholder.
 */
const STALE_COUNT_PATTERN = /\bTRAIT_COUNT\s*=\s*\d+|\b\d{2,4}\s+traits\b/;

// These quote the count on the page, but must derive it from the manifest.
const SOURCE_FILES_MUST_NOT_HARDCODE = ['src/pages/Home.tsx', 'src/utils/constants.ts'];

// These must not mention a trait count at all - see the note above about
// share cards outliving the number they quote.
const FILES_MUST_NOT_MENTION_COUNT = ['index.html', 'functions/api/og/banner.png.tsx'];

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

// --file lets the tests point post-build mode at a fixture instead of the
// real build output.
const fileFlag = args.indexOf('--file');
const distPath = path.resolve(fileFlag >= 0 ? args[fileFlag + 1] : 'dist/index.html');
const distName = path.relative(process.cwd(), distPath).split(path.sep).join('/');

if (postBuild) {
  // Verify the build-time token replacement happened, and that no trait
  // count made it into the share metadata.
  const html = await readFile(distPath, 'utf8').catch(() => null);
  if (html === null) {
    errors.push(`${distPath}: not found - run \`npm run build\` first`);
  } else {
    const leftover = html.match(/__[A-Z_]+__/g);
    if (leftover) {
      errors.push(
        `${distName}: placeholder(s) never replaced: ${[...new Set(leftover)].join(', ')}`
      );
    }
    // Only the <head> matters here - that's what scrapers read. The app's own
    // rendered copy may legitimately quote a live count.
    const head = html.slice(0, html.indexOf('</head>'));
    const counts = [...head.matchAll(/(\d{2,4})\s+traits\b/g)].map((m) => m[1]);
    if (counts.length > 0) {
      errors.push(
        `${distName}: share metadata quotes a trait count (${[...new Set(counts)].join('/')}). ` +
          'Share cards get cached and re-shared for months, so the number goes stale out there.'
      );
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
  // Share metadata must stay count-free, derived or not.
  for (const file of FILES_MUST_NOT_MENTION_COUNT) {
    const text = await readFile(path.resolve(file), 'utf8');
    if (/__TRAIT_COUNT__/.test(text) || /\d{2,4}\s+traits/.test(text) || /\{\s*TRAIT_COUNT\s*\}\s*traits/.test(text)) {
      errors.push(
        `${file}: mentions a trait count. Share copy must not quote it - the card outlives the number.`
      );
    }
  }
}

if (errors.length > 0) {
  console.error(`\nTrait count copy check failed (${errors.length}):`);
  errors.forEach((e) => console.error(`  x ${e}`));
  process.exit(1);
}
console.log(
  postBuild
    ? `${distName}: placeholders replaced, share metadata is count-free.`
    : `Page copy derives the count, share copy omits it; the library currently has ${expected}.`
);
