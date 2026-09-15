/**
 * Paint-bucket maths for the trait editor, free of fabric and the DOM.
 *
 * The previous version matched colours within 2/255, so the anti-aliased rim
 * around every stroke, text glyph and the base character stayed unfilled and
 * exported as a transparent halo. It also tracked visited pixels in a
 * string-keyed object, which took over a second for a 1000x1000 background.
 */

export interface FillRegion {
  /** Bounding box of the filled pixels, inclusive of both edges. */
  x: number;
  y: number;
  width: number;
  height: number;
  /** RGBA pixels of the bounding box: fill colour inside the region, transparent elsewhere. */
  pixels: Uint8ClampedArray;
}

/** Per-channel difference (RGBA) a pixel may have from the clicked one and still be filled. */
export const FILL_TOLERANCE = 48;

/**
 * Flood-fills from (startX, startY) over pixels close to the clicked colour,
 * then grows the region by one pixel so it tucks under anti-aliased edges.
 * Returns null when the click is outside the image or already the fill colour.
 */
export const floodFill = (
  data: Uint8ClampedArray,
  width: number,
  height: number,
  startX: number,
  startY: number,
  color: [number, number, number, number],
  tolerance = FILL_TOLERANCE
): FillRegion | null => {
  if (startX < 0 || startY < 0 || startX >= width || startY >= height) return null;

  const start = (startY * width + startX) * 4;
  const target = [data[start], data[start + 1], data[start + 2], data[start + 3]];
  if (target.every((value, channel) => Math.abs(value - color[channel]) <= 2)) return null;

  const matches = (index: number) => {
    const offset = index * 4;
    for (let channel = 0; channel < 4; channel++) {
      if (Math.abs(data[offset + channel] - target[channel]) > tolerance) return false;
    }
    return true;
  };

  const region = new Uint8Array(width * height);
  const stack = [startY * width + startX];
  region[stack[0]] = 1;

  while (stack.length > 0) {
    const index = stack.pop()!;
    const x = index % width;
    const neighbours = [
      x > 0 ? index - 1 : -1,
      x < width - 1 ? index + 1 : -1,
      index - width,
      index + width,
    ];
    for (const next of neighbours) {
      if (next < 0 || next >= region.length || region[next]) continue;
      if (!matches(next)) continue;
      region[next] = 1;
      stack.push(next);
    }
  }

  // Grow by one pixel (8-neighbourhood) and take the bounding box in the same pass.
  const grown = new Uint8Array(region);
  let minX = width, minY = height, maxX = -1, maxY = -1;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = y * width + x;
      if (!region[index]) continue;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const nx = x + dx, ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
          grown[ny * width + nx] = 1;
          if (nx < minX) minX = nx;
          if (nx > maxX) maxX = nx;
          if (ny < minY) minY = ny;
          if (ny > maxY) maxY = ny;
        }
      }
    }
  }

  const boxWidth = maxX - minX + 1;
  const boxHeight = maxY - minY + 1;
  const pixels = new Uint8ClampedArray(boxWidth * boxHeight * 4);
  for (let y = 0; y < boxHeight; y++) {
    for (let x = 0; x < boxWidth; x++) {
      if (!grown[(y + minY) * width + (x + minX)]) continue;
      pixels.set(color, (y * boxWidth + x) * 4);
    }
  }

  return { x: minX, y: minY, width: boxWidth, height: boxHeight, pixels };
};

/** '#rgb' or '#rrggbb' to an opaque RGBA tuple. */
export const hexToRgba = (hex: string): [number, number, number, number] => {
  let digits = hex.replace('#', '');
  if (digits.length === 3) digits = digits.split('').map((d) => d + d).join('');
  const value = parseInt(digits.padEnd(6, '0').slice(0, 6), 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255, 255];
};
