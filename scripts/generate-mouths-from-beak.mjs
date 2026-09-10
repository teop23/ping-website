import sharp from 'sharp';
import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import { decodePng, encodeRgba, resizeRgba } from './lib/png.mjs';

/**
 * Rebuilds the mouth "expression" traits (smile, smirk, tongue-out,
 * gap-tooth, gold-tooth, open-laugh, gum-bubble) to preserve the real beak
 * instead of erasing it.
 *
 * generate-mouth-traits-svg.mjs's `cover()` painted a cream rectangle over
 * the beak and drew an invented mouth-line on bare face - it composited
 * without error and passed the eye-clearance check, and was still wrong:
 * it deletes the character's actual mouth, which is the orange beak, not a
 * human-style lip line. Same category of mistake as the shirt bug, and the
 * same fix: extract the real feature from ping.png and decorate it, don't
 * invent a replacement.
 *
 * mustache-only, lollipop and whistle already do this correctly (they never
 * touch the beak) and are untouched here.
 *
 * Pipeline: crop the beak (with its black outline) out of ping.png at
 * native resolution, resize it by the same net scale the renderer applies
 * to the base character (0.7x base-to-canvas, 1147/512 canvas-to-trait -
 * net 1.5682x), then composite it onto the 1147 trait canvas at the
 * matching position. Every expression starts from this real, unmodified
 * beak and adds to it, rather than replacing it.
 *
 * Check registration with:
 *   node scripts/preview-trait.mjs out.png .trait-work/trait-<name>_mouth.png
 */

const OUT = '.trait-work';
mkdirSync(OUT, { recursive: true });

const NATIVE_TO_TRAIT = 0.7 * (1147 / 512); // 1.56820...
const CANVAS = 1147;
const BLACK = '#000000';

// Beak's real orange bbox in ping.png's native 1024 space is x480-556,y417-437
// (measured directly, not guessed). Cropped here with padding to include its
// full black outline.
const CROP = { x0: 452, y0: 393, x1: 584, y1: 461 };

const pingImg = decodePng(readFileSync('public/ping.png'));
const cropW = CROP.x1 - CROP.x0;
const cropH = CROP.y1 - CROP.y0;
const cropped = { width: cropW, height: cropH, data: Buffer.alloc(cropW * cropH * 4) };

/**
 * A plain rectangular crop of ping.png is NOT beak-on-transparent - the
 * face around the beak is itself opaque cream, so the crop is a solid
 * opaque rectangle with the beak drawn inside it. Compositing that
 * rectangle verbatim reintroduced the exact bug this file exists to fix:
 * its bounding corner reached to trait-space y=387, inside the eye's own
 * 13px radius at y=381 - caught by the same automated eye-clearance check
 * used on the earlier version, immediately after this one seemed to fix
 * the beak-erasure problem.
 *
 * A flat "is this pixel cream" filter is not enough either - it was tried
 * first and left the exact same violation, because the offending pixel at
 * (484,387) is not cream, it is a fragment of the HOOD's own black outline
 * curve, which the crop rectangle also happens to clip through near its
 * corner. Filtering by color alone cannot tell that fragment apart from the
 * beak's own outline, since both are the same black.
 *
 * The fix that actually works: flood-fill outward from a seed pixel known
 * to be inside the beak's orange fill, following only 4-connected non-cream
 * pixels. That reaches the beak's own outline (directly adjacent to the
 * orange) and stops there - it can never reach the hood fragment, because
 * cream face separates the two everywhere except accidentally at the
 * crop's edge, which 4-connectivity from an interior seed does not cross.
 */
const isFaceCream = (r, g, b) => r > 235 && g > 228 && b > 210;
const SEED = { x: 518 - CROP.x0, y: 427 - CROP.y0 }; // beak orange center, crop-local

const raw = { width: cropW, height: cropH, data: Buffer.alloc(cropW * cropH * 4) };
for (let y = 0; y < cropH; y++) {
  for (let x = 0; x < cropW; x++) {
    const s = ((CROP.y0 + y) * pingImg.width + (CROP.x0 + x)) * 4;
    const d = (y * cropW + x) * 4;
    raw.data[d] = pingImg.data[s];
    raw.data[d + 1] = pingImg.data[s + 1];
    raw.data[d + 2] = pingImg.data[s + 2];
    raw.data[d + 3] = pingImg.data[s + 3];
  }
}

