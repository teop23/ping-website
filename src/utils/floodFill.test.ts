import { describe, expect, it } from 'vitest';
import { floodFill, hexToRgba } from './floodFill';

const RED: [number, number, number, number] = [255, 0, 0, 255];

// width x height white image with an optional painter.
const image = (width: number, height: number, paint?: (x: number, y: number) => number[] | null) => {
  const data = new Uint8ClampedArray(width * height * 4).fill(255);
  if (paint) {
    for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
      const rgba = paint(x, y);
      if (rgba) data.set(rgba, (y * width + x) * 4);
    }
  }
  return data;
};

const filledAt = (region: NonNullable<ReturnType<typeof floodFill>>, x: number, y: number) => {
  const lx = x - region.x, ly = y - region.y;
  if (lx < 0 || ly < 0 || lx >= region.width || ly >= region.height) return false;
  return region.pixels[(ly * region.width + lx) * 4 + 3] === 255;
};

describe('floodFill', () => {
  it('fills inside an outline and stops at it', () => {
    // 20x20, black square outline from 5 to 14
    const data = image(20, 20, (x, y) =>
      (x >= 5 && x <= 14 && (y === 5 || y === 14)) || (y >= 5 && y <= 14 && (x === 5 || x === 14)) ? [0, 0, 0, 255] : null
    );
    const region = floodFill(data, 20, 20, 10, 10, RED)!;
    expect(filledAt(region, 10, 10)).toBe(true);
    expect(filledAt(region, 6, 6)).toBe(true);
    expect(filledAt(region, 2, 2)).toBe(false);
    // grown one pixel under the outline, but not through it
    expect(filledAt(region, 5, 10)).toBe(true);
    expect(filledAt(region, 4, 10)).toBe(false);
  });

  it('covers anti-aliased rim pixels instead of leaving a halo', () => {
    // light grey rim (230) around a black dot: within tolerance of white
    const data = image(10, 10, (x, y) => (x === 5 && y === 5 ? [0, 0, 0, 255] : Math.abs(x - 5) <= 1 && Math.abs(y - 5) <= 1 ? [230, 230, 230, 255] : null));
    const region = floodFill(data, 10, 10, 0, 0, RED)!;
    expect(filledAt(region, 4, 4)).toBe(true);
    expect(filledAt(region, 5, 5)).toBe(true); // grown under the dot's edge
  });

  it('reports an inclusive bounding box', () => {
    const region = floodFill(image(8, 6), 8, 6, 0, 0, RED)!;
    expect(region).toMatchObject({ x: 0, y: 0, width: 8, height: 6 });
  });

  it('does nothing when the pixel already has the fill colour or the click is outside', () => {
    const data = image(4, 4, () => [255, 0, 0, 255]);
    expect(floodFill(data, 4, 4, 1, 1, RED)).toBeNull();
    expect(floodFill(image(4, 4), 4, 4, 9, 1, RED)).toBeNull();
  });

  it('fills a 1000x1000 background quickly', () => {
    const started = performance.now();
    floodFill(image(1000, 1000), 1000, 1000, 0, 0, RED);
    expect(performance.now() - started).toBeLessThan(1000);
  });
});

describe('hexToRgba', () => {
  it('parses long and short hex', () => {
    expect(hexToRgba('#ff8000')).toEqual([255, 128, 0, 255]);
    expect(hexToRgba('#0f0')).toEqual([0, 255, 0, 255]);
  });
});
