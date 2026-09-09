/**
 * Renders the token image: the full PING character on the exact Robinhood
 * lime brand fill, for submission to Pons.
 *
 * Not public/base-ping.png - that file claims an alpha channel (colour type 6)
 * but is fully opaque white behind the character, so compositing it onto lime
 * would leave a white box. public/ping.png is the real transparent source; it
 * is just a lot smaller than its own 1024px canvas, so this recentres and
 * enlarges it rather than compositing it at native scale.
 *
 * Reuses scripts/lib/png.mjs so the composite gets the same treatment as the
 * favicon: resampling happens in linear light with premultiplied alpha, which
 * is what keeps the antialiased outline from picking up a halo when it is
 * scaled.
 */

import { readFileSync, writeFileSync } from 'fs';
import { decodePng, encodeRgba, resizeRgba } from './lib/png.mjs';

const SRC = 'public/ping.png';
const OUT = 'public/token-image.png';
const SIZE = 1024;

/** How much of the frame the character occupies. Pons and wallet UIs tend to
 *  mask token images into a circle, so this stays generous on padding rather
 *  than bleeding to the edge the way the tightest favicon crop does. */
const FILL = 0.8;

/** #CCFF00 - Robinhood lime, the same value as --brand. */
const LIME = [0xcc, 0xff, 0x00];

const src = decodePng(readFileSync(SRC));

// Tight bounding box of the actual artwork within its padded canvas.
let [x0, y0, x1, y1] = [src.width, src.height, -1, -1];
for (let y = 0; y < src.height; y++) {
  for (let x = 0; x < src.width; x++) {
    if (src.data[(y * src.width + x) * 4 + 3] > 8) {
      if (x < x0) x0 = x;
      if (x > x1) x1 = x;
      if (y < y0) y0 = y;
      if (y > y1) y1 = y;
    }
  }
}
const box = { x: x0, y: y0, w: x1 - x0 + 1, h: y1 - y0 + 1 };
console.log(`content bbox ${box.w}x${box.h} at ${box.x},${box.y}`);

// Crop to the bounding box, pad to square, then resize that square up to the
// target fill size - resizeRgba handles both directions correctly.
const side = Math.max(box.w, box.h);
const cropped = { width: side, height: side, data: Buffer.alloc(side * side * 4) };
const offX = box.x - Math.floor((side - box.w) / 2);
const offY = box.y - Math.floor((side - box.h) / 2);

for (let y = 0; y < side; y++) {
  for (let x = 0; x < side; x++) {
    const sx = offX + x;
    const sy = offY + y;
    if (sx < 0 || sy < 0 || sx >= src.width || sy >= src.height) continue;
    const from = (sy * src.width + sx) * 4;
    const to = (y * side + x) * 4;
    cropped.data[to] = src.data[from];
    cropped.data[to + 1] = src.data[from + 1];
    cropped.data[to + 2] = src.data[from + 2];
    cropped.data[to + 3] = src.data[from + 3];
  }
}

const inner = Math.round(SIZE * FILL);
const character = resizeRgba(cropped, inner, inner);
const pad = Math.round((SIZE - inner) / 2);

const out = Buffer.alloc(SIZE * SIZE * 4);
for (let i = 0; i < SIZE * SIZE; i++) {
  out[i * 4] = LIME[0];
  out[i * 4 + 1] = LIME[1];
  out[i * 4 + 2] = LIME[2];
  out[i * 4 + 3] = 255;
}

// Straight alpha "over" composite: character over the lime fill. No further
// resampling happens here, so there is no gamma subtlety to get wrong.
for (let y = 0; y < inner; y++) {
  for (let x = 0; x < inner; x++) {
    const s = (y * inner + x) * 4;
    const a = character.data[s + 3] / 255;
    if (a <= 0) continue;
    const o = ((y + pad) * SIZE + (x + pad)) * 4;
    out[o] = Math.round(character.data[s] * a + out[o] * (1 - a));
    out[o + 1] = Math.round(character.data[s + 1] * a + out[o + 1] * (1 - a));
    out[o + 2] = Math.round(character.data[s + 2] * a + out[o + 2] * (1 - a));
  }
}

const png = encodeRgba({ width: SIZE, height: SIZE, data: out }, 9);
writeFileSync(OUT, png);
console.log(`${OUT}  ${SIZE}x${SIZE}  ${(png.length / 1024).toFixed(0)}KB`);
