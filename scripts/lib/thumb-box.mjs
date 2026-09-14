/**
 * The square region of a trait worth showing in a builder tile.
 *
 * Every trait is drawn on the full character canvas, so a handheld token or a
 * pet sits in one corner and its tile is mostly empty: a 40px speck in a 128px
 * box. Tiles crop to this box instead. Returned as fractions of the canvas so
 * the client does not care which resolution it was measured at.
 *
 * Auras and other full-frame art come back as the whole canvas, unchanged.
 */

/** Alpha below this is anti-aliasing haze, not the item. */
const ALPHA_FLOOR = 16;

/** Breathing room around the item, as a share of its larger side. */
const PADDING = 0.12;

/** Never zoom past this: a single-pixel stray would otherwise fill the tile. */
const MIN_SIZE = 0.2;

const round = (n) => Math.round(n * 1000) / 1000;

export const thumbBox = ({ width, height, data }) => {
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * 4 + 3] < ALPHA_FLOOR) continue;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }

  if (maxX < 0) return { x: 0, y: 0, size: 1 };

  const w = (maxX - minX + 1) / width;
  const h = (maxY - minY + 1) / height;
  const size = Math.min(1, Math.max(MIN_SIZE, Math.max(w, h) * (1 + PADDING * 2)));
  const cx = (minX / width + w / 2);
  const cy = (minY / height + h / 2);
  const clamp = (c) => Math.min(Math.max(c - size / 2, 0), 1 - size);

  return { x: round(clamp(cx)), y: round(clamp(cy)), size: round(size) };
};
