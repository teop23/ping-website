// usage: node .trait-work/relace.mjs <png>... : re-encode interlaced (Adam7) if the committed HEAD version was
import sharp from 'sharp';
import { execFileSync } from 'child_process';
import { renameSync, statSync } from 'fs';
let n = 0, before = 0, after = 0;
for (const f of process.argv.slice(2)) {
  const head = execFileSync('git', ['show', `HEAD:${f}`], { maxBuffer: 1 << 26 });
  before += head.length;
  if (head[28] === 1) { await sharp(f).png({ progressive: true, compressionLevel: 9 }).toFile(f + '.tmp'); renameSync(f + '.tmp', f); n++; }
  after += statSync(f).size;
}
console.log(`${n} re-interlaced; bytes ${before} -> ${after}`);
