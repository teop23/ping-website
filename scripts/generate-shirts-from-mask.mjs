import sharp from 'sharp';
import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import { decodePng, encodeRgba } from './lib/png.mjs';

/**
 * Rebuilds the 5 shirt traits from generate-body-traits-svg.mjs.
 *
 * The first version hand-drew an approximate tee silhouette in SVG (collar
 * curve, sleeve points, hem) rather than using a real garment's shape. Placed
 * next to trait-blank-tee_body.png it is visibly wrong - shorter, a
 * different collar angle, doesn't reach as far down the torso. It rendered
 * without error and passed every mechanical check because nothing checks
 * "does this shape match," only "is this a valid trait file."
 *
 * Fix: use trait-blank-tee_body.png itself as the garment. Classify its
 * pixels into outline (near-black stroke, copied through untouched so the
 * real linework survives exactly) and interior (the white fill, replaced
 * with this trait's own color/pattern). Transparent stays transparent, and
 * is enforced as a hard clip at the end regardless of what a pattern layer
 * drew - a pattern can never spill outside the real garment's silhouette.
 *
 * Check registration with:
 *   node scripts/preview-trait.mjs out.png .trait-work/trait-<name>_body.png
 */

const OUT = '.trait-work';
mkdirSync(OUT, { recursive: true });

const mask = decodePng(readFileSync('public/traits/trait-blank-tee_body.png'));
const { width, height } = mask;

const classify = (i) => {
  const o = i * 4;
  const a = mask.data[o + 3];
  if (a <= 8) return 'transparent';
  const r = mask.data[o], g = mask.data[o + 1], b = mask.data[o + 2];
  if (r < 50 && g < 50 && b < 50) return 'outline';
  return 'interior';
};

/** Rasterize an SVG pattern layer at the mask's own size, for stamping onto
 *  the interior. Positions in the SVG use the same 1147 coordinate space as
 *  the mask, so no rescaling is needed. */
