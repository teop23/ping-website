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
 *   3. The below-the-beak version passed at the API's 512 render and was
 *      rejected in the BUILDER (599px browser canvas): gap-tooth read as a
 *      strip of tiny boxes, because a 5-tooth row with one dark slot is ~8px
 *      tall there and the dark slot is indistinguishable from the dark
 *      interior. gap-tooth is now two big front teeth hanging under a closed
 *      beak with a visible gap; the grin tooth rows are fewer and taller;
 *      smirk's lower mandible no longer pinches to a sliver on its short side.
 *   4. Still rejected in the builder: the drawn orange lower mandible read as
 *      a second beak or a bucket bolted under the real one, and the
 *      perfect-vector strokes and box teeth looked pasted on next to the
 *      hand-drawn base.
 *
 * What works: open the REAL beak (openRealBeak below). Cut it along the
 * orange's own midline, slide the lower half down by a smooth per-column
 * profile that is zero at the corners, and fill the gap with a black lip line
 * each side plus a dark interior. Every outline in the mouth is a warped
 * pixel of the original art. Teeth and tongue are clipped to that interior;
 * anything still drawn gets a small displacement wobble. Nothing moves above
 * the beak's top edge, so eye clearance is unchanged by construction.
 * Verified with scripts/check-eye-clearance.mjs, not by eye.
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

// The outline's anti-aliased edge is black blended with the cream face, so
// the flood-fill keeps it as light-grey pixels. Over cream that's invisible;
// over an open beak's dark interior it showed as a light dotted seam under
// the beak (builder capture, 2026-09-11). Re-express each neutral grey as
// black at the matching coverage: identical over cream, dark over interior.
const FACE_LUM = 244;
for (let i = 0; i < cropW * cropH; i++) {
  if (!keep[i]) continue;
  const [r, g, b, a] = raw.data.subarray(i * 4, i * 4 + 4);
  const neutral = Math.max(r, g, b) - Math.min(r, g, b) < 24;
  if (neutral) {
    const lum = (r + g + b) / 3;
    const cover = Math.max(0, Math.min(1, 1 - lum / FACE_LUM));
    cropped.data.set([0, 0, 0, Math.round(a * cover)], i * 4);
  } else {
    cropped.data.set([r, g, b, a], i * 4);
  }
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
 * Opens the REAL beak instead of bolting a drawn lower mandible under it.
 *
 * The beak is one thick black blob with an orange lens inside. This cuts it
 * along the orange's own midline (measured per column), leaves the upper half
 * where it is, and slides each column of the lower half down by d(x). The
 * gap left behind gets a black lip line on each side (the same black as the
 * outline, so the cut reads as the beak's own edge) and a dark interior
 * between. d(x) goes to zero at the corners, so the side walls of the real
 * outline close the mouth there: the opening is the character's own beak
 * parting, every line in it is a warped pixel of the original art.
 *
 * Done at 4x (nearest upscale of the native crop) so per-column integer
 * shifts become sub-pixel after the box downscale to trait size.
 */
const K = 4;
const LIP = 3 * K; // lip line thickness, 4x px (~5 trait px)
const INTERIOR = [58, 26, 18];
const EXTRA_ROWS = 34; // native rows of headroom for the dropped lower jaw

const up = resizeRgba(cropped, cropW * K, cropH * K);
const isOrange = (i) => up.data[i + 3] > 200 && up.data[i] - up.data[i + 2] > 90;
let ox0 = Infinity, ox1 = -Infinity;
const cut = new Int32Array(up.width).fill(-1);
for (let x = 0; x < up.width; x++) {
  let t = -1, b = -1;
  for (let y = 0; y < up.height; y++) {
    if (!isOrange((y * up.width + x) * 4)) continue;
    if (t < 0) t = y;
    b = y;
  }
  if (t < 0) continue;
  cut[x] = Math.round((t + b) / 2);
  ox0 = Math.min(ox0, x); ox1 = Math.max(ox1, x);
}

/**
 * @param {(u: number) => number} profile - opening in NATIVE px across the
 *   orange's width, u = 0 at its left tip, 1 at its right tip
 * @returns {{ layer, mask }} trait-resolution beak layer and interior mask
 *   (white, alpha = interior coverage), both placed at (BEAK_X, BEAK_Y)
 */
const openRealBeak = (profile) => {
  const W = up.width, H = up.height + EXTRA_ROWS * K;
  const out = { width: W, height: H, data: Buffer.alloc(W * H * 4) };
  const mask = { width: W, height: H, data: Buffer.alloc(W * H * 4) };
  for (let x = 0; x < W; x++) {
    const inOrange = cut[x] >= 0;
    const u = (x - ox0) / (ox1 - ox0);
    const d = inOrange ? Math.max(0, Math.round(profile(u) * K)) : 0;
    const yc = inOrange ? cut[x] : H;
    for (let y = 0; y < H; y++) {
      const o = (y * W + x) * 4;
      if (y < yc) {
        if (y < up.height) out.data.set(up.data.subarray(o, o + 4), o);
      } else if (y < yc + d) {
        const g = y - yc;
        const lip = d <= 2 * LIP || g < LIP || g >= d - LIP;
        out.data.set(lip ? [0, 0, 0, 255] : [...INTERIOR, 255], o);
        if (!lip) mask.data.set([255, 255, 255, 255], o);
      } else if (y - d < up.height) {
        const s = ((y - d) * W + x) * 4;
        out.data.set(up.data.subarray(s, s + 4), o);
      }
    }
  }
  const tw = Math.round(cropW * NATIVE_TO_TRAIT);
  const th = Math.round((cropH + EXTRA_ROWS) * NATIVE_TO_TRAIT);
  return { layer: resizeRgba(out, tw, th), mask: resizeRgba(mask, tw, th) };
};

// Trait-space x of the orange's tips, for placing teeth/tongue in the gap.
const TIP_L = BEAK_X + Math.round((ox0 / K) * NATIVE_TO_TRAIT);
const TIP_R = BEAK_X + Math.round((ox1 / K) * NATIVE_TO_TRAIT);
const MX = Math.round((TIP_L + TIP_R) / 2);

/** First/last interior row of a trait-space column, from the mask. */
const gapAt = (mask, tx) => {
  const x = tx - BEAK_X;
  let top = -1, bot = -1;
  for (let y = 0; y < mask.height; y++) {
    if (mask.data[(y * mask.width + x) * 4 + 3] < 128) continue;
    if (top < 0) top = y;
    bot = y;
  }
  return top < 0 ? null : { top: BEAK_Y + top, bot: BEAK_Y + bot };
};

/**
 * Hand-drawn wobble for anything that is still drawn (teeth, tongue, bubble,
 * mustache): displaces the rasterized SVG by a smooth low-frequency field so
 * strokes lose the perfect-vector look that made the last set read as
 * pasted on. Deterministic (fixed phases) so reruns are byte-stable.
 */
const wobble = (img, amp = 2.2) => {
  const { width: W, height: H, data } = img;
  const out = Buffer.alloc(data.length);
  const f = (x, y, p) =>
    Math.sin(x * 0.043 + y * 0.017 + p) * 0.6 + Math.sin(x * 0.011 - y * 0.051 + p * 1.7) * 0.4;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const sx = Math.round(x + amp * f(x, y, 1.3));
      const sy = Math.round(y + amp * f(y, x, 4.1));
      if (sx < 0 || sy < 0 || sx >= W || sy >= H) continue;
      const s = (sy * W + sx) * 4;
      data.copy(out, (y * W + x) * 4, s, s + 4);
    }
  }
  return { width: W, height: H, data: out };
};

