// erase the stick (grey + its outline) inside the spark burst; report item bbox + stick bottom end
import sharp from 'sharp';
const [src, out, cx, cy, len] = process.argv.slice(2).map((v, i) => i < 2 ? v : Number(v));
const { data: P, info } = await sharp(src).removeAlpha().raw().toBuffer({ resolveWithObject: true }); const W = info.width;
const ux = -0.286, uy = 0.958; // unit vector from burst centre toward the stick bottom
for (let y = 0; y < W; y++) for (let x = 0; x < W; x++) {
  const dx = x - cx, dy = y - cy, t = dx * ux + dy * uy, d = Math.abs(dx * uy - dy * ux);
  if (t > -14 && t < len && d < 14) { const j = ((2 * cy - y) * W + (2 * cx - x)) * 3, i = (y * W + x) * 3; P[i] = P[j]; P[i + 1] = P[j + 1]; P[i + 2] = P[j + 2]; }
}
let x0 = W, x1 = 0, y0 = W, y1 = 0, bx = 0;
for (let y = 0; y < W; y++) for (let x = 0; x < W; x++) { const i = (y * W + x) * 3;
  if (Math.min(P[i], P[i + 1], P[i + 2]) < 200) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); if (y >= y1) { y1 = y; bx = x; } } }
console.log(`bbox x ${x0}-${x1} y ${y0}-${y1}, bottom end x ${bx}`);
await sharp(P, { raw: { width: W, height: W, channels: 3 } }).png().toFile(out);
