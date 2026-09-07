/**
 * Minimal PNG decode / resize / encode, for build-time asset work.
 *
 * zlib is all a non-interlaced 8-bit PNG needs, and pulling in sharp for a
 * build step that runs on Cloudflare's image would be a heavier dependency
 * than the problem deserves.
 *
 * The resize is fussier than a plain box filter for two reasons that both
 * show up badly on trait art:
 *
 *   - it averages in LINEAR light. sRGB values are gamma encoded, so the
 *     numeric midpoint of two samples is not the perceptual midpoint of the
 *     two colours, and averaging them directly biases toward the darker input.
 *     That fattens dark strokes as they shrink, and this art is mostly dark
 *     stroke.
 *
 *   - it PREMULTIPLIES alpha before averaging. A transparent pixel still
 *     carries RGB, usually black or garbage. Averaging colour and alpha
 *     independently drags that into every partially transparent edge, which
 *     reads as a dark halo once the trait is composited over the character.
 */

import { deflateSync, inflateSync } from 'zlib';

const SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

// ---- gamma ----------------------------------------------------------------

const TO_LINEAR = new Float32Array(256);
for (let i = 0; i < 256; i++) {
  const c = i / 255;
  TO_LINEAR[i] = c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

const fromLinear = (v) => {
  if (!(v > 0)) return 0;
  const c = v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055;
  return c >= 1 ? 255 : Math.round(c * 255);
};

// ---- decode ---------------------------------------------------------------

/**
 * Undo the per-scanline filters of one contiguous image, starting at `start`
 * in the inflated stream. Each row is prefixed with its filter byte.
 * @returns {{pixels:Buffer,read:number}} unfiltered rows, and bytes consumed.
 */
const unfilter = (raw, start, width, height, channels) => {
  const stride = width * channels;
  const pixels = Buffer.alloc(height * stride);

  for (let y = 0; y < height; y++) {
    const filter = raw[start + y * (stride + 1)];
    const src = start + y * (stride + 1) + 1;
    const dst = y * stride;
    const up = dst - stride;

    for (let x = 0; x < stride; x++) {
      const a = x >= channels ? pixels[dst + x - channels] : 0;
      const b = y > 0 ? pixels[up + x] : 0;
      let v = raw[src + x];

      if (filter === 1) v += a;
      else if (filter === 2) v += b;
      else if (filter === 3) v += (a + b) >> 1;
      else if (filter === 4) {
        const c = x >= channels && y > 0 ? pixels[up + x - channels] : 0;
        const p = a + b - c;
        const pa = Math.abs(p - a);
        const pb = Math.abs(p - b);
        const pc = Math.abs(p - c);
        v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
      } else if (filter !== 0) throw new Error(`bad scanline filter ${filter}`);

      pixels[dst + x] = v & 0xff;
    }
  }

  return { pixels, read: height * (stride + 1) };
};

/** Adam7: [xOffset, yOffset, xStep, yStep] per pass. Roughly a fifth of the
 *  trait library is interlaced, so this is not optional. */
const ADAM7 = [
  [0, 0, 8, 8],
  [4, 0, 8, 8],
  [0, 4, 4, 8],
  [2, 0, 4, 4],
  [0, 2, 2, 4],
  [1, 0, 2, 2],
  [0, 1, 1, 2],
];

/** @returns {{width:number,height:number,data:Buffer}} RGBA, 8 bits per channel. */
export const decodePng = (buffer) => {
  if (!buffer.subarray(0, 8).equals(SIGNATURE)) throw new Error('not a PNG');

  const width = buffer.readUInt32BE(16);
  const height = buffer.readUInt32BE(20);
  const depth = buffer[24];
  const colorType = buffer[25];
  const interlace = buffer[28];

  if (depth !== 8) throw new Error(`unsupported bit depth ${depth}`);
  if (interlace !== 0 && interlace !== 1) throw new Error(`unknown interlace ${interlace}`);
  if (colorType !== 6 && colorType !== 2) {
    throw new Error(`unsupported colour type ${colorType} (need truecolour, with or without alpha)`);
  }

  const channels = colorType === 6 ? 4 : 3;

  const idat = [];
  for (let o = 8; o + 8 <= buffer.length; ) {
    const len = buffer.readUInt32BE(o);
    const type = buffer.toString('ascii', o + 4, o + 8);
    if (type === 'IDAT') idat.push(buffer.subarray(o + 8, o + 8 + len));
    if (type === 'IEND') break;
    o += 12 + len;
  }

  const raw = inflateSync(Buffer.concat(idat));
  const stride = width * channels;
  let lines;

  if (interlace === 0) {
    lines = unfilter(raw, 0, width, height, channels).pixels;
  } else {
    // Seven sub-images, each filtered independently, scattered back into place.
    lines = Buffer.alloc(height * stride);
    let cursor = 0;

    for (const [xOffset, yOffset, xStep, yStep] of ADAM7) {
      const passW = Math.ceil((width - xOffset) / xStep);
      const passH = Math.ceil((height - yOffset) / yStep);
      if (passW <= 0 || passH <= 0) continue;

      const { pixels, read } = unfilter(raw, cursor, passW, passH, channels);
      cursor += read;

      for (let y = 0; y < passH; y++) {
        for (let x = 0; x < passW; x++) {
          const from = (y * passW + x) * channels;
          const to = ((yOffset + y * yStep) * width + (xOffset + x * xStep)) * channels;
          for (let c = 0; c < channels; c++) lines[to + c] = pixels[from + c];
        }
      }
    }
  }

  if (channels === 4) return { width, height, data: lines };

  // Widen truecolour to RGBA so callers only ever handle one shape.
  const rgba = Buffer.alloc(width * height * 4);
  for (let i = 0, j = 0; i < width * height; i++, j += 3) {
    rgba[i * 4] = lines[j];
    rgba[i * 4 + 1] = lines[j + 1];
    rgba[i * 4 + 2] = lines[j + 2];
    rgba[i * 4 + 3] = 255;
  }
  return { width, height, data: rgba };
};

// ---- resize ---------------------------------------------------------------

/**
 * Box-filter downscale of an RGBA image, in premultiplied linear light.
 * Intended for shrinking; upscaling works but will look soft.
 */
export const resizeRgba = ({ width, height, data }, targetW, targetH) => {
  const out = Buffer.alloc(targetW * targetH * 4);
  const xRatio = width / targetW;
  const yRatio = height / targetH;

  for (let y = 0; y < targetH; y++) {
    const y0 = Math.floor(y * yRatio);
    const y1 = Math.min(Math.ceil((y + 1) * yRatio), height);

    for (let x = 0; x < targetW; x++) {
      const x0 = Math.floor(x * xRatio);
      const x1 = Math.min(Math.ceil((x + 1) * xRatio), width);

      let r = 0;
      let g = 0;
      let b = 0;
      let a = 0;
      let n = 0;

      for (let sy = y0; sy < y1; sy++) {
        for (let sx = x0; sx < x1; sx++) {
          const i = (sy * width + sx) * 4;
          const alpha = data[i + 3] / 255;
          // Premultiplied: a fully transparent pixel contributes no colour.
          r += TO_LINEAR[data[i]] * alpha;
          g += TO_LINEAR[data[i + 1]] * alpha;
          b += TO_LINEAR[data[i + 2]] * alpha;
          a += alpha;
          n++;
        }
      }

      const o = (y * targetW + x) * 4;
      const alphaMean = a / n;

      if (alphaMean <= 0) {
        out[o] = 0;
        out[o + 1] = 0;
        out[o + 2] = 0;
        out[o + 3] = 0;
        continue;
      }

      // Undo the premultiply so the result is straight alpha again.
      out[o] = fromLinear(r / n / alphaMean);
      out[o + 1] = fromLinear(g / n / alphaMean);
      out[o + 2] = fromLinear(b / n / alphaMean);
      out[o + 3] = Math.round(alphaMean * 255);
    }
  }

  return { width: targetW, height: targetH, data: out };
};

// ---- encode ---------------------------------------------------------------

const CRC_TABLE = new Int32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  CRC_TABLE[n] = c;
}

