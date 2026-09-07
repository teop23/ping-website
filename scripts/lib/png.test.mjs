import { readFileSync } from 'fs';
import { describe, expect, it } from 'vitest';
import { decodePng, encodeRgba, readPngSize, resizeRgba } from './png.mjs';

/** Solid RGBA image, for round-trip checks. */
const solid = (w, h, [r, g, b, a]) => {
  const data = Buffer.alloc(w * h * 4);
  for (let i = 0; i < w * h; i++) {
    data[i * 4] = r;
    data[i * 4 + 1] = g;
    data[i * 4 + 2] = b;
    data[i * 4 + 3] = a;
  }
  return { width: w, height: h, data };
};

const pixel = ({ width, data }, x, y) => {
  const i = (y * width + x) * 4;
  return [data[i], data[i + 1], data[i + 2], data[i + 3]];
};

describe('encode / decode round trip', () => {
  it('preserves every channel', () => {
    const source = solid(8, 8, [12, 200, 45, 210]);
    const back = decodePng(encodeRgba(source));
    expect(back.width).toBe(8);
    expect(back.height).toBe(8);
    expect(Buffer.compare(back.data, source.data)).toBe(0);
  });

  it('survives a non-uniform image, which exercises the Sub filter', () => {
    const source = solid(16, 4, [0, 0, 0, 0]);
    for (let i = 0; i < 16 * 4; i++) {
      source.data[i * 4] = (i * 7) % 256;
      source.data[i * 4 + 1] = (i * 13) % 256;
      source.data[i * 4 + 2] = (i * 29) % 256;
      source.data[i * 4 + 3] = 255 - (i % 256);
    }
    expect(Buffer.compare(decodePng(encodeRgba(source)).data, source.data)).toBe(0);
  });

  it('reports dimensions without decoding', () => {
    expect(readPngSize(encodeRgba(solid(5, 9, [1, 2, 3, 4])))).toEqual({ width: 5, height: 9 });
  });
});

describe('resize', () => {
  it('hits the requested dimensions', () => {
    const out = resizeRgba(solid(64, 64, [255, 0, 0, 255]), 16, 16);
    expect(out.width).toBe(16);
    expect(out.height).toBe(16);
    expect(pixel(out, 8, 8)).toEqual([255, 0, 0, 255]);
  });

  it('keeps fully transparent areas fully transparent', () => {
    const out = resizeRgba(solid(32, 32, [0, 0, 0, 0]), 8, 8);
    expect(pixel(out, 4, 4)[3]).toBe(0);
  });

  it('does not drag colour out of transparent pixels into an edge', () => {
    // Half opaque white, half transparent BLACK - the shape that produces a
    // grey halo if colour and alpha are averaged independently rather than
    // premultiplied. The blended column must stay white, only less opaque.
    const src = solid(8, 2, [0, 0, 0, 0]);
    for (let y = 0; y < 2; y++) {
      for (let x = 0; x < 4; x++) {
        const i = (y * 8 + x) * 4;
        src.data[i] = 255;
        src.data[i + 1] = 255;
        src.data[i + 2] = 255;
        src.data[i + 3] = 255;
      }
    }

    const out = resizeRgba(src, 4, 1);
    const [r, g, b, a] = pixel(out, 1, 0); // straddles the boundary
    expect(a).toBeGreaterThan(0);
    expect(Math.min(r, g, b)).toBeGreaterThan(200);
  });
});

describe('the real trait library', () => {
  it('decodes an interlaced trait to its declared size', () => {
    // A fifth of the library is Adam7. Decoding these as if they were
    // progressive yields a scrambled image rather than an error, so assert the
    // shape rather than trusting it not to throw.
    const file = readFileSync('public/traits/trait-clown_head.png');
    expect(file[28]).toBe(1); // interlace flag, guards the fixture itself
    const declared = readPngSize(file);
    const decoded = decodePng(file);
    expect(decoded.width).toBe(declared.width);
    expect(decoded.data.length).toBe(declared.width * declared.height * 4);
    // Adam7 fills seven interleaved passes; a missed pass leaves whole rows or
    // columns untouched, so require content in every eighth row.
    let rowsWithInk = 0;
    for (let y = 0; y < decoded.height; y += 8) {
      for (let x = 0; x < decoded.width; x++) {
        if (decoded.data[(y * decoded.width + x) * 4 + 3] > 0) {
          rowsWithInk++;
          break;
        }
      }
    }
    expect(rowsWithInk).toBeGreaterThan(decoded.height / 8 / 4);
  });

  it('decodes a progressive trait too', () => {
    const file = readFileSync('public/traits/trait-cowboy-hat_head.png');
    expect(file[28]).toBe(0);
    const decoded = decodePng(file);
    expect(decoded.data.length).toBe(decoded.width * decoded.height * 4);
  });
});
