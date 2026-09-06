/**
 * Canvas geometry constants, deliberately free of any fabric import.
 *
 * These used to live in canvasUtils, which imports fabric at module level.
 * CharacterPreview needs only this one number, so importing it from there
 * pulled the whole of fabric.js into the initial bundle for every visitor to
 * the landing page, whether or not they ever opened a tool.
 */

/**
 * The base character is drawn larger than the trait layers it sits under.
 * Shared by the builder canvas, the hero composite and the image API so a
 * character registers identically in all three.
 */
export const BASE_IMAGE_SCALE_MULTIPLIER = 1.4;
