// usage: node .trait-work/unpenguin.mjs <pair.png> <out.png> [dilate=3]
// Whitens every pixel covered by the reference penguin (docs/trait-refs/ping-on-white.png, dilated), so an item
// Gemini drew touching the penguin separates from it. Assumes the pair kept the penguin at ref geometry.
import sharp from 'sharp';
const [src, out, dArg = '3'] = process.argv.slice(2); const D = Number(dArg);
const load = async (f) => sharp(f).resize(1024, 1024).removeAlpha().raw().toBuffer();
const P = await load(src), R = await load('docs/trait-refs/ping-on-white.png'), W = 1024;
const ink = new Uint8Array(W * W);
for (let p = 0; p < W * W; p++) if (Math.min(R[p * 3], R[p * 3 + 1], R[p * 3 + 2]) < 225) ink[p] = 1;
for (let y = 0; y < W; y++) for (let x = 0; x < W; x++) {
  let hit = false;
  for (let dy = -D; dy <= D && !hit; dy++) for (let dx = -D; dx <= D; dx++) {
    const nx = x + dx, ny = y + dy; if (nx >= 0 && ny >= 0 && nx < W && ny < W && ink[ny * W + nx]) { hit = true; break; } }
  if (hit) P.fill(255, (y * W + x) * 3, (y * W + x) * 3 + 3);
}
await sharp(P, { raw: { width: W, height: W, channels: 3 } }).png().toFile(out);