const keep = new Uint8Array(cropW * cropH);
const stack = [SEED.y * cropW + SEED.x];
keep[stack[0]] = 1;
while (stack.length) {
  const i = stack.pop();
  const x = i % cropW, y = (i / cropW) | 0;
  for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
    const nx = x + dx, ny = y + dy;
    if (nx < 0 || ny < 0 || nx >= cropW || ny >= cropH) continue;
    const ni = ny * cropW + nx;
    if (keep[ni]) continue;
    const s = ni * 4;
    if (isFaceCream(raw.data[s], raw.data[s + 1], raw.data[s + 2]) || raw.data[s + 3] < 200) continue;
    keep[ni] = 1;
    stack.push(ni);
  }
}

for (let i = 0; i < cropW * cropH; i++) {
  if (!keep[i]) continue;
  const d = i * 4;
  cropped.data[d] = raw.data[d];
  cropped.data[d + 1] = raw.data[d + 1];
  cropped.data[d + 2] = raw.data[d + 2];
  cropped.data[d + 3] = raw.data[d + 3];
}

const beak = resizeRgba(cropped, Math.round(cropW * NATIVE_TO_TRAIT), Math.round(cropH * NATIVE_TO_TRAIT));

// Where the resized beak crop's top-left corner lands on the 1147 trait
// canvas: same transform, applied to the crop's own origin.
const BEAK_X = Math.round(CROP.x0 * NATIVE_TO_TRAIT - (102.4 * (1147 / 512)));
const BEAK_Y = Math.round(CROP.y0 * NATIVE_TO_TRAIT - (102.4 * (1147 / 512)));
// (baseLeft in trait-space = -102.4 canvas-px * (1147/512) canvas-to-trait)

console.log(`beak layer: ${beak.width}x${beak.height} at (${BEAK_X}, ${BEAK_Y})`);

const over = (dst, src, dx, dy) => {
  for (let y = 0; y < src.height; y++) {
    const cy = dy + y;
    if (cy < 0 || cy >= dst.height) continue;
    for (let x = 0; x < src.width; x++) {
      const cx = dx + x;
      if (cx < 0 || cx >= dst.width) continue;
      const s = (y * src.width + x) * 4;
      const a = src.data[s + 3] / 255;
      if (a <= 0) continue;
      const d = (cy * dst.width + cx) * 4;
      for (let c = 0; c < 3; c++) dst.data[d + c] = Math.round(src.data[s + c] * a + dst.data[d + c] * (1 - a));
      dst.data[d + 3] = Math.round((a + (dst.data[d + 3] / 255) * (1 - a)) * 255);
    }
  }
};

const blankCanvas = () => ({ width: CANVAS, height: CANVAS, data: Buffer.alloc(CANVAS * CANVAS * 4) });

const rasterizeOverlay = async (svgBody) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${CANVAS}" height="${CANVAS}" viewBox="0 0 ${CANVAS} ${CANVAS}">${svgBody}</svg>`;
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  return decodePng(buf);
};

/** Compose: real beak layer, then an overlay drawn on top of it. */
const buildExpression = async (overlaySvg) => {
  const canvas = blankCanvas();
  over(canvas, beak, BEAK_X, BEAK_Y);
  if (overlaySvg) {
    const overlay = await rasterizeOverlay(overlaySvg);
    over(canvas, overlay, 0, 0);
  }
  return canvas;
};

/**
 * For the three "open mouth" traits, the gap/teeth need to sit INSIDE the
 * beak's own silhouette, not floating in front of it as an unrelated black
 * blob. Achieved by multiplying the overlay's alpha by the beak layer's own
 * alpha at every pixel before compositing, i.e. clipping the overlay to
 * exactly the beak's shape - the same masking principle as the aura
 * safe-zone, applied to "stay inside" instead of "stay outside."
 */
