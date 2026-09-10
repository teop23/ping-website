import sharp from 'sharp';
import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import { decodePng, encodeRgba, resizeRgba } from './lib/png.mjs';

/**
 * Builds the mouth "expression" traits (smile, smirk, tongue-out, gap-tooth,
 * gold-tooth, open-laugh, gum-bubble, mustache-only) around the real beak
 * instead of erasing or scribbling inside it.
 *
 * History, because each version composited without error and was still
 * wrong once rendered:
 *   1. generate-mouth-traits-svg.mjs covered the beak with a cream rectangle
 *      and drew a human mouth-line on bare face - deleted the character's
 *      actual mouth.
 *   2. The first version of this file kept the real beak but drew every
 *      expression INSIDE its silhouette: a 14px-tall tooth bar, a 6px smile
 *      stroke. The beak is ~53x14px at the 512 render size, so every one of
 *      those details collapsed to a smudge or vanished. smile and smirk were
 *      literally invisible on the live site.
 *
 * What works: treat the real beak as the UPPER mandible and add the
 * expression BELOW it, at a size that survives the 512 render. An open
 * beak is the upper mandible (real pixels, untouched) plus a dark interior
 * and an orange lower mandible hanging beneath; a tongue or bubble comes out
 * from under it. Everything added sits below the beak's own bottom edge, so
 * it is 60+px clear of the eyes by construction - the tight 9px window
 * between eye-bottom and beak-top is never entered. Verified with
 * scripts/check-eye-clearance.mjs, not by eye.
 *
 * lollipop and whistle (held-in-beak objects, the same convention as the
 * original cigar/joint) were fine and are not regenerated here.
 *
 * Pipeline: flood-fill the beak out of ping.png at native resolution, resize
 * it by the renderer's net base-to-trait scale (0.7 * 1147/512 = 1.5682x),
 * composite onto the 1147 trait canvas at the matching position. Overlays
 * are SVG rasterized on the same canvas; paint order per trait decides what
 * sits in front of the beak.
 *
 * Check with:
 *   node scripts/preview-trait.mjs out.png .trait-work/trait-<name>_mouth.png
 *   node scripts/check-eye-clearance.mjs .trait-work/trait-*_mouth.png
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
 * rectangle verbatim reintroduced the eye-overlap bug: its bounding corner
 * reached to trait-space y=387, inside the eye's own 13px radius at y=381.
 *
 * A flat "is this pixel cream" filter is not enough either - the offending
 * pixel at (484,387) is a fragment of the HOOD's own black outline curve,
 * which the crop rectangle clips through near its corner. Colour alone
 * cannot tell that fragment from the beak's own outline; both are black.
 *
 * The fix that works: flood-fill outward from a seed pixel known to be
 * inside the beak's orange fill, following only 4-connected non-cream
 * pixels. That reaches the beak's own outline and stops there - it can never
 * reach the hood fragment, because cream face separates the two.
 */
const isFaceCream = (r, g, b) => r > 235 && g > 228 && b > 210;
const SEED = { x: 518 - CROP.x0, y: 427 - CROP.y0 }; // beak orange center, crop-local

