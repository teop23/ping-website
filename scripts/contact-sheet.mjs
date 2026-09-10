import { readFileSync, writeFileSync } from 'fs';
import { basename } from 'path';
import { decodePng, encodeRgba, resizeRgba } from './lib/png.mjs';

/**
 * Contact sheet: every given trait composited over the real base at the
 * renderer's actual 512px geometry (base at 1.4x, centered; aura painted
 * behind, everything else in front), tiled cols x rows per output image.
 *
 *   node scripts/contact-sheet.mjs out 4 3 public/traits/trait-*_mouth.png
 *   -> out-0.png, out-1.png, ...
 *
 * This is the check that found the 2026-09-10 batch's scale misses: a
 * whole category side by side with a few originals, at the size people
 * actually see. preview-trait.mjs shows one trait at master resolution,
 * which hides exactly those defects.
 */
const [outPrefix, colsS, rowsS, ...files] = process.argv.slice(2);
const cols = +colsS, rows = +rowsS;
const CANVAS = 512, BASE_SCALE = 1.4;
const baseSrc = decodePng(readFileSync('public/ping.png'));
const baseSize = CANVAS * BASE_SCALE;
const base = resizeRgba(baseSrc, Math.round(baseSize), Math.round(baseSize));
const baseOff = Math.round((CANVAS - baseSize) / 2);

const over = (dst, src, dx, dy) => {
  for (let y = 0; y < src.height; y++) {
    const cy = dy + y; if (cy < 0 || cy >= dst.height) continue;
    for (let x = 0; x < src.width; x++) {
      const cx = dx + x; if (cx < 0 || cx >= dst.width) continue;
      const s = (y * src.width + x) * 4; const a = src.data[s + 3] / 255; if (a <= 0) continue;
      const d = (cy * dst.width + cx) * 4;
      for (let c = 0; c < 3; c++) dst.data[d + c] = Math.round(src.data[s + c] * a + dst.data[d + c] * (1 - a));
      dst.data[d + 3] = Math.round((a + (dst.data[d + 3] / 255) * (1 - a)) * 255);
    }
  }
};

const per = cols * rows;
for (let s = 0; s * per < files.length; s++) {
  const chunk = files.slice(s * per, (s + 1) * per);
  const sheet = { width: cols * CANVAS, height: rows * CANVAS, data: Buffer.alloc(cols * rows * CANVAS * CANVAS * 4) };
  for (let i = 0; i < sheet.width * sheet.height; i++) sheet.data.set([243, 241, 234, 255], i * 4);
  chunk.forEach((file, i) => {
    const cell = { width: CANVAS, height: CANVAS, data: Buffer.alloc(CANVAS * CANVAS * 4) };
    const trait = resizeRgba(decodePng(readFileSync(file)), CANVAS, CANVAS);
    const aura = file.endsWith('_aura.png');
    if (aura) over(cell, trait, 0, 0);
    over(cell, base, baseOff, baseOff);
    if (!aura) over(cell, trait, 0, 0);
    over(sheet, cell, (i % cols) * CANVAS, Math.floor(i / cols) * CANVAS);
    console.log(s, i, basename(file));
  });
  writeFileSync(`${outPrefix}-${s}.png`, encodeRgba(sheet));
}