const buildOpenMouth = async (overlaySvg) => {
  const canvas = blankCanvas();
  over(canvas, beak, BEAK_X, BEAK_Y);

  const overlay = await rasterizeOverlay(overlaySvg);
  const clipped = { width: overlay.width, height: overlay.height, data: Buffer.from(overlay.data) };
  for (let i = 0; i < clipped.width * clipped.height; i++) {
    const o = i * 4;
    const x = i % clipped.width, y = (i / clipped.width) | 0;
    const bx = x - BEAK_X, by = y - BEAK_Y;
    let beakAlpha = 0;
    if (bx >= 0 && bx < beak.width && by >= 0 && by < beak.height) {
      beakAlpha = beak.data[(by * beak.width + bx) * 4 + 3] / 255;
    }
    clipped.data[o + 3] = Math.round(clipped.data[o + 3] * beakAlpha);
  }
  over(canvas, clipped, 0, 0);
  return canvas;
};

// Beak center in trait-space, for positioning overlays: (588, 427) - the
// orange bbox center (518, 427 native) run through the same transform.
const CX = 588, CY = Math.round(427 * NATIVE_TO_TRAIT - (102.4 * (1147 / 512)));

const run = async () => {
  const jobs = {
    smile: () => buildExpression(`
      <path d="M ${CX - 45} ${CY + 6} Q ${CX} ${CY + 22} ${CX + 45} ${CY + 4}" fill="none" stroke="${BLACK}" stroke-width="6" stroke-linecap="round" opacity="0.85"/>
    `),

    smirk: () => buildExpression(`
      <path d="M ${CX - 40} ${CY + 8} Q ${CX + 10} ${CY + 16} ${CX + 48} ${CY - 6}" fill="none" stroke="${BLACK}" stroke-width="6" stroke-linecap="round" opacity="0.85"/>
    `),

    'tongue-out': () => buildExpression(`
      <path d="M ${CX - 14} ${CY + 12} Q ${CX} ${CY + 40} ${CX + 14} ${CY + 12} Q ${CX} ${CY + 24} ${CX - 14} ${CY + 12} Z"
            fill="#E8536B" stroke="${BLACK}" stroke-width="4" stroke-linejoin="round"/>
    `),

    'gum-bubble': () => buildExpression(`
      <circle cx="${CX}" cy="${CY + 32}" r="28" fill="#F2A6C4" stroke="${BLACK}" stroke-width="6"/>
      <path d="M ${CX - 12} ${CY + 16} Q ${CX - 20} ${CY + 24} ${CX - 14} ${CY + 32}" fill="none" stroke="white" stroke-width="4" stroke-linecap="round" opacity="0.75"/>
    `),

    // The gap/teeth are inset from the beak's own measured vertical extent
    // (orange visible y 425-449 at the beak's center, verified by sampling
    // the actual extracted beak layer, not assumed) rather than covering it
    // edge to edge - the first version filled the whole silhouette solid
    // and lost the orange entirely, same mistake as the mouths this file
    // replaces, just inside the clip instead of instead of it. A ~5px
    // orange rim top and bottom reads as open beak "lips" framing a dark
    // interior, rather than the beak having vanished.
    'gap-tooth': () => buildOpenMouth(`
      <rect x="${CX - 82}" y="430" width="164" height="14" fill="${BLACK}"/>
      <rect x="${CX - 66}" y="431" width="24" height="12" fill="white"/>
      <rect x="${CX - 12}" y="431" width="24" height="12" fill="white"/>
      <rect x="${CX + 30}" y="431" width="24" height="12" fill="white"/>
    `),

    'gold-tooth': () => buildOpenMouth(`
      <rect x="${CX - 82}" y="430" width="164" height="14" fill="#5A2E1A"/>
      <rect x="${CX - 16}" y="428" width="28" height="18" fill="#E8C34A" stroke="${BLACK}" stroke-width="3"/>
    `),

    'open-laugh': () => buildOpenMouth(`
      <rect x="${CX - 82}" y="429" width="164" height="16" fill="#2A1610"/>
      <rect x="${CX - 70}" y="430" width="140" height="7" fill="white"/>
    `),
  };

  for (const [name, build] of Object.entries(jobs)) {
    const canvas = await build();
    writeFileSync(`${OUT}/trait-${name}_mouth.png`, encodeRgba(canvas));
    console.log('rendered', `trait-${name}_mouth.png`);
  }
};

run();