const rasterizePattern = async (svgBody) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${svgBody}</svg>`;
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  return decodePng(buf);
};

/**
 * @param {string} baseFill - solid color for the interior before any pattern
 * @param {object|null} pattern - decoded pattern layer to stamp over the fill
 */
const buildShirt = (baseFill, pattern) => {
  const [fr, fg, fb] = baseFill;
  const out = Buffer.alloc(width * height * 4);

  for (let i = 0; i < width * height; i++) {
    const o = i * 4;
    const kind = classify(i);

    if (kind === 'transparent') continue; // stays 0,0,0,0

    if (kind === 'outline') {
      out[o] = mask.data[o];
      out[o + 1] = mask.data[o + 1];
      out[o + 2] = mask.data[o + 2];
      out[o + 3] = mask.data[o + 3];
      continue;
    }

    // interior: base fill, then blend the pattern layer's own pixel over it
    let r = fr, g = fg, b = fb;
    if (pattern) {
      const pa = pattern.data[o + 3] / 255;
      if (pa > 0) {
        r = Math.round(pattern.data[o] * pa + r * (1 - pa));
        g = Math.round(pattern.data[o + 1] * pa + g * (1 - pa));
        b = Math.round(pattern.data[o + 2] * pa + b * (1 - pa));
      }
    }
    out[o] = r;
    out[o + 1] = g;
    out[o + 2] = b;
    out[o + 3] = mask.data[o + 3]; // preserve the garment's own edge antialiasing
  }

  return { width, height, data: out };
};

const run = async () => {
  // hawaiian-shirt: hibiscus flowers scattered across the fill.
  const hawaiianFlowers = [[440, 560], [570, 610], [700, 555], [510, 700], [650, 720], [460, 650]]
    .map(([x, y]) => `
      <g transform="translate(${x} ${y})">
        ${[0, 72, 144, 216, 288].map((deg) => `<ellipse cx="0" cy="-16" rx="9" ry="16" fill="#E8536B" transform="rotate(${deg})"/>`).join('')}
        <circle r="7" fill="#E8C34A"/>
      </g>`).join('');
  const hawaiianPattern = await rasterizePattern(hawaiianFlowers);
  writeFileSync(`${OUT}/trait-hawaiian-shirt_body.png`, encodeRgba(buildShirt([242, 217, 176], hawaiianPattern)));

  // tuxedo-shirt: black panels + white bib + bowtie, all as one pattern layer.
  const CX = 551, CY = 643;
  // First pass had each side panel taper to its own point at the hem,
  // leaving an 80px gap of bare white fabric between the two points where
  // neither triangle reached. Full half-width rectangles behind the white
  // bib (painted last, on top) guarantee no such gap is possible.
  const tuxedo = `
    <rect x="${CX - 320}" y="${CY - 200}" width="360" height="450" fill="#181B20"/>
    <rect x="${CX - 40}" y="${CY - 200}" width="360" height="450" fill="#181B20"/>
    <path d="M ${CX - 50} ${CY - 130} L ${CX} ${CY - 60} L ${CX + 50} ${CY - 130} L ${CX} ${CY + 220} L ${CX - 50} ${CY + 220} Z" fill="white"/>
    <path d="M ${CX - 32} ${CY - 108} L ${CX - 6} ${CY - 88} L ${CX - 32} ${CY - 68} L ${CX - 44} ${CY - 88} Z" fill="#181B20"/>
    <path d="M ${CX + 32} ${CY - 108} L ${CX + 6} ${CY - 88} L ${CX + 32} ${CY - 68} L ${CX + 44} ${CY - 88} Z" fill="#181B20"/>
  `;
  const tuxedoPattern = await rasterizePattern(tuxedo);
  writeFileSync(`${OUT}/trait-tuxedo-shirt_body.png`, encodeRgba(buildShirt([255, 255, 255], tuxedoPattern)));

  // hoodie: drawstrings + hood shadow as the pattern, slate base fill.
  const hoodie = `
    <path d="M ${CX - 150} ${CY - 150} Q ${CX} ${CY - 55} ${CX + 150} ${CY - 150}
             Q ${CX + 90} ${CY - 100} ${CX} ${CY - 95}
             Q ${CX - 90} ${CY - 100} ${CX - 150} ${CY - 150} Z" fill="#3A4250"/>
    <path d="M ${CX - 40} ${CY - 90} L ${CX - 46} ${CY + 10}" stroke="#D9DEE4" stroke-width="9" stroke-linecap="round"/>
    <path d="M ${CX + 40} ${CY - 90} L ${CX + 46} ${CY + 10}" stroke="#D9DEE4" stroke-width="9" stroke-linecap="round"/>
    <circle cx="${CX - 46}" cy="${CY + 20}" r="7" fill="#D9DEE4"/>
    <circle cx="${CX + 46}" cy="${CY + 20}" r="7" fill="#D9DEE4"/>
  `;
  const hoodiePattern = await rasterizePattern(hoodie);
  writeFileSync(`${OUT}/trait-hoodie_body.png`, encodeRgba(buildShirt([74, 85, 104], hoodiePattern)));

  // sailor-shirt: horizontal stripes across the whole fill.
  const stripeCount = 9;
  const stripeHeight = (height * 0.6) / stripeCount;
  const stripes = Array.from({ length: stripeCount }, (_, i) =>
    i % 2 === 1 ? `<rect x="0" y="${CY - 220 + i * stripeHeight}" width="${width}" height="${stripeHeight}" fill="#2E5C8A"/>` : ''
  ).join('');
  const sailorPattern = await rasterizePattern(stripes);
  writeFileSync(`${OUT}/trait-sailor-shirt_body.png`, encodeRgba(buildShirt([255, 255, 255], sailorPattern)));

  // flannel-shirt: plaid grid across the whole fill.
  const hLines = Array.from({ length: 5 }, (_, i) => `<rect x="0" y="${CY - 220 + i * 110}" width="${width}" height="13" fill="#3A2318"/>`).join('');
  const vLines = Array.from({ length: 7 }, (_, i) => `<rect x="${CX - 320 + i * 110}" y="0" width="13" height="${height}" fill="#3A2318"/>`).join('');
  const flannelPattern = await rasterizePattern(hLines + vLines);
  writeFileSync(`${OUT}/trait-flannel-shirt_body.png`, encodeRgba(buildShirt([138, 46, 46], flannelPattern)));

  console.log('rebuilt 5 shirts from the real blank-tee mask');
};

run();
