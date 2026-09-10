import { readFileSync } from 'fs';
import { decodePng } from './lib/png.mjs';

/**
 * Pixel-distance check for anything drawn near the eyes.
 *
 *   node scripts/check-eye-clearance.mjs [--min 6] trait-a.png [trait-b.png ...]
 *
 * Eyes sit at (495,381) and (658,381) on the 1147 trait canvas, radius ~13.
 * The beak's own top edge is only ~9px below the eye's bottom edge, so a
 * mouth trait has almost no room: two mouth batches shipped that "looked
 * fine" and overlapped the eyes once rendered. This measures instead of
 * looking: for every pixel with meaningful alpha, distance to the nearer eye
 * center minus the eye radius, and fails if the smallest such gap is under
 * --min. Exit code 1 on failure so it can gate a batch.
 *
 * Only meaningful for categories that paint in front of the base (everything
 * but aura) and that are meant to leave the eyes alone. A trait that
 * intentionally covers the eyes (glasses, a blindfold) will fail by design -
 * don't run it on those.
 */
const args = process.argv.slice(2);
let min = 6;
const files = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--min') min = Number(args[++i]);
  else files.push(args[i]);
}

const EYES = [[495, 381], [658, 381]];
const EYE_R = 13;
const CANVAS = 1147;

let failed = false;
for (const file of files) {
  const img = decodePng(readFileSync(file));
  const scale = CANVAS / img.width;
  let worst = Infinity, at = null;
  for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {
      if (img.data[(y * img.width + x) * 4 + 3] < 32) continue;
      const tx = x * scale, ty = y * scale;
      for (const [ex, ey] of EYES) {
        const gap = Math.hypot(tx - ex, ty - ey) - EYE_R;
        if (gap < worst) { worst = gap; at = [Math.round(tx), Math.round(ty)]; }
      }
    }
  }
  const ok = worst >= min;
  if (!ok) failed = true;
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${file}: nearest opaque pixel ${worst === Infinity ? 'none' : worst.toFixed(1) + 'px'} from an eye${at ? ` (trait-space ${at[0]},${at[1]})` : ''}`);
}
process.exit(failed ? 1 : 0);