/** Multiplies a full-canvas layer's alpha by the interior mask. */
const clipTo = (img, mask) => {
  for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {
      const mx = x - BEAK_X, my = y - BEAK_Y;
      const m = mx >= 0 && my >= 0 && mx < mask.width && my < mask.height
        ? mask.data[(my * mask.width + mx) * 4 + 3] / 255 : 0;
      const i = (y * img.width + x) * 4 + 3;
      img.data[i] = Math.round(img.data[i] * m);
    }
  }
  return img;
};

/**
 * @param {(u: number) => number} profile - see openRealBeak
 * @param {(g: (tx: number) => ({ top, bot } | null)) => string} [inside] -
 *   SVG clipped to the interior (teeth, tongue in the mouth)
 * @param {(g) => string} [front] - SVG painted over everything (tongue out)
 */
const buildOpen = async (profile, inside, front) => {
  const { layer, mask } = openRealBeak(profile);
  const g = (tx) => gapAt(mask, tx);
  const canvas = blankCanvas();
  over(canvas, layer, BEAK_X, BEAK_Y);
  if (inside) over(canvas, clipTo(wobble(await rasterize(inside(g))), mask), 0, 0);
  if (front) over(canvas, wobble(await rasterize(front(g))), 0, 0);
  return canvas;
};

const sine = (D, p = 0.8) => (u) => D * Math.pow(Math.max(0, Math.sin(Math.PI * u)), p);

/** Teeth hanging from the upper lip: rounded-bottom blocks, clipped to the
 *  interior so their tops disappear into the lip line. */
const toothRow = (g, { xs, w, h, gold = -1 }) => xs.map((tx, i) => {
  const gap = g(Math.round(tx));
  if (!gap) return '';
  const y0 = gap.top - 12, y1 = gap.top + h;
  const fill = i === gold ? '#E8C34A' : '#FFFDF6';
  return `<path d="M ${tx - w / 2} ${y0} L ${tx + w / 2} ${y0} L ${tx + w / 2} ${y1 - 7} Q ${tx + w / 2} ${y1} ${tx} ${y1} Q ${tx - w / 2} ${y1} ${tx - w / 2} ${y1 - 7} Z"
            fill="${fill}" stroke="${BLACK}" stroke-width="4.5" stroke-linejoin="round"/>`;
}).join('');

