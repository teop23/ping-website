import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { basename, extname } from 'path';
import jpeg from 'jpeg-js';
import { decodePng, encodeRgba } from './lib/png.mjs';

/**
 * Cut a trait layer out of an image-model edit of the base character.
 *
 *   node scripts/extract-trait-from-edit.mjs <category> <edit.jpg|png>
 *        [--name fish-in-beak] [--threshold 32] [--open 2] [--close 9] [--min-area 40]
 *        [--box x0,y0,x1,y1] [--behind-beak] [--fit-top 160] [--fit-right 860] [--fit-left 165] [--ground 752] [--full] [--fill-enclosed] [--max-hole 30] [--debug .trait-work/extract]
 *
 * The model (Gemini / GPT Image) returns the whole redrawn penguin, never a
 * layer, so the layer is recovered by diffing the edit against
 * docs/trait-refs/ping-on-white.png (the exact image it was given):
 *   1. per-pixel max channel difference, thresholded to drop JPG noise
 *   2. only inside the category's region box (native 1024 coords), and
 *      outside the eyes for everything but face/aura
 *   3. morphological open to remove speckle, a dark-only close to bridge the
 *      model's outline across the base's own black lines, then tiny
 *      components dropped
 *   4. colour from the edit's pixels, alpha ramped from the diff strength
 *   5. mapped to trait space (trait = native * 1.5682 - 229.4, the renderer's
 *      1.4x-centered base geometry) on a transparent 1147 canvas
 * Writes public/traits/trait-<name>_<category>.png.
 *
 * It only moves pixels the model drew; it never draws or repairs art. If the
 * model redrew part of the base (a reshaped beak), that shows up as a ghost
 * in the layer: check the --debug output on its own before compositing, and
 * ask for a new take rather than patching it here.
 *
 * Region boxes are the union of the existing traits in each category plus
 * padding. Only `mouth` has been checked against a real edit; verify the
 * others on their first use and override with --box if needed.
 */

const REGIONS = {
  mouth: [380, 340, 878, 625],
  face: [150, 146, 878, 625],
  head: [230, 146, 780, 500],
  body: [265, 410, 740, 760],
  right_hand: [515, 290, 878, 810],
  left_hand: [146, 146, 492, 800],
  accessory: [146, 525, 878, 878],
  aura: [146, 146, 878, 878],
};
const EYE_FREE = new Set(['face', 'aura']);

// Trait space, same constants as check-eye-clearance.mjs. The exclusion is
// its --min default (6) plus 2px of slack for the alpha ramp.
const EYES = [[495, 381], [658, 381]];
const EYE_KEEP_OUT = 13 + 6 + 2;

const NATIVE = 1024, CANVAS = 1147, SCALE = 1.5682, OFFSET = -229.4;
const BASE_REF = 'docs/trait-refs/ping-on-white.png';
// Outline black in the edits is 0-10; the base's body fill is ~35.
const DARK = 20;
// Largest enclosed gap (native px) treated as a pinhole rather than an opening.
const MAX_HOLE_DEFAULT = 30;

const args = process.argv.slice(2);
const opts = { threshold: 32, open: 2, close: 9, 'min-area': 40, 'max-hole': MAX_HOLE_DEFAULT };
const pos = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--behind-beak' || args[i] === '--fill-enclosed' || args[i] === '--full' || args[i] === '--penguin') opts[args[i].slice(2)] = true;
  else if (args[i].startsWith('--')) opts[args[i].slice(2)] = args[++i];
  else pos.push(args[i]);
}
const [category, editPath] = pos;
if (!REGIONS[category] || !editPath) {
  console.error(`usage: extract-trait-from-edit.mjs <${Object.keys(REGIONS).join('|')}> <edit.jpg|png> [options]`);
  process.exit(2);
}
const name = opts.name ?? basename(editPath, extname(editPath)).replace(/-take\d+$/, '');
const threshold = Number(opts.threshold);
const openR = Number(opts.open);
const closeR = Number(opts.close);
const minArea = Number(opts['min-area']);
const box = opts.box ? opts.box.split(',').map(Number) : REGIONS[category];

