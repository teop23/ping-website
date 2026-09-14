import { describe, expect, it } from 'vitest';
import { thumbBox } from './thumb-box.mjs';

const canvas = (size, paint) => {
  const data = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (paint(x, y)) data[(y * size + x) * 4 + 3] = 255;
    }
  }
  return { width: size, height: size, data };
};

describe('thumbBox', () => {
  it('keeps full-frame art whole', () => {
    expect(thumbBox(canvas(100, () => true))).toEqual({ x: 0, y: 0, size: 1 });
  });

  it('shows the whole canvas when nothing is drawn', () => {
    expect(thumbBox(canvas(100, () => false))).toEqual({ x: 0, y: 0, size: 1 });
  });

  it('crops a corner item to a padded square around it', () => {
    // A 20x10 item at x 70-89, y 80-89.
    const box = thumbBox(canvas(100, (x, y) => x >= 70 && x < 90 && y >= 80 && y < 90));
    expect(box.size).toBeCloseTo(0.248);
    // Centred on the item horizontally, pushed up to stay inside the canvas.
    expect(box.x).toBeCloseTo(0.8 - 0.124);
    expect(box.y + box.size).toBeLessThanOrEqual(1);
    expect(box.y).toBeLessThanOrEqual(0.8);
  });

  it('does not zoom a stray speck to fill the tile', () => {
    expect(thumbBox(canvas(100, (x, y) => x === 50 && y === 50)).size).toBe(0.2);
  });

  it('ignores faint anti-aliasing haze', () => {
    const data = canvas(10, () => false);
    data.data[3] = 8;
    expect(thumbBox(data)).toEqual({ x: 0, y: 0, size: 1 });
  });
});
