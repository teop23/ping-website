import sharp from 'sharp';
const [src, out, cx, cy, r] = process.argv.slice(2).map((v, i) => i < 2 ? v : Number(v));
const { data: P, info } = await sharp(src).removeAlpha().raw().toBuffer({ resolveWithObject: true }); const W = info.width;
// ray fill colour: median of orange pixels near the centre
const cs = []; for (let y = cy - 60; y < cy + 60; y++) for (let x = cx - 60; x < cx + 60; x++) { const i = (y * W + x) * 3;
  if (P[i] > 200 && P[i + 1] > 140 && P[i + 1] < 210 && P[i + 2] < 130) cs.push([P[i], P[i + 1], P[i + 2]]); }
cs.sort((a, b) => a[1] - b[1]); const c = process.env.CORE ? process.env.CORE.split(",").map(Number) : cs[cs.length >> 1];
for (let y = cy - r; y <= cy + r; y++) for (let x = cx - r; x <= cx + r; x++) {
  const d = Math.hypot(x - cx, y - cy); if (d > r) continue; const i = (y * W + x) * 3;
  const a = Math.min(1, r - d); P[i] = Math.round(P[i] * (1 - a) + c[0] * a); P[i + 1] = Math.round(P[i + 1] * (1 - a) + c[1] * a); P[i + 2] = Math.round(P[i + 2] * (1 - a) + c[2] * a); }
console.log('core colour', c);
await sharp(P, { raw: { width: W, height: W, channels: 3 } }).png().toFile(out);
