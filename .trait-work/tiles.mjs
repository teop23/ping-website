// usage: node .trait-work/tiles.mjs out.png tileNo... : pulls tiles from .trait-work/random-audit sheets, side by side
import sharp from 'sharp';
const [out, ...ns] = process.argv.slice(2);
const parts = [];
for (const [k, n] of ns.map(Number).entries()) {
  const s = Math.floor((n - 1) / 25) + 1, j = (n - 1) % 25;
  const img = await sharp(`.trait-work/random-audit/sheet-${String(s).padStart(2, '0')}.png`).extract({ left: (j % 5) * 406, top: Math.floor(j / 5) * 406, width: 400, height: 400 }).png().toBuffer();
  parts.push({ input: img, left: (k % 4) * 406, top: Math.floor(k / 4) * 406 });
}
await sharp({ create: { width: Math.min(ns.length, 4) * 406, height: Math.ceil(ns.length / 4) * 406, channels: 3, background: '#666' } }).composite(parts).png().toFile(out);
