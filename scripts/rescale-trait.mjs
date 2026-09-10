import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { basename } from 'path';
import { decodePng, encodeRgba, resizeRgba } from './lib/png.mjs';

/**
 * Scale a trait's artwork in place on its own canvas, about an anchor, so a
 * too-small item can be grown without re-authoring it.
 *
 *   node scripts/rescale-trait.mjs --factor 1.45 --anchor bottom trait-a.png [trait-b.png ...]
 *
 * anchor: `bottom` keeps the art's bottom-center fixed (something standing
 * on the ground - accessories), `center` keeps its centroid fixed. Output
 * goes to .trait-work/<same name>. Canvas size is unchanged; anything that
 * would leave the canvas is reported and clipped.
 *
 * Used for the 2026-09-10 accessory batch, which measured at ~60% of the
 * size of the library's existing ground-level accessories (stove, washing
 * machine) once composited side by side.
 */
const args = process.argv.slice(2);
let factor = 1.5, anchor = 'bottom';
const files = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--factor') factor = Number(args[++i]);
  else if (args[i] === '--anchor') anchor = args[++i];
  else files.push(args[i]);
}
mkdirSync('.trait-work', { recursive: true });

for (const file of files) {
  const img = decodePng(readFileSync(file));
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {
      if (img.data[(y * img.width + x) * 4 + 3] < 8) continue;
      x0 = Math.min(x0, x); x1 = Math.max(x1, x);
      y0 = Math.min(y0, y); y1 = Math.max(y1, y);
    }
  }
  const w = x1 - x0 + 1, h = y1 - y0 + 1;
  const crop = { width: w, height: h, data: Buffer.alloc(w * h * 4) };
  for (let y = 0; y < h; y++) {
    crop.data.set(img.data.subarray(((y0 + y) * img.width + x0) * 4, ((y0 + y) * img.width + x1 + 1) * 4), y * w * 4);
  }
  const nw = Math.round(w * factor), nh = Math.round(h * factor);
  const scaled = resizeRgba(crop, nw, nh);

  const acx = x0 + w / 2;
  const acy = anchor === 'bottom' ? y1 : y0 + h / 2;
  const dx = Math.round(acx - nw / 2);
  const dy = Math.round(anchor === 'bottom' ? acy - nh : acy - nh / 2);

  const out = { width: img.width, height: img.height, data: Buffer.alloc(img.width * img.height * 4) };
  let clipped = false;
  for (let y = 0; y < nh; y++) {
    const cy = dy + y;
    if (cy < 0 || cy >= out.height) { clipped = true; continue; }
    for (let x = 0; x < nw; x++) {
      const cx = dx + x;
      if (cx < 0 || cx >= out.width) { clipped = true; continue; }
      out.data.set(scaled.data.subarray((y * nw + x) * 4, (y * nw + x) * 4 + 4), (cy * out.width + cx) * 4);
    }
  }
  const outPath = `.trait-work/${basename(file)}`;
  writeFileSync(outPath, encodeRgba(out));
  console.log(`${basename(file)}: ${w}x${h} -> ${nw}x${nh} at (${dx},${dy})${clipped ? '  CLIPPED at canvas edge' : ''}`);
}
