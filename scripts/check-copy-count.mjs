import { readFile } from 'fs/promises';
import path from 'path';

/**
 * The trait count is quoted in copy that can't read the manifest at runtime
 * (static meta tags, the OG banner Function, the hero, the roadmap). Each of
 * those sat at 176 while the library grew to 239. This runs after
 * generate-index.mjs in `prebuild` and fails the build if any "<n> traits" in
 * those files disagrees with the manifest - nothing else keeps them honest.
 *
 *   node scripts/check-copy-count.mjs            # expect = manifest count
 *   node scripts/check-copy-count.mjs --expect 5 # for testing the check
 */
const COPY_FILES = ['src/pages/Home.tsx', 'src/utils/constants.ts', 'index.html', 'functions/api/og/banner.png.tsx'];

const args = process.argv.slice(2);
const flag = args.indexOf('--expect');
let expected;
if (flag >= 0) {
  expected = Number(args[flag + 1]);
} else {
  const manifest = JSON.parse(await readFile(path.resolve('public/traits-manifest.json'), 'utf8'));
  expected = manifest.traits.length;
}

const errors = [];
let seen = 0;
for (const file of COPY_FILES) {
  const text = await readFile(path.resolve(file), 'utf8');
  for (const m of text.matchAll(/TRAIT_COUNT = (\d+)|(\d{2,4}) traits\b/g)) {
    seen++;
    const n = Number(m[1] ?? m[2]);
    if (n !== expected) errors.push(`${file}: copy says ${n} traits, library has ${expected}`);
  }
}

if (seen === 0) {
  console.error('check-copy-count: found no trait counts in copy; the pattern or the copy changed');
  process.exit(1);
}
if (errors.length > 0) {
  console.error(`\nTrait count in copy is stale (${errors.length}):`);
  errors.forEach((e) => console.error(`  x ${e}`));
  process.exit(1);
}
console.log(`Copy quotes ${expected} traits in ${seen} place(s); matches the library.`);
