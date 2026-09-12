import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { basename } from 'path';
import { decodePng, encodeRgba } from './lib/png.mjs';

/**
 * Translate a trait's artwork by (dx,dy) on its own canvas, without scaling
 * or re-authoring it. Companion to rescale-trait.mjs, which only scales
 * about an anchor - this is for the plain "shift it a few px onto the
 * flipper" case, where the shape and size are already right and only the
 * position is off.
 *
 *   node scripts/shift-trait.mjs --dx -20 --dy 0 trait-a.png [trait-b.png ...]
 *   node scripts/shift-trait.mjs --dx -20 --dy 0 --out-dir .trait-work/fixflipper trait-a.png
 *
 * Output defaults to .trait-work/<same name> (never public/traits/, so the
 * live library is never touched by this tool); pass --out-dir to change it.
 * Canvas size is unchanged; anything that would leave the canvas is reported
 * and clipped, same convention as rescale-trait.mjs.
 */
const args = process.argv.slice(2);
let dx = 0, dy = 0, outDir = '.trait-work';
const files = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--dx') dx = Number(args[++i]);
  else if (args[i] === '--dy') dy = Number(args[++i]);
  else if (args[i] === '--out-dir') outDir = args[++i];
  else files.push(args[i]);
}
mkdirSync(outDir, { recursive: true });

for (const file of files) {
  const img = decodePng(readFileSync(file));
  const out = { width: img.width, height: img.height, data: Buffer.alloc(img.width * img.height * 4) };
  let clipped = false;
  for (let y = 0; y < img.height; y++) {
    const cy = y + dy;
    if (cy < 0 || cy >= out.height) { if (hasOpaqueRow(img, y)) clipped = true; continue; }
    for (let x = 0; x < img.width; x++) {
      const a = img.data[(y * img.width + x) * 4 + 3];
      const cx = x + dx;
      if (cx < 0 || cx >= out.width) { if (a > 0) clipped = true; continue; }
      out.data.set(img.data.subarray((y * img.width + x) * 4, (y * img.width + x) * 4 + 4), (cy * out.width + cx) * 4);
    }
  }
  const outPath = `${outDir}/${basename(file)}`;
  writeFileSync(outPath, encodeRgba(out));
  console.log(`${basename(file)}: shifted by (${dx},${dy}) -> ${outPath}${clipped ? '  CLIPPED at canvas edge' : ''}`);
}

function hasOpaqueRow(img, y) {
  for (let x = 0; x < img.width; x++) if (img.data[(y * img.width + x) * 4 + 3] > 0) return true;
  return false;
}