const decode = (path) => {
  const buf = readFileSync(path);
  if (/\.jpe?g$/i.test(path)) {
    const { width, height, data } = jpeg.decode(buf, { useTArray: true, formatAsRGBA: true });
    return { width, height, data };
  }
  return decodePng(buf);
};

const edit = decode(editPath);
const base = decodePng(readFileSync(BASE_REF));
for (const [label, img] of [['edit', edit], ['base', base]]) {
  if (img.width !== NATIVE || img.height !== NATIVE) {
    console.error(`${label} is ${img.width}x${img.height}, expected ${NATIVE}x${NATIVE}`);
    process.exit(2);
  }
}

const N = NATIVE * NATIVE;
const diff = new Uint8Array(N);
for (let i = 0; i < N; i++) {
  let d = 0;
  for (let c = 0; c < 3; c++) d = Math.max(d, Math.abs(edit.data[i * 4 + c] - base.data[i * 4 + c]));
  diff[i] = d;
}

const toTrait = (n) => n * SCALE + OFFSET;
const region = new Uint8Array(N);
for (let y = box[1]; y <= box[3]; y++) {
  for (let x = box[0]; x <= box[2]; x++) {
    if (!EYE_FREE.has(category)) {
      const tx = toTrait(x), ty = toTrait(y);
      if (EYES.some(([ex, ey]) => Math.hypot(tx - ex, ty - ey) < EYE_KEEP_OUT)) continue;
    }
    region[y * NATIVE + x] = 1;
  }
}

// Square-kernel erode/dilate on a 0/1 mask.
const morph = (src, r, erode) => {
  const tmp = new Uint8Array(N), out = new Uint8Array(N);
  for (let y = 0; y < NATIVE; y++) {
    for (let x = 0; x < NATIVE; x++) {
      let v = erode ? 1 : 0;
      for (let k = -r; k <= r && v === (erode ? 1 : 0); k++) {
        const xx = x + k;
        const s = xx < 0 || xx >= NATIVE ? 0 : src[y * NATIVE + xx];
        if (erode ? !s : s) v = erode ? 0 : 1;
      }
      tmp[y * NATIVE + x] = v;
    }
  }
  for (let y = 0; y < NATIVE; y++) {
    for (let x = 0; x < NATIVE; x++) {
      let v = erode ? 1 : 0;
      for (let k = -r; k <= r && v === (erode ? 1 : 0); k++) {
        const yy = y + k;
        const s = yy < 0 || yy >= NATIVE ? 0 : tmp[yy * NATIVE + x];
        if (erode ? !s : s) v = erode ? 0 : 1;
      }
      out[y * NATIVE + x] = v;
    }
  }
  return out;
};

// --behind-beak: the base's own beak (orange fill plus its black outline) is
// taken out of the region, so the prop can only pass behind the real beak.
// For edits where the model redrew the beak while adding the prop: the
// redrawn beak can't leak into the layer, and the real beak stays on top.
// The only orange inside the mouth box is the beak (the feet sit below it).
// The outline is grown ring by ring for as long as the ring is mostly dark.
if (opts['behind-beak'] !== undefined) {
  let beak = new Uint8Array(N);
  for (let y = box[1]; y <= box[3]; y++) {
    for (let x = box[0]; x <= box[2]; x++) {
      const i = y * NATIVE + x, [r, g, b] = base.data.subarray(i * 4, i * 4 + 3);
      if (r > 200 && g > 90 && g < 210 && b < 110) beak[i] = 1;
    }
  }
  let grown = 0;
  for (;;) {
    const next = morph(beak, 1, false);
    let ring = 0, dark = 0;
    for (let i = 0; i < N; i++) {
      if (!next[i] || beak[i]) continue;
      ring++;
      if (Math.max(base.data[i * 4], base.data[i * 4 + 1], base.data[i * 4 + 2]) < 90) dark++;
    }
    if (!ring || dark / ring < 0.5 || grown >= 20) break;
    beak = next; grown++;
  }
  // One more ring so the outline's antialiased fringe goes too.
  beak = morph(beak, 1, false);
  let removed = 0;
  for (let i = 0; i < N; i++) if (beak[i] && region[i]) { region[i] = 0; removed++; }
  console.log(`behind-beak: outline ${grown}px, ${removed}px of beak taken out of the region`);
}