const crc32 = (buf) => {
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
};

const chunk = (type, body) => {
  const head = Buffer.alloc(8);
  head.writeUInt32BE(body.length, 0);
  head.write(type, 4, 'ascii');
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([head.subarray(4), body])), 0);
  return Buffer.concat([head, body, crc]);
};

/**
 * @param {number} level zlib level. 6 is the useful knee: level 9 costs
 *   several times the CPU across a whole library for ~1% less bytes.
 */
export const encodeRgba = ({ width, height, data }, level = 6) => {
  const stride = width * 4;
  const raw = Buffer.alloc(height * (stride + 1));

  for (let y = 0; y < height; y++) {
    // Filter 1 (Sub) beats none on flat art with long runs of transparency,
    // and costs nothing to apply.
    raw[y * (stride + 1)] = 1;
    const dst = y * (stride + 1) + 1;
    const src = y * stride;
    for (let x = 0; x < stride; x++) {
      raw[dst + x] = (data[src + x] - (x >= 4 ? data[src + x - 4] : 0)) & 0xff;
    }
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // colour type: truecolour with alpha

  return Buffer.concat([
    SIGNATURE,
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
};

/** Dimensions straight from IHDR, without decoding pixels. */
export const readPngSize = (buffer) => {
  if (buffer.length < 24 || !buffer.subarray(0, 8).equals(SIGNATURE)) return null;
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
};
