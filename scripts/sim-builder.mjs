// Builder simulator: base at 1.4x centered on the 599 canvas, trait filling it.
// Matches a real builder capture to a mean diff of 0.69/255. Usage:
//   node scripts/sim-builder.mjs out.png [public/traits/trait-x_cat.png]
import { readFileSync, writeFileSync } from 'fs';
import { decodePng, encodeRgba, resizeRgba } from './lib/png.mjs';
export const C = 599;
const baseSrc = decodePng(readFileSync('public/ping.png'));
const bs = Math.round(C * 1.4), off = Math.round((C - bs) / 2);
const base = resizeRgba(baseSrc, bs, bs);
const over = (dst, src, dx, dy) => {
  for (let y = 0; y < src.height; y++) { const cy = dy + y; if (cy < 0 || cy >= dst.height) continue;
    for (let x = 0; x < src.width; x++) { const cx = dx + x; if (cx < 0 || cx >= dst.width) continue;
      const s = (y * src.width + x) * 4, a = src.data[s + 3] / 255; if (a <= 0) continue;
      const d = (cy * dst.width + cx) * 4;
      for (let c = 0; c < 3; c++) dst.data[d + c] = Math.round(src.data[s + c] * a + dst.data[d + c] * (1 - a)); } }
};
export const sim = (traitImg) => {
  const cv = { width: C, height: C, data: Buffer.alloc(C * C * 4, 255) };
  over(cv, base, off, off);
  if (traitImg) over(cv, resizeRgba(traitImg, C, C), 0, 0);
  return cv;
};
if (process.argv[1].endsWith('sim-builder.mjs')) {
  const [out, t] = process.argv.slice(2);
  writeFileSync(out, encodeRgba(sim(t ? decodePng(readFileSync(t)) : null)));
}
