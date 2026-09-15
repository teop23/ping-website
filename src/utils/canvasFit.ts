/**
 * Canvas sizing maths, kept free of fabric and of the DOM so it can be tested
 * directly.
 *
 * Both of the sizing bugs this replaces were arithmetic, not rendering: the
 * watermark canvas was fixed square so every non-square upload exported with
 * bars baked in, and the trait editor's canvas was being stretched to a
 * non-square box which put pointer coordinates out of step with the cursor.
 * Neither was reachable by a test while the maths lived inside a component
 * wired to a ResizeObserver.
 */

export interface Size {
  width: number;
  height: number;
}

/**
 * Largest box of the given aspect ratio that fits inside `available`.
 *
 * Returns whole pixels: a fractional canvas width leaves fabric resampling
 * against a half-pixel grid.
 */
export const fitToAspect = (available: Size, aspect: number): Size => {
  if (!Number.isFinite(aspect) || aspect <= 0) return { width: 0, height: 0 };
  if (available.width <= 0 || available.height <= 0) return { width: 0, height: 0 };

  const width = Math.min(available.width, available.height * aspect);
  return { width: Math.floor(width), height: Math.floor(width / aspect) };
};

/**
 * Largest square that fits inside `available`.
 *
 * Traits are layered over a square base character, so the authoring canvas has
 * to stay square whatever shape the column around it happens to be.
 */
export const fitSquare = (available: Size): number => {
  const size = Math.min(available.width, available.height);
  return size > 0 ? Math.floor(size) : 0;
};

/**
 * iOS Safari refuses to create a canvas over 16,777,216 pixels, and the export
 * is a canvas, so that is the ceiling everywhere.
 */
export const MAX_EXPORT_PIXELS = 16_777_216;

/**
 * Output size for exporting an image: the source's own resolution, scaled down
 * only when it would exceed `maxPixels`. Exporting at the on-screen size threw
 * away most of a photo's resolution.
 */
export const exportSize = (source: Size, maxPixels = MAX_EXPORT_PIXELS): Size => {
  if (source.width <= 0 || source.height <= 0) return { width: 0, height: 0 };
  const shrink = Math.min(1, Math.sqrt(maxPixels / (source.width * source.height)));
  return {
    width: Math.max(1, Math.floor(source.width * shrink)),
    height: Math.max(1, Math.floor(source.height * shrink)),
  };
};

/** Subtracts padding from a box, never returning a negative dimension. */
export const insetBy = (box: Size, inset: number): Size => ({
  width: Math.max(0, box.width - inset),
  height: Math.max(0, box.height - inset),
});
