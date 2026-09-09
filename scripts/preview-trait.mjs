import { decodePng, encodeRgba, resizeRgba } from './lib/png.mjs';
import { readFileSync, writeFileSync } from 'fs';

/**
 * Composite one or more candidate trait PNGs against public/ping.png and
 * write the result, without deploying or running wrangler.
 *
 *   node scripts/preview-trait.mjs out.png path/to/trait-a.png [trait-b.png ...]
 *   node scripts/preview-trait.mjs --aura out.png path/to/trait-aura.png
 *
 * Mirrors functions/api/image/custom.png.tsx's square-card geometry exactly
 * (base drawn at 1.4x and centered, traits filling the full canvas), so a
 * preview made with this matches what the live renderer actually produces -
 * verified against a real `wrangler pages dev` render, not just eyeballed.
 *
 * `--aura` paints the given trait(s) BEFORE the base instead of after.
 * Confirmed against a real render that this is the live paint order for
 * `aura`: the base character sits in front of it, which is what lets an aura
 * layer be drawn as a full glow with no character cutout - the base's own
 * opacity is what hides the middle. Every other category paints after the
 * base and needs no flag.
 */
const args = process.argv.slice(2);
const auraMode = args[0] === '--aura';
const rest = auraMode ? args.slice(1) : args;
const [outPath, ...traitPaths] = rest;

const CANVAS = 512;
const BASE_SCALE = 1.4;

const baseSrc = decodePng(readFileSync('public/ping.png'));
const baseSize = CANVAS * BASE_SCALE;
const base = resizeRgba(baseSrc, Math.round(baseSize), Math.round(baseSize));
const baseOff = Math.round((CANVAS - baseSize) / 2);

const canvas = { width: CANVAS, height: CANVAS, data: Buffer.alloc(CANVAS * CANVAS * 4) };

const over = (dst, src, dx, dy) => {
  for (let y = 0; y < src.height; y++) {
    const cy = dy + y;
    if (cy < 0 || cy >= dst.height) continue;
    for (let x = 0; x < src.width; x++) {
      const cx = dx + x;
      if (cx < 0 || cx >= dst.width) continue;
      const s = (y * src.width + x) * 4;
      const a = src.data[s + 3] / 255;
      if (a <= 0) continue;
      const d = (cy * dst.width + cx) * 4;
      for (let c = 0; c < 3; c++) dst.data[d + c] = Math.round(src.data[s + c] * a + dst.data[d + c] * (1 - a));
      dst.data[d + 3] = Math.round((a + (dst.data[d + 3] / 255) * (1 - a)) * 255);
    }
  }
};

const paintTraits = () => {
  for (const file of traitPaths) {
    const traitSrc = decodePng(readFileSync(file));
    const trait = resizeRgba(traitSrc, CANVAS, CANVAS);
    over(canvas, trait, 0, 0);
  }
};

if (auraMode) paintTraits();
over(canvas, base, baseOff, baseOff);
if (!auraMode) paintTraits();

writeFileSync(outPath, encodeRgba(canvas));
console.log('wrote', outPath);