let mask = new Uint8Array(N);
for (let i = 0; i < N; i++) mask[i] = region[i] && diff[i] >= threshold ? 1 : 0;
if (openR > 0) mask = morph(morph(mask, openR, true), openR, false);

// Where the model's outline runs over one of the base's own black lines the
// diff is zero, so the outline has gaps. Over the bare base nobody sees them,
// but a body trait underneath shows through. A close bridges gaps up to
// ~2*closeR wide, and only takes pixels the edit has as outline-dark, so it
// adds the model's own outline and not the base's body fill.
if (closeR > 0) {
  const closed = morph(morph(mask, closeR, false), closeR, true);
  let added = 0;
  for (let i = 0; i < N; i++) {
    if (mask[i] || !closed[i] || !region[i]) continue;
    if (Math.max(edit.data[i * 4], edit.data[i * 4 + 1], edit.data[i * 4 + 2]) > DARK) continue;
    mask[i] = 1; added++;
  }
  console.log(`close ${closeR}: bridged ${added}px of outline`);
}

// 8-way connected components of the pixels where in(i) holds, largest first.
const components = (inSet) => {
  const seen = new Uint8Array(N), comps = [];
  for (let i = 0; i < N; i++) {
    if (!inSet(i) || seen[i]) continue;
    const c = { area: 0, x0: 1e9, y0: 1e9, x1: -1, y1: -1, pixels: [] }, stack = [i];
    seen[i] = 1;
    while (stack.length) {
      const p = stack.pop(), x = p % NATIVE, y = (p - x) / NATIVE;
      c.area++; c.pixels.push(p);
      c.x0 = Math.min(c.x0, x); c.x1 = Math.max(c.x1, x);
      c.y0 = Math.min(c.y0, y); c.y1 = Math.max(c.y1, y);
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const xx = x + dx, yy = y + dy;
          if (xx < 0 || yy < 0 || xx >= NATIVE || yy >= NATIVE) continue;
          const q = yy * NATIVE + xx;
          if (inSet(q) && !seen[q]) { seen[q] = 1; stack.push(q); }
        }
      }
    }
    comps.push(c);
  }
  return comps.sort((a, b) => b.area - a.area);
};

// Pinholes inside the drawn shape, where the edit happens to match the base
// (JPG noise, or a fish's grey crossing a similar grey), come back filled.
// Only small ones: a real opening, like the middle of a ring, stays clear.
const holes = components((i) => !mask[i] && region[i])
  .filter((c) => c.area <= Number(opts['max-hole']) && c.x0 > box[0] && c.y0 > box[1] && c.x1 < box[2] && c.y1 < box[3]);
for (const c of holes) for (const p of c.pixels) mask[p] = 1;
if (holes.length) console.log(`filled ${holes.length} pinholes`);

// --fill-enclosed: a fill too close to the white background to show up in
// the diff (an off-white eggshell above the head) comes out transparent.
// Background pixels of the base that the trait's outline, together with the
// penguin, cuts off from the image border are inside the trait: they're
// taken from the edit. Only for traits with no real openings.
if (opts['fill-enclosed']) {
  const isBg = (i) => Math.min(base.data[i * 4], base.data[i * 4 + 1], base.data[i * 4 + 2]) > 250;
  const flood = (pass) => {
    const seen = new Uint8Array(N), stack = [];
    for (let i = 0; i < NATIVE; i++) for (const p of [i, (NATIVE - 1) * NATIVE + i, i * NATIVE, i * NATIVE + NATIVE - 1]) {
      if (pass(p) && !seen[p]) { seen[p] = 1; stack.push(p); }
    }
    while (stack.length) {
      const p = stack.pop(), x = p % NATIVE, y = (p - x) / NATIVE;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const xx = x + dx, yy = y + dy;
        if (xx < 0 || yy < 0 || xx >= NATIVE || yy >= NATIVE) continue;
        const q = yy * NATIVE + xx;
        if (pass(q) && !seen[q]) { seen[q] = 1; stack.push(q); }
      }
    }
    return seen;
  };
  const outside = flood(isBg), reached = flood((i) => isBg(i) && !mask[i]);
  let filled = 0;
  for (let i = 0; i < N; i++) if (outside[i] && !reached[i] && !mask[i] && region[i]) { mask[i] = 1; filled++; }
  console.log(`fill-enclosed: ${filled}px of background inside the trait`);
}