const raw = { width: cropW, height: cropH, data: Buffer.alloc(cropW * cropH * 4) };
for (let y = 0; y < cropH; y++) {
  for (let x = 0; x < cropW; x++) {
    const s = ((CROP.y0 + y) * pingImg.width + (CROP.x0 + x)) * 4;
    const d = (y * cropW + x) * 4;
    raw.data.set(pingImg.data.subarray(s, s + 4), d);
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
  cropped.data.set(raw.data.subarray(i * 4, i * 4 + 4), i * 4);
}

const beak = resizeRgba(cropped, Math.round(cropW * NATIVE_TO_TRAIT), Math.round(cropH * NATIVE_TO_TRAIT));

// Where the resized beak crop's top-left corner lands on the 1147 trait
// canvas: same transform, applied to the crop's own origin.
// (baseLeft in trait-space = -102.4 canvas-px * (1147/512) canvas-to-trait)
const BEAK_X = Math.round(CROP.x0 * NATIVE_TO_TRAIT - (102.4 * (1147 / 512)));
const BEAK_Y = Math.round(CROP.y0 * NATIVE_TO_TRAIT - (102.4 * (1147 / 512)));

// Measure the beak layer's real opaque extent rather than assuming it, so
// the additions below register against the actual bottom edge.
let bx0 = Infinity, bx1 = -Infinity, by0 = Infinity, by1 = -Infinity;
for (let y = 0; y < beak.height; y++) {
  for (let x = 0; x < beak.width; x++) {
    if (beak.data[(y * beak.width + x) * 4 + 3] < 128) continue;
    bx0 = Math.min(bx0, x); bx1 = Math.max(bx1, x);
    by0 = Math.min(by0, y); by1 = Math.max(by1, y);
  }
}
const BEAK = {
  left: BEAK_X + bx0, right: BEAK_X + bx1,
  top: BEAK_Y + by0, bottom: BEAK_Y + by1,
};
const CX = Math.round((BEAK.left + BEAK.right) / 2);
const BB = BEAK.bottom; // beak's bottom outline edge in trait space
console.log(`beak layer: ${beak.width}x${beak.height} at (${BEAK_X}, ${BEAK_Y}); opaque bbox x${BEAK.left}-${BEAK.right} y${BEAK.top}-${BEAK.bottom}; CX=${CX}`);

// The beak's own orange, sampled from the seed pixel so the lower mandible
// matches exactly instead of a guessed hex.
const seedIdx = (427 * pingImg.width + 518) * 4;
const ORANGE = `rgb(${pingImg.data[seedIdx]},${pingImg.data[seedIdx + 1]},${pingImg.data[seedIdx + 2]})`;

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

const rasterize = async (svgBody) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${CANVAS}" height="${CANVAS}" viewBox="0 0 ${CANVAS} ${CANVAS}">${body(svgBody)}</svg>`;
  return decodePng(await sharp(Buffer.from(svg)).png().toBuffer());
};
const body = (s) => s;

/**
 * @param {string} under - SVG painted BEFORE the beak (the beak overlaps it:
 *   an open-mouth interior, a lower mandible, a tongue emerging from under)
 * @param {string} [above] - SVG painted AFTER the beak (sits in front: a
 *   bubble, a mustache)
 */
const build = async (under, above = '') => {
  const canvas = blankCanvas();
  if (under.trim()) over(canvas, await rasterize(under), 0, 0);
  over(canvas, beak, BEAK_X, BEAK_Y);
  if (above.trim()) over(canvas, await rasterize(above), 0, 0);
  return canvas;
};

/**
 * Open beak: dark interior + orange lower mandible hanging below the real
 * beak. `depth` is how far the lower mandible drops below the beak's bottom
 * edge; `skew` shifts the lowest point sideways for a lopsided (smirk) open.
 * The interior's top edge sits 12px above BB so the real beak's bottom
 * outline overlaps and hides the seam.
 */
const openBeak = ({ depth, halfW = 78, skew = 0, interior = '#3A1A12' }) => {
  const top = BB - 12;
  const lx = CX - halfW, rx = CX + halfW;
  const lowX = CX + skew, lowY = BB + depth;
  const rim = 22; // lower mandible thickness
  return `
    <path d="M ${lx} ${top} L ${rx} ${top} Q ${rx + 4} ${lowY - 10} ${lowX} ${lowY} Q ${lx - 4} ${lowY - 10} ${lx} ${top} Z"
          fill="${interior}" stroke="${BLACK}" stroke-width="8" stroke-linejoin="round"/>
    <path d="M ${lx} ${top} Q ${lx - 4} ${lowY - 10} ${lowX} ${lowY} Q ${rx + 4} ${lowY - 10} ${rx} ${top}
             Q ${rx - 18} ${lowY - rim - 4} ${lowX} ${lowY - rim} Q ${lx + 18} ${lowY - rim - 4} ${lx} ${top} Z"
          fill="${ORANGE}" stroke="${BLACK}" stroke-width="8" stroke-linejoin="round"/>
  `;
};

/** A white tooth row along the top of an open interior, optionally with one
 *  slot dark (gap) or gold. Tooth edges drawn as thin dark dividers. */
const teeth = ({ count = 5, gap = -1, gold = -1, y = BB - 6, h = 22, halfW = 62 }) => {
  const w = (halfW * 2) / count;
  return Array.from({ length: count }, (_, i) => {
    const x = CX - halfW + i * w;
    if (i === gap) return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#1E0E0A"/>`;
    const fill = i === gold ? '#E8C34A' : 'white';
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" stroke="${BLACK}" stroke-width="3"/>`;
  }).join('');
};