/** Tongue resting in the bottom of the interior. */
const tongueIn = (g, tx, w) => {
  const gap = g(tx);
  if (!gap) return '';
  const ry = Math.max(10, (gap.bot - gap.top) * 0.55);
  return `<ellipse cx="${tx}" cy="${gap.bot + 6}" rx="${w}" ry="${ry}" fill="#E8536B" stroke="${BLACK}" stroke-width="4.5"/>`;
};

const run = async () => {
  const jobs = {
    // Beak parted in a gentle curve, tongue at the bottom.
    smile: () => buildOpen(sine(16), (g) => tongueIn(g, MX + 4, 32)),

    // Opens toward the right corner only; left stays shut.
    smirk: () => buildOpen(
      (u) => 12 * Math.pow(Math.max(0, Math.sin(Math.PI * Math.pow(u, 2.2))), 0.9),
      (g) => tongueIn(g, TIP_L + Math.round((TIP_R - TIP_L) * 0.68), 20),
    ),

    // Wide open, top teeth row and tongue.
    'open-laugh': () => buildOpen(sine(24, 0.6), (g) =>
      tongueIn(g, MX + 6, 40) +
      toothRow(g, { xs: [-2.5, -1.5, -0.5, 0.5, 1.5, 2.5].map((k) => MX + k * 22), w: 22, h: 18 })),

    // Two front teeth from the upper lip with a clear gap between them.
    'gap-tooth': () => buildOpen(sine(24, 0.55), (g) =>
      tongueIn(g, MX + 4, 34) +
      toothRow(g, { xs: [MX - 19, MX + 19], w: 28, h: 38 })),

    'gold-tooth': () => buildOpen(sine(20, 0.6), (g) =>
      tongueIn(g, MX + 6, 36) +
      toothRow(g, { xs: [-1.5, -0.5, 0.5, 1.5].map((k) => MX + k * 26), w: 26, h: 20, gold: 1 })),

    // Slightly parted, tongue lolling out over the lower jaw.
    'tongue-out': () => buildOpen(sine(9), null, (g) => {
      const gap = g(MX + 10);
      const y0 = gap ? gap.top + 4 : BB - 20;
      return `<path d="M ${MX - 22} ${y0} L ${MX + 42} ${y0} L ${MX + 42} ${BB + 26} Q ${MX + 42} ${BB + 58} ${MX + 10} ${BB + 58} Q ${MX - 22} ${BB + 58} ${MX - 22} ${BB + 26} Z"
                fill="#E8536B" stroke="${BLACK}" stroke-width="7" stroke-linejoin="round"/>
              <path d="M ${MX + 10} ${y0 + 20} L ${MX + 10} ${BB + 40}" stroke="${BLACK}" stroke-width="4.5" stroke-linecap="round" opacity="0.4"/>`;
    }),

    // Bubble blown out of a barely parted beak, in front of it.
    'gum-bubble': () => buildOpen(sine(6), null, () => `
      <circle cx="${MX + 6}" cy="${BB + 22}" r="52" fill="#F2A6C4" stroke="${BLACK}" stroke-width="7"/>
      <path d="M ${MX - 22} ${BB - 2} Q ${MX - 34} ${BB + 12} ${MX - 30} ${BB + 30}" fill="none" stroke="white" stroke-width="7" stroke-linecap="round" opacity="0.85"/>
    `),

    // Under the beak (the beak is the nose), same placement logic as the
    // existing beard trait. Above the beak is impossible: the 9px gap to the
    // eyes can't fit a mustache at any readable size.
    'mustache-only': async () => {
      // Handlebar tucked under the beak: painted first so the beak's bottom
      // outline covers its top edge, tips curling up beside the beak.
      const half = (m) => `
        C ${CX + m * 20} ${BB - 22}, ${CX + m * 60} ${BB - 18}, ${CX + m * 88} ${BB - 6}
        C ${CX + m * 104} ${BB + 2}, ${CX + m * 114} ${BB - 8}, ${CX + m * 116} ${BB - 26}
        C ${CX + m * 132} ${BB - 6}, ${CX + m * 118} ${BB + 26}, ${CX + m * 86} ${BB + 28}
        C ${CX + m * 56} ${BB + 32}, ${CX + m * 22} ${BB + 26}, ${CX} ${BB + 14}`;
      const canvas = blankCanvas();
      over(canvas, wobble(await rasterize(`
        <path d="M ${CX} ${BB - 14} ${half(-1)} M ${CX} ${BB - 14} ${half(1)}"
              fill="#2B2320" stroke="${BLACK}" stroke-width="8" stroke-linejoin="round"/>`)), 0, 0);
      over(canvas, beak, BEAK_X, BEAK_Y);
      return canvas;
    },
  };

  console.log(`orange tips x${TIP_L}-${TIP_R} (trait), mid ${MX}`);
  for (const [name, make] of Object.entries(jobs)) {
    const canvas = await make();
    writeFileSync(`${OUT}/trait-${name}_mouth.png`, encodeRgba(canvas));
    console.log('rendered', `trait-${name}_mouth.png`);
  }
};

run();