// Reported so a ghost shows up as its own blob; anything under --min-area is
// dropped as leftover noise.
const comps = components((i) => mask[i]);
for (const c of comps) {
  const kept = c.area >= minArea;
  if (!kept) for (const p of c.pixels) mask[p] = 0;
  if (kept) console.log(`component ${c.area}px at native (${c.x0},${c.y0})-(${c.x1},${c.y1})`);
}
const dropped = comps.filter((c) => c.area < minArea).length;
if (dropped) console.log(`dropped ${dropped} components under ${minArea}px`);

// Alpha: a ramp on diff strength from threshold/2 up to the threshold, so
// everything in the mask is opaque (a black outline over the ~35-grey body
// only differs by ~35) and the ramp only softens the one-pixel rim grown
// past the mask, bringing back the antialiasing the open shaved off.
const rim = morph(mask, 1, false);
const lo = threshold / 2, hi = threshold;
const layer = { width: NATIVE, height: NATIVE, data: new Uint8Array(N * 4) };
for (let i = 0; i < N; i++) {
  if (!rim[i] || !region[i]) continue;
  const a = mask[i] ? 1 : Math.min(1, (diff[i] - lo) / (hi - lo));
  if (a <= 0) continue;
  layer.data.set([edit.data[i * 4], edit.data[i * 4 + 1], edit.data[i * 4 + 2], Math.round(a * 255)], i * 4);
}

// --full (aura): a full-canvas background, like american-aura. The layer is the
// whole edit, opaque, except the penguin's silhouette (plus 3px), which is
// filled from the surrounding background so no copy of the penguin's outline
// can ghost next to the real one. It's hidden behind the penguin anyway.
if (opts.full) {
  const isBg = (i) => Math.min(base.data[i * 4], base.data[i * 4 + 1], base.data[i * 4 + 2]) > 250;
  const outside = new Uint8Array(N), stack = [];
  for (let i = 0; i < NATIVE; i++) for (const p of [i, (NATIVE - 1) * NATIVE + i, i * NATIVE, i * NATIVE + NATIVE - 1]) {
    if (isBg(p) && !outside[p]) { outside[p] = 1; stack.push(p); }
  }
  while (stack.length) {
    const p = stack.pop(), x = p % NATIVE, y = (p - x) / NATIVE;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const xx = x + dx, yy = y + dy;
      if (xx < 0 || yy < 0 || xx >= NATIVE || yy >= NATIVE) continue;
      const q = yy * NATIVE + xx;
      if (isBg(q) && !outside[q]) { outside[q] = 1; stack.push(q); }
    }
  }
  const hole = morph(outside.map((v) => 1 - v), 3, false);
  const filled = new Uint8Array(N);
  let front = [];
  for (let i = 0; i < N; i++) {
    if (hole[i]) continue;
    layer.data.set([edit.data[i * 4], edit.data[i * 4 + 1], edit.data[i * 4 + 2], 255], i * 4);
    filled[i] = 1; front.push(i);
  }
  while (front.length) {
    const next = [];
    for (const p of front) {
      const x = p % NATIVE, y = (p - x) / NATIVE;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const xx = x + dx, yy = y + dy;
        if (xx < 0 || yy < 0 || xx >= NATIVE || yy >= NATIVE) continue;
        const q = yy * NATIVE + xx;
        if (filled[q]) continue;
        filled[q] = 1; layer.data.set(layer.data.subarray(p * 4, p * 4 + 4), q * 4); next.push(q);
      }
    }
    front = next;
  }
  console.log('full: whole edit taken, penguin silhouette filled from the background');
}

