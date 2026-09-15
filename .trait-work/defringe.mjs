// usage: node .trait-work/defringe.mjs <outDir|--inplace> <png>...
// Removes the light halo left from cutting art off white: a pixel within BAND px of transparency that is
// light grey/white, with a dark opaque outline pixel within REACH px, fades to transparent outline black
// (alpha by darkness). Coloured or interior pixels are never touched.
import sharp from 'sharp';
import path from 'path';
const [dest, ...files] = process.argv.slice(2);
const BAND = 3, REACH = 3;
for (const f of files) {
  const { data, info } = await sharp(f).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height, N = W * H;
  const dist = new Uint8Array(N).fill(255); let frontier = [];
  for (let p = 0; p < N; p++) if (data[p * 4 + 3] <= 8) { dist[p] = 0; frontier.push(p); }
  for (let d = 1; d <= BAND && frontier.length; d++) { const next = [];
    for (const p of frontier) { const x = p % W, y = (p / W) | 0;
      for (const [dx, dy] of [[1,0],[-1,0],[0,1],[0,-1]]) { const nx = x + dx, ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue; const q = ny * W + nx;
        if (dist[q] === 255) { dist[q] = d; next.push(q); } } }
    frontier = next; }
  const dark = (q) => { const i = q * 4; return data[i + 3] > 200 && data[i] + data[i + 1] + data[i + 2] < 180; };
  let changed = 0;
  for (let p = 0; p < N; p++) {
    if (dist[p] === 0 || dist[p] === 255) continue; const i = p * 4;
    const r = data[i], g = data[i + 1], b = data[i + 2], mn = Math.min(r, g, b), mx = Math.max(r, g, b);
    if (mn < 70 || mx - mn > 40) continue;
    const x = p % W, y = (p / W) | 0; let near = false;
    for (let dy = -REACH; dy <= REACH && !near; dy++) for (let dx = -REACH; dx <= REACH; dx++) {
      const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
      if (dark(ny * W + nx)) { near = true; break; } }
    if (!near) continue;
    data[i + 3] = Math.round(data[i + 3] * Math.max(0, (255 - mn) / 185)); data[i] = data[i + 1] = data[i + 2] = 20; changed++;
  }
  const out = dest === '--inplace' ? f : path.join(dest, path.basename(f));
  await sharp(data, { raw: { width: W, height: H, channels: 4 } }).png({ compressionLevel: 9 }).toFile(out + (dest === '--inplace' ? '.tmp' : ''));
  if (dest === '--inplace') { const fs = await import('fs'); fs.renameSync(out + '.tmp', out); }
  console.log(changed, path.basename(f));
}
