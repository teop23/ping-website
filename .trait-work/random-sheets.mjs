// usage: node .trait-work/random-sheets.mjs <outDir> <count> [seed=1]
// Random PINGs at builder geometry (599 frame, base 1.4x, auras under the base, rest in TRAIT_RENDER_ORDER),
// 5x5 contact sheets of 400px tiles, tile number top-left. <outDir>/pings.json maps tile number -> traits.
import sharp from 'sharp';
import { readdirSync, mkdirSync, writeFileSync, readFileSync } from 'fs';
const clash = new Set();
for (const [a, bs] of Object.entries(JSON.parse(readFileSync('public/trait-clashes.json', 'utf8')).pairs)) for (const b of bs) clash.add(a + '|' + b).add(b + '|' + a);
const [out, countArg, seedArg = '1'] = process.argv.slice(2);
mkdirSync(out, { recursive: true });
const ORDER = ['aura', 'body', 'face', 'mouth', 'head', 'accessory', 'right_hand', 'left_hand'];
const P = { aura: 0.5, body: 0.7, face: 0.5, mouth: 0.5, head: 0.7, accessory: 0.5, right_hand: 0.6, left_hand: 0.6 };
const byCat = Object.fromEntries(ORDER.map((c) => [c, []]));
for (const f of readdirSync('public/traits')) {
  const m = f.match(/^trait-(.+)_(aura|body|face|mouth|head|accessory|right_hand|left_hand)\.png$/); if (m) byCat[m[2]].push(m[1]);
}
let s = Number(seedArg) >>> 0; const rnd = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32);
const C = 599, B = Math.round(C * 1.4), off = Math.round((B - C) / 2), T = 400, COLS = 5, PER = 25;
const base = await sharp('public/ping.png').resize(B, B).extract({ left: off, top: off, width: C, height: C }).png().toBuffer();
const cache = new Map();
const layer = async (cat, n) => { const k = `${n}_${cat}`; if (!cache.has(k)) cache.set(k, await sharp(`public/traits/trait-${k}.png`).resize(C, C).png().toBuffer()); return cache.get(k); };
const count = Number(countArg), pings = {};
for (let sheet = 0; sheet * PER < count; sheet++) {
  const tiles = [];
  for (let j = 0; j < PER && sheet * PER + j < count; j++) {
    const id = sheet * PER + j + 1, pick = {};
    for (const c of ORDER) if (rnd() < P[c]) {
      const fits = byCat[c].filter((n) => !Object.entries(pick).some(([pc, pn]) => clash.has(`${pn}_${pc}|${n}_${c}`)));
      if (fits.length) pick[c] = fits[Math.floor(rnd() * fits.length)];
    }
    pings[id] = pick;
    const layers = [];
    if (pick.aura) layers.push({ input: await layer('aura', pick.aura) });
    layers.push({ input: base });
    for (const c of ORDER.slice(1)) if (pick[c]) layers.push({ input: await layer(c, pick[c]) });
    const f = await sharp({ create: { width: C, height: C, channels: 4, background: '#F3F1EA' } }).composite(layers).png().toBuffer();
    const img = await sharp(f).resize(T, T).png().toBuffer();
    const tag = Buffer.from(`<svg width="64" height="30"><rect width="100%" height="100%" fill="#111"/><text x="5" y="22" font-family="sans-serif" font-size="20" fill="#ff0">${id}</text></svg>`);
    const x = (j % COLS) * (T + 6), y = Math.floor(j / COLS) * (T + 6);
    tiles.push({ input: img, left: x, top: y }, { input: tag, left: x, top: y });
  }
  const file = `${out}/sheet-${String(sheet + 1).padStart(2, '0')}.png`;
  await sharp({ create: { width: COLS * (T + 6) - 6, height: 5 * (T + 6) - 6, channels: 4, background: '#666' } }).composite(tiles).png().toFile(file);
}
writeFileSync(`${out}/pings.json`, JSON.stringify(pings, null, 1));
console.log('done', Object.keys(pings).length);