// --fit-top Y: the trait canvas only shows native y >= ~146, and models draw
// hats taller than the room above the head. If the layer's top is above
// native Y, it's scaled down uniformly about its bottom centre (where a hat
// rests on the head) until the top sits at Y. Same idea as rescale-trait.mjs:
// the model's art is resized, never redrawn. Use a --box that starts above
// 146 so the part that would be cut off is in the layer to begin with.
// --fit-right X / --fit-left X do the same for held items that run off the
// side (the canvas shows native x ~146..878), scaling about the layer's
// bottom corner nearest the body, where the flipper grips it.
function layerBox() {
  let x0 = NATIVE, y0 = NATIVE, x1 = -1, y1 = -1;
  for (let y = 0; y < NATIVE; y++) for (let x = 0; x < NATIVE; x++) {
    if (layer.data[(y * NATIVE + x) * 4 + 3] < 8) continue;
    x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y);
  }
  return { x0, y0, x1, y1 };
}
function scaleLayer(f, ax, ay) {
    const src = layer.data, dst = new Uint8Array(N * 4);
    for (let y = 0; y < NATIVE; y++) {
      const sy = ay + (y + 0.5 - ay) / f - 0.5, iy = Math.floor(sy), fy = sy - iy;
      for (let x = 0; x < NATIVE; x++) {
        const sx = ax + (x + 0.5 - ax) / f - 0.5, ix = Math.floor(sx), fx = sx - ix;
        const acc = [0, 0, 0, 0];
        for (const [dx, dy, w] of [[0, 0, (1 - fx) * (1 - fy)], [1, 0, fx * (1 - fy)], [0, 1, (1 - fx) * fy], [1, 1, fx * fy]]) {
          const xx = ix + dx, yy = iy + dy;
          if (xx < 0 || yy < 0 || xx >= NATIVE || yy >= NATIVE || w === 0) continue;
          const s = (yy * NATIVE + xx) * 4, a = src[s + 3] / 255;
          acc[0] += src[s] * a * w; acc[1] += src[s + 1] * a * w; acc[2] += src[s + 2] * a * w; acc[3] += a * w;
        }
        if (acc[3] <= 0) continue;
        dst.set([acc[0] / acc[3], acc[1] / acc[3], acc[2] / acc[3], acc[3] * 255].map(Math.round), (y * NATIVE + x) * 4);
      }
    }
    layer.data = dst;
}
if (opts['fit-top'] !== undefined) {
  const target = Number(opts['fit-top']);
  const { x0, y0, x1, y1 } = layerBox();
  if (y1 >= 0 && y0 < target) {
    const f = (y1 - target) / (y1 - y0), ax = (x0 + x1) / 2, ay = y1;
    scaleLayer(f, ax, ay);
    console.log(`fit-top: top was native y=${y0}, scaled ${f.toFixed(3)}x about (${ax.toFixed(0)},${ay}) to y=${target}`);
  }
}
for (const side of ['right', 'left']) {
  if (opts[`fit-${side}`] === undefined) continue;
  const target = Number(opts[`fit-${side}`]);
  const { x0, x1, y1 } = layerBox();
  const over = side === 'right' ? x1 > target : x0 < target;
  if (x1 < 0 || !over) continue;
  const ax = side === 'right' ? x0 : x1;
  const f = Math.abs(target - ax) / (x1 - x0);
  scaleLayer(f, ax, y1);
  console.log(`fit-${side}: ${side} edge was native x=${side === 'right' ? x1 : x0}, scaled ${f.toFixed(3)}x about (${ax},${y1}) to x=${target}`);
}

