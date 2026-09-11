import { readFileSync, writeFileSync } from 'fs';
import sharp from 'sharp';
import { encodeRgba } from './lib/png.mjs';

/**
 * Put an image-model edit back into the base's exact framing.
 *
 *   node scripts/register-edit.mjs <edit.jpg|png> <out.png> [--box x0,y0,x1,y1]
 *
 * Gemini sometimes returns the penguin moved or shrunk, or on a different
 * canvas size. extract-trait-from-edit.mjs diffs pixel-for-pixel against
 * docs/trait-refs/ping-on-white.png, so a shifted edit shows up as a ghost
 * of the whole penguin. This fits edit(x) = s * base(x) + d:
 *   1. a coarse guess from the silhouette's top, bottom and left edges (the
 *      prop may stick out on the right, so the right edge is not used)
 *   2. a grid search on s, dx, dy minimising mean diff at quarter size,
 *      ignoring the --box region (default: the mouth box), where the prop is
 * then resamples the edit into base coordinates on white, 1024 square.
 */

const args = process.argv.slice(2);
const [editPath, outPath] = args;
const flag = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null; };
const box = (flag('--box') ?? '380,340,878,625').split(',').map(Number);

const load = async (p) => {
  const { data, info } = await sharp(p).flatten({ background: '#ffffff' }).removeAlpha().raw()
    .toBuffer({ resolveWithObject: true });
  return { data, w: info.width, h: info.height };
};
const base = await load('docs/trait-refs/ping-on-white.png');
const edit = await load(editPath);
const N = base.w;

const bbox = (img) => {
  let x0 = img.w, y0 = img.h, x1 = 0, y1 = 0;
  for (let y = 0; y < img.h; y++) for (let x = 0; x < img.w; x++) {
    const i = (y * img.w + x) * 3;
    if (Math.min(img.data[i], img.data[i + 1], img.data[i + 2]) < 200) {
      if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
    }
  }
  return { x0, y0, x1, y1 };
};
const bb = bbox(base), eb = bbox(edit);
let s = (eb.y1 - eb.y0) / (bb.y1 - bb.y0);
let dx = eb.x0 - s * bb.x0, dy = eb.y0 - s * bb.y0;

const sample = (img, x, y, c) => {
  if (x < 0 || y < 0 || x > img.w - 1 || y > img.h - 1) return 255;
  const x0 = Math.floor(x), y0 = Math.floor(y), x1 = Math.min(x0 + 1, img.w - 1), y1 = Math.min(y0 + 1, img.h - 1);
  const fx = x - x0, fy = y - y0, g = (xx, yy) => img.data[(yy * img.w + xx) * 3 + c];
  return (g(x0, y0) * (1 - fx) + g(x1, y0) * fx) * (1 - fy) + (g(x0, y1) * (1 - fx) + g(x1, y1) * fx) * fy;
};
const inBox = (x, y) => x >= box[0] && x <= box[2] && y >= box[1] && y <= box[3];
// --penguin: for full-canvas auras nothing outside the penguin matches the
// base, so the fit uses only the penguin itself: the base's non-background
// pixels (everything the white border can't reach), shrunk by 4px so the
// outline's antialiased rim over the new background doesn't count.
const penguinOnly = args.includes('--penguin');
let skip = (x, y) => inBox(x, y);
if (penguinOnly) {
  const isBg = (i) => Math.min(base.data[i * 3], base.data[i * 3 + 1], base.data[i * 3 + 2]) > 250;
  const out = new Uint8Array(N * N), stack = [];
  for (let i = 0; i < N; i++) for (const p of [i, (N - 1) * N + i, i * N, i * N + N - 1]) if (isBg(p) && !out[p]) { out[p] = 1; stack.push(p); }
  while (stack.length) {
    const p = stack.pop(), x = p % N, y = (p - x) / N;
    for (const [ddx, ddy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const xx = x + ddx, yy = y + ddy, q = yy * N + xx;
      if (xx >= 0 && yy >= 0 && xx < N && yy < N && isBg(q) && !out[q]) { out[q] = 1; stack.push(q); }
    }
  }
  const R = 4, keep = new Uint8Array(N * N);
  for (let y = R; y < N - R; y++) for (let x = R; x < N - R; x++) {
    let ok = true;
    for (let k = -R; k <= R && ok; k++) if (out[y * N + x + k] || out[(y + k) * N + x]) ok = false;
    keep[y * N + x] = ok ? 1 : 0;
  }
  skip = (x, y) => !keep[y * N + x];
}
const cost = (s, dx, dy, step) => {
  let sum = 0, n = 0;
  for (let y = 0; y < N; y += step) for (let x = 0; x < N; x += step) {
    if (skip(x, y)) continue;
    const i = (y * N + x) * 3;
    for (let c = 0; c < 3; c++) sum += Math.abs(base.data[i + c] - sample(edit, s * x + dx, s * y + dy, c));
    n += 3;
  }
  return sum / n;
};

const refine = ([s, dx, dy]) => {
  let best = cost(s, dx, dy, 4);
  for (const [ss, dd, step] of [[0.01, 4, 4], [0.003, 1.5, 4], [0.001, 0.5, 2]]) {
    let improved = true;
    while (improved) {
      improved = false;
      for (const [a, b, c] of [[ss, 0, 0], [-ss, 0, 0], [0, dd, 0], [0, -dd, 0], [0, 0, dd], [0, 0, -dd]]) {
        const k = cost(s + a, dx + b, dy + c, step);
        if (k < best - 1e-4) { best = k; s += a; dx += b; dy += c; improved = true; }
      }
    }
    best = cost(s, dx, dy, step);
  }
  return [s, dx, dy, best];
};
// A prop that sticks out above the head (bubbles) or left of the body fools
// the bbox guess, so an edit already at the base's size also starts from
// identity, and the better of the two fits wins.
let starts = [[s, dx, dy]];
if (edit.w === N && edit.h === N) starts.push([1, 0, 0]);
// With a coloured background the bbox guess is meaningless: coarse-search
// scale and offset around "same centre" instead, and refine the best few.
if (penguinOnly) {
  const k = edit.w / N, c = N / 2, grid = [];
  for (let sc = 0.7; sc <= 1.101; sc += 0.025) for (let ox = -80; ox <= 80; ox += 16) for (let oy = -80; oy <= 80; oy += 16) {
    const g = [sc * k, c * k * (1 - sc) + ox * k, c * k * (1 - sc) + oy * k];
    grid.push([...g, cost(...g, 12)]);
  }
  starts = grid.sort((a, b) => a[3] - b[3]).slice(0, 3).map((g) => g.slice(0, 3));
}
let best;
for (const start of starts) {
  const fit = refine(start);
  console.log(`from s=${start[0].toFixed(4)} d=(${start[1].toFixed(1)},${start[2].toFixed(1)}): cost ${fit[3].toFixed(2)}`);
  if (!best || fit[3] < best[3]) best = fit;
}
[s, dx, dy] = best;
console.log(`fit s=${s.toFixed(4)} d=(${dx.toFixed(1)},${dy.toFixed(1)}) mean diff outside box=${best[3].toFixed(2)}/255`);

const out = Buffer.alloc(N * N * 4);
for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
  const o = (y * N + x) * 4;
  for (let c = 0; c < 3; c++) out[o + c] = Math.round(sample(edit, s * x + dx, s * y + dy, c));
  out[o + 3] = 255;
}
writeFileSync(outPath, encodeRgba({ width: N, height: N, data: out }));
console.log(`wrote ${outPath}`);
