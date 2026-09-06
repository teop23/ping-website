/**
 * Regenerate the favicon set from public/ping.png onto the Robinhood lime.
 *
 * Pure Node: zlib is all a non-interlaced 8-bit PNG needs, and pulling in sharp
 * for a handful of one-off icons is not worth the dependency.
 *
 * Two things here are not obvious and both matter at 32px:
 *   - the character is composited onto the lime at full resolution and only
 *     then downsampled, so antialiased outline pixels blend against the colour
 *     they will actually sit on rather than leaving a white fringe;
 *   - the box filter averages in linear light, not sRGB. Averaging gamma
 *     encoded values thickens dark strokes, and this art is mostly dark stroke.
 */

import { deflateSync, inflateSync } from 'zlib';
import { readFileSync, writeFileSync } from 'fs';

const SRC = 'public/ping.png';

/** #CCFF00 - Robinhood lime, the same value as --brand. */
const LIME = [0xcc, 0xff, 0x00];

const OUT = [
  // Small sizes get a tighter crop: at 32px the padding is what kills it.
  { file: 'public/favicon-32.png', size: 32, fill: 0.86 },
  { file: 'public/favicon-180.png', size: 180, fill: 0.78 },
  { file: 'public/favicon-192.png', size: 192, fill: 0.78 },
  // Android masks this to a circle and can crop up to 20% off each edge, so
  // the character has to stay inside the safe zone.
  { file: 'public/favicon-512.png', size: 512, fill: 0.66 },
];

// ---- decode ---------------------------------------------------------------

const decode = (buf) => {
  const width = buf.readUInt32BE(16);
  const height = buf.readUInt32BE(20);
  if (buf[24] !== 8 || buf[25] !== 6 || buf[28] !== 0) {
    throw new Error('expected a non-interlaced 8-bit RGBA png');
  }

  const idat = [];
  for (let o = 8; o < buf.length; ) {
    const len = buf.readUInt32BE(o);
    if (buf.toString('ascii', o + 4, o + 8) === 'IDAT') {
      idat.push(buf.subarray(o + 8, o + 8 + len));
    }
    o += 12 + len;
  }

  const raw = inflateSync(Buffer.concat(idat));
  const stride = width * 4;
  const out = Buffer.alloc(height * stride);

  // Undo the per-scanline filters. Each row's filter byte is dropped.
  for (let y = 0; y < height; y++) {
    const filter = raw[y * (stride + 1)];
    const line = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1));
    for (let x = 0; x < stride; x++) {
      const a = x >= 4 ? out[y * stride + x - 4] : 0;
      const b = y > 0 ? out[(y - 1) * stride + x] : 0;
      const c = x >= 4 && y > 0 ? out[(y - 1) * stride + x - 4] : 0;
      let v = line[x];
      if (filter === 1) v += a;
      else if (filter === 2) v += b;
      else if (filter === 3) v += (a + b) >> 1;
      else if (filter === 4) {
        const p = a + b - c;
        const pa = Math.abs(p - a);
        const pb = Math.abs(p - b);
        const pc = Math.abs(p - c);
        v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
      } else if (filter !== 0) throw new Error(`bad filter ${filter}`);
      out[y * stride + x] = v & 0xff;
    }
  }

  return { width, height, data: out };
};

// ---- encode ---------------------------------------------------------------

const crcTable = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});

const crc32 = (buf) => {
  let c = 0xffffffff;
  for (const byte of buf) c = crcTable[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};

const chunk = (type, body) => {
  const head = Buffer.alloc(8);
  head.writeUInt32BE(body.length, 0);
  head.write(type, 4, 'ascii');
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([head.subarray(4), body])), 0);
  return Buffer.concat([head, body, crc]);
};

/** Opaque RGB out: the icons are full-bleed, so an alpha channel is dead weight. */
const encodeRgb = (width, height, rgb) => {
  const stride = width * 3;
  const raw = Buffer.alloc(height * (stride + 1));
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0; // filter: none. These are tiny and flat.
    rgb.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // colour type: truecolour

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
};

// ---- colour ---------------------------------------------------------------

const toLinear = new Float64Array(256);
for (let i = 0; i < 256; i++) {
  const c = i / 255;
  toLinear[i] = c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

const fromLinear = (v) => {
  const c = v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055;
  return Math.max(0, Math.min(255, Math.round(c * 255)));
};

// ---- build ----------------------------------------------------------------

const src = decode(readFileSync(SRC));

// Tight bounding box of anything actually drawn. The source is a 1024 square
// with the character sitting in the middle of a lot of nothing.
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

// Composite onto the lime once, at full resolution, in linear light.
const side = Math.max(box.w, box.h);
const flatW = side;
const flat = new Float64Array(side * side * 3);
const limeLin = LIME.map((c) => toLinear[c]);
const offX = box.x - Math.floor((side - box.w) / 2);
const offY = box.y - Math.floor((side - box.h) / 2);

for (let y = 0; y < side; y++) {
  for (let x = 0; x < side; x++) {
    const sx = offX + x;
    const sy = offY + y;
    const inside = sx >= 0 && sy >= 0 && sx < src.width && sy < src.height;
    const i = (y * side + x) * 3;

    if (!inside) {
      flat[i] = limeLin[0];
      flat[i + 1] = limeLin[1];
      flat[i + 2] = limeLin[2];
      continue;
    }

    const s = (sy * src.width + sx) * 4;
    const a = src.data[s + 3] / 255;
    for (let c = 0; c < 3; c++) {
      flat[i + c] = toLinear[src.data[s + c]] * a + limeLin[c] * (1 - a);
    }
  }
}

for (const { file, size, fill } of OUT) {
  const inner = Math.round(size * fill);
  const pad = (size - inner) / 2;
  const out = Buffer.alloc(size * size * 3);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const o = (y * size + x) * 3;

      // Outside the character's box is flat lime, no sampling needed.
      if (x < pad || y < pad || x >= size - pad || y >= size - pad) {
        out[o] = LIME[0];
        out[o + 1] = LIME[1];
        out[o + 2] = LIME[2];
        continue;
      }

      // Box filter: average every source pixel landing in this destination
      // pixel's footprint. Averaging in linear light keeps the outlines from
      // fattening as they shrink.
      const u0 = ((x - pad) / inner) * flatW;
      const u1 = ((x - pad + 1) / inner) * flatW;
      const v0 = ((y - pad) / inner) * flatW;
      const v1 = ((y - pad + 1) / inner) * flatW;

      let [r, g, b, n] = [0, 0, 0, 0];
      for (let v = Math.floor(v0); v < Math.min(Math.ceil(v1), flatW); v++) {
        for (let u = Math.floor(u0); u < Math.min(Math.ceil(u1), flatW); u++) {
          const i = (v * flatW + u) * 3;
          r += flat[i];
          g += flat[i + 1];
          b += flat[i + 2];
          n++;
        }
      }

      out[o] = fromLinear(r / n);
      out[o + 1] = fromLinear(g / n);
      out[o + 2] = fromLinear(b / n);
    }
  }

  const png = encodeRgb(size, size, out);
  writeFileSync(file, png);
  console.log(`${file}  ${size}x${size}  ${(png.length / 1024).toFixed(1)}KB`);
}