// --ground Y: accessories stand on the penguin's ground line, but models draw
// them lower, in front of the feet. After any fit, the layer is moved straight
// up or down (no resize) so its bottom sits at native Y.
if (opts.ground !== undefined) {
  const target = Number(opts.ground);
  const { y1 } = layerBox();
  const dy = target - y1;
  if (y1 >= 0 && dy !== 0) {
    const src = layer.data, dst = new Uint8Array(N * 4);
    for (let y = 0; y < NATIVE; y++) {
      const sy = y - dy;
      if (sy < 0 || sy >= NATIVE) continue;
      dst.set(src.subarray(sy * NATIVE * 4, (sy + 1) * NATIVE * 4), y * NATIVE * 4);
    }
    layer.data = dst;
    console.log(`ground: bottom was native y=${y1}, moved ${dy}px to y=${target}`);
  }
}

// Native -> trait space, bilinear on premultiplied colour.
const out = { width: CANVAS, height: CANVAS, data: Buffer.alloc(CANVAS * CANVAS * 4) };
for (let ty = 0; ty < CANVAS; ty++) {
  const ny = (ty + 0.5 - OFFSET) / SCALE - 0.5;
  const y0 = Math.floor(ny), fy = ny - y0;
  for (let tx = 0; tx < CANVAS; tx++) {
    const nx = (tx + 0.5 - OFFSET) / SCALE - 0.5;
    const x0 = Math.floor(nx), fx = nx - x0;
    const acc = [0, 0, 0, 0];
    for (const [dx, dy, w] of [[0, 0, (1 - fx) * (1 - fy)], [1, 0, fx * (1 - fy)], [0, 1, (1 - fx) * fy], [1, 1, fx * fy]]) {
      const x = x0 + dx, y = y0 + dy;
      if (x < 0 || y < 0 || x >= NATIVE || y >= NATIVE || w === 0) continue;
      const s = (y * NATIVE + x) * 4, a = layer.data[s + 3] / 255;
      acc[0] += layer.data[s] * a * w; acc[1] += layer.data[s + 1] * a * w;
      acc[2] += layer.data[s + 2] * a * w; acc[3] += a * w;
    }
    if (acc[3] <= 0) continue;
    const d = (ty * CANVAS + tx) * 4;
    out.data[d] = Math.round(acc[0] / acc[3]);
    out.data[d + 1] = Math.round(acc[1] / acc[3]);
    out.data[d + 2] = Math.round(acc[2] / acc[3]);
    out.data[d + 3] = Math.round(acc[3] * 255);
  }
}

const outPath = `public/traits/trait-${name}_${category}.png`;
writeFileSync(outPath, encodeRgba(out));
console.log('wrote', outPath);

if (opts.debug) {
  // The layer alone on a checkerboard and the raw diff, both cropped to the
  // region box at 2x, for spotting ghosts before anything is composited.
  mkdirSync(opts.debug, { recursive: true });
  const [bx0, by0, bx1, by1] = box, w = (bx1 - bx0 + 1) * 2, h = (by1 - by0 + 1) * 2;
  const alone = { width: w, height: h, data: Buffer.alloc(w * h * 4) };
  const heat = { width: w, height: h, data: Buffer.alloc(w * h * 4) };
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (by0 + (y >> 1)) * NATIVE + bx0 + (x >> 1), d = (y * w + x) * 4;
      const check = ((x >> 4) + (y >> 4)) % 2 ? 200 : 245, a = layer.data[i * 4 + 3] / 255;
      for (let c = 0; c < 3; c++) alone.data[d + c] = Math.round(layer.data[i * 4 + c] * a + check * (1 - a));
      const v = Math.min(255, diff[i] * 3);
      heat.data.set([v, mask[i] ? 255 : v, region[i] ? v : 90], d);
      alone.data[d + 3] = heat.data[d + 3] = 255;
    }
  }
  writeFileSync(`${opts.debug}/${name}-layer.png`, encodeRgba(alone));
  writeFileSync(`${opts.debug}/${name}-diff.png`, encodeRgba(heat));
  console.log('debug in', opts.debug);
}