const run = async () => {
  const jobs = {
    // Wide happy open beak, no teeth, tongue visible inside.
    smile: () => build(`
      ${openBeak({ depth: 52, halfW: 82 })}
      <path d="M ${CX - 30} ${BB + 4} Q ${CX} ${BB + 34} ${CX + 30} ${BB + 4} Z" fill="#E8536B"/>
    `),

    // Lopsided: lowest point pushed to the right, left side barely open.
    smirk: () => build(`
      ${openBeak({ depth: 46, halfW: 80, skew: 46 })}
    `),

    // Big laugh: tall open beak with a full white tooth row.
    'open-laugh': () => build(`
      ${openBeak({ depth: 74, halfW: 84 })}
      ${teeth({ count: 6, halfW: 66, h: 24 })}
    `),

    'gap-tooth': () => build(`
      ${openBeak({ depth: 64, halfW: 82 })}
      ${teeth({ count: 5, gap: 2, halfW: 64, h: 24 })}
    `),

    'gold-tooth': () => build(`
      ${openBeak({ depth: 64, halfW: 82 })}
      ${teeth({ count: 5, gold: 1, halfW: 64, h: 24 })}
    `),

    // Tongue emerges from under the real beak: painted before it so the
    // beak's bottom outline reads as the lip it comes out of.
    'tongue-out': () => build(`
      <path d="M ${CX - 34} ${BB - 10} L ${CX + 34} ${BB - 10} L ${CX + 34} ${BB + 40} Q ${CX + 34} ${BB + 76} ${CX} ${BB + 76} Q ${CX - 34} ${BB + 76} ${CX - 34} ${BB + 40} Z"
            fill="#E8536B" stroke="${BLACK}" stroke-width="8" stroke-linejoin="round"/>
      <path d="M ${CX} ${BB + 6} L ${CX} ${BB + 56}" stroke="${BLACK}" stroke-width="5" stroke-linecap="round" opacity="0.45"/>
    `),

    // Bubble in front of the beak, overlapping its bottom edge.
    'gum-bubble': () => build('', `
      <circle cx="${CX}" cy="${BB + 54}" r="66" fill="#F2A6C4" stroke="${BLACK}" stroke-width="9"/>
      <path d="M ${CX - 30} ${BB + 22} Q ${CX - 46} ${BB + 40} ${CX - 40} ${BB + 62}" fill="none" stroke="white" stroke-width="8" stroke-linecap="round" opacity="0.8"/>
    `),

    // Under the beak (the beak is the nose), same placement logic as the
    // existing beard trait. Above the beak is impossible: the 9px gap to the
    // eyes can't fit a mustache at any readable size.
    'mustache-only': () => build('', `
      <path d="M ${CX} ${BB - 2}
               C ${CX - 30} ${BB + 34}, ${CX - 90} ${BB + 34}, ${CX - 118} ${BB + 4}
               C ${CX - 96} ${BB + 10}, ${CX - 70} ${BB + 8}, ${CX - 54} ${BB + 24}
               C ${CX - 74} ${BB + 12}, ${CX - 100} ${BB + 16}, ${CX - 108} ${BB + 34}
               C ${CX - 74} ${BB + 40}, ${CX - 30} ${BB + 48}, ${CX} ${BB + 20}
               C ${CX + 30} ${BB + 48}, ${CX + 74} ${BB + 40}, ${CX + 108} ${BB + 34}
               C ${CX + 100} ${BB + 16}, ${CX + 74} ${BB + 12}, ${CX + 54} ${BB + 24}
               C ${CX + 70} ${BB + 8}, ${CX + 96} ${BB + 10}, ${CX + 118} ${BB + 4}
               C ${CX + 90} ${BB + 34}, ${CX + 30} ${BB + 34}, ${CX} ${BB - 2} Z"
            fill="#2B2320" stroke="${BLACK}" stroke-width="8" stroke-linejoin="round"/>
    `),
  };

  for (const [name, make] of Object.entries(jobs)) {
    const canvas = await make();
    writeFileSync(`${OUT}/trait-${name}_mouth.png`, encodeRgba(canvas));
    console.log('rendered', `trait-${name}_mouth.png`);
  }
};

run();
