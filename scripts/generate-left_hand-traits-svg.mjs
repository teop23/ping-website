import sharp from 'sharp';
import { mkdirSync, writeFileSync } from 'fs';

/**
 * One-off generator: a batch of new `left_hand` traits, Treatment A (flat
 * cartoon), hand-built as SVG and rasterized with sharp.
 *
 * Registration measured off four real left_hand traits (beer, money-bag,
 * solana-coin, handbag), converted to this 1147 canvas: all center within
 * cx 200-260, cy 650-830 - the flipper position, lower-left of frame. Used
 * here: CX=235, CY=740. right_hand's mirror is roughly (870, 670) for
 * reference, not used in this file.
 *
 * Paints AFTER the base (TRAIT_ORDER has left_hand near the end), so no
 * safe-zone mask is needed - anything drawn here is naturally in front.
 *
 * Check registration with:
 *   node scripts/preview-trait.mjs out.png .trait-work/trait-<name>_left_hand.png
 */

const OUT = '.trait-work';
mkdirSync(OUT, { recursive: true });

const BLACK = '#000000';
const CANVAS = 1147;
const CX = 235, CY = 740;

const svg = (body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${CANVAS}" height="${CANVAS}" viewBox="0 0 ${CANVAS} ${CANVAS}">${body}</svg>`;

const TRAITS = {
  // First version's canopy was a two-lobed wing shape that read as a bat or
  // a red boomerang in the builder, not an umbrella. Rebuilt as the
  // universal umbrella silhouette: domed canopy, scalloped hem, ribs, tip
  // and a J handle, big enough to read at the builder's 599px canvas.
  'umbrella': svg(`
    <g transform="translate(${CX - 10} ${CY - 90})">
      <path d="M 0 -150 L 0 132" stroke="${BLACK}" stroke-width="12" stroke-linecap="round"/>
      <path d="M 0 132 Q 0 164 -24 164 Q -46 164 -46 142" fill="none" stroke="${BLACK}" stroke-width="12" stroke-linecap="round"/>
      <path d="M 0 -166 L 0 -190" stroke="${BLACK}" stroke-width="10" stroke-linecap="round"/>
      <path d="M -118 -40 C -118 -122 -62 -168 0 -168 C 62 -168 118 -122 118 -40
               Q 89 -60 59 -40 Q 30 -60 0 -40 Q -30 -60 -59 -40 Q -89 -60 -118 -40 Z"
            fill="#D6473C" stroke="${BLACK}" stroke-width="10" stroke-linejoin="round"/>
      <path d="M 0 -166 Q -40 -110 -59 -44 M 0 -166 L 0 -44 M 0 -166 Q 40 -110 59 -44"
            fill="none" stroke="${BLACK}" stroke-width="6" stroke-linecap="round" opacity="0.45"/>
    </g>
  `),

  'skateboard': svg(`
    <g transform="rotate(-20 ${CX} ${CY}) translate(${CX - 130} ${CY - 20})">
      <rect x="0" y="0" width="260" height="46" rx="23" fill="#3A6EA8" stroke="${BLACK}" stroke-width="11"/>
      <circle cx="55" cy="52" r="20" fill="#E8DDB8" stroke="${BLACK}" stroke-width="8"/>
      <circle cx="205" cy="52" r="20" fill="#E8DDB8" stroke="${BLACK}" stroke-width="8"/>
      <path d="M 20 23 Q 130 5 240 23" fill="none" stroke="white" stroke-width="6" opacity="0.5"/>
    </g>
  `),

  // First pass was a thin stick with a dashed line - invisible at thumbnail
  // scale and gave no reason to read as "fishing" specifically. A visible
  // fish on the line and a solid, higher-contrast rod/line fix both.
  // Second pass (builder audit, 2026-09-11): the rod pointed up and to the
  // RIGHT, across the character's chest, with the fish dangling over the
  // belly. It now points up and away to the left, so the line and fish hang
  // in the open space beside the character.
  'fishing-rod': svg(`
    <path d="M ${CX + 12} ${CY + 52} L ${CX - 150} ${CY - 330}" stroke="#8A6A3E" stroke-width="18" stroke-linecap="round"/>
    <path d="M ${CX + 12} ${CY + 52} L ${CX - 12} ${CY - 4}" stroke="#4A3422" stroke-width="24" stroke-linecap="round"/>
    <circle cx="${CX - 22}" cy="${CY - 6}" r="17" fill="#B0B6BC" stroke="${BLACK}" stroke-width="8"/>
    <path d="M ${CX - 150} ${CY - 330} Q ${CX - 178} ${CY - 220} ${CX - 168} ${CY - 130}"
          fill="none" stroke="${BLACK}" stroke-width="7" stroke-linecap="round"/>
    <g transform="translate(${CX - 168} ${CY - 92}) rotate(90)">
      <path d="M -36 0 Q 0 -24 36 0 Q 0 24 -36 0 Z" fill="#4A9BD6" stroke="${BLACK}" stroke-width="8" stroke-linejoin="round"/>
      <path d="M 36 0 L 54 -14 L 54 14 Z" fill="#4A9BD6" stroke="${BLACK}" stroke-width="7" stroke-linejoin="round"/>
      <circle cx="-16" cy="-4" r="4.5" fill="${BLACK}"/>
    </g>
  `),

  'paintbrush': svg(`
    <g transform="rotate(-25 ${CX} ${CY})">
      <rect x="${CX - 12}" y="${CY - 40}" width="24" height="150" rx="10" fill="#C98A3E" stroke="${BLACK}" stroke-width="9"/>
      <rect x="${CX - 16}" y="${CY - 70}" width="32" height="34" fill="#B0B6BC" stroke="${BLACK}" stroke-width="8"/>
      <path d="M ${CX - 20} ${CY - 70} Q ${CX} ${CY - 130} ${CX + 20} ${CY - 70} Z" fill="#5A3B2E" stroke="${BLACK}" stroke-width="8" stroke-linejoin="round"/>
      <path d="M ${CX - 6} ${CY - 95} L ${CX + 4} ${CY - 60}" stroke="#E8536B" stroke-width="6" stroke-linecap="round" opacity="0.8"/>
    </g>
  `),

  'flower': svg(`
    <g transform="translate(${CX} ${CY - 60})">
      <path d="M 0 -10 L -10 130" stroke="#3E8A47" stroke-width="10" stroke-linecap="round"/>
      <path d="M -6 60 Q -40 55 -46 30" fill="none" stroke="#3E8A47" stroke-width="8" stroke-linecap="round"/>
      ${[0, 72, 144, 216, 288].map((deg) => `
        <ellipse cx="0" cy="-46" rx="16" ry="30" fill="#F2A6C4" stroke="${BLACK}" stroke-width="6"
          transform="rotate(${deg} 0 0)"/>
      `).join('')}
      <circle cx="0" cy="0" r="18" fill="#E8C34A" stroke="${BLACK}" stroke-width="7"/>
    </g>
  `),

  'popcorn': svg(`
    <g transform="translate(${CX - 60} ${CY - 90})">
      <path d="M 10 30 L 25 170 L 95 170 L 110 30 Z" fill="#D6473C" stroke="${BLACK}" stroke-width="10" stroke-linejoin="round"/>
      <path d="M 20 30 L 100 30" stroke="white" stroke-width="8"/>
      <path d="M 32 30 L 40 170 M 60 30 L 60 170 M 88 30 L 80 170" stroke="white" stroke-width="6" opacity="0.7"/>
      ${[[25, 20], [45, 5], [65, 15], [85, 22], [35, 0], [75, 2]].map(([x, y]) => `
        <circle cx="${x}" cy="${y}" r="17" fill="#FBEBC0" stroke="${BLACK}" stroke-width="7"/>
      `).join('')}
    </g>
  `),

  // First pass had the weight plates barely bigger than the bar - read as a
  // wrench, not a dumbbell. Plates now dominate the shape the way a real
  // dumbbell's do.
  'dumbbell': svg(`
    <g transform="translate(${CX} ${CY - 10}) rotate(-12)">
      <rect x="-56" y="-16" width="112" height="32" rx="6" fill="#8A8F96" stroke="${BLACK}" stroke-width="11"/>
      <rect x="-104" y="-58" width="48" height="116" rx="14" fill="#242830" stroke="${BLACK}" stroke-width="11"/>
      <rect x="56" y="-58" width="48" height="116" rx="14" fill="#242830" stroke="${BLACK}" stroke-width="11"/>
      <rect x="-90" y="-40" width="20" height="80" rx="6" fill="#3A3F48"/>
      <rect x="70" y="-40" width="20" height="80" rx="6" fill="#3A3F48"/>
    </g>
  `),

  'book': svg(`
    <g transform="translate(${CX - 90} ${CY - 60})">
      <path d="M 0 10 Q 80 -20 160 10 L 160 130 Q 80 100 0 130 Z" fill="#3A6EA8" stroke="${BLACK}" stroke-width="10" stroke-linejoin="round"/>
      <path d="M 80 -5 L 80 115" stroke="${BLACK}" stroke-width="6"/>
      <path d="M 15 20 Q 48 5 75 15 M 85 15 Q 112 5 145 20" fill="none" stroke="white" stroke-width="5" opacity="0.7"/>
    </g>
  `),

  // Three attempts at a cake wedge all still read as a party hat - a
  // side-view slice needs a 3/4 perspective to read as layered cake rather
  // than a plain triangle, which is a bad match for this flat, front-on
  // style. Swapped the concept: a donut's ring silhouette can't be
  // misread as anything else at any scale.
  'donut': svg(`
    <g transform="translate(${CX} ${CY - 40}) rotate(-10)">
      <circle cx="0" cy="0" r="72" fill="#E8C79A" stroke="${BLACK}" stroke-width="13"/>
      <circle cx="0" cy="0" r="26" fill="white" stroke="${BLACK}" stroke-width="11"/>
      <path d="M -72 0 A 72 72 0 0 0 -51 51" fill="none" stroke="#D6473C" stroke-width="30" stroke-linecap="round"/>
      <path d="M 0 72 A 72 72 0 0 0 51 51" fill="none" stroke="#D6473C" stroke-width="30" stroke-linecap="round"/>
      ${[[-30, -55, -20], [10, -60, 40], [45, -20, -30], [-45, 30, 60], [30, 45, -50], [-10, 58, 10]].map(([x, y, r]) => `
        <rect x="${x - 9}" y="${y - 3}" width="18" height="6" rx="3" fill="#F2E23A" transform="rotate(${r} ${x} ${y})"/>
      `).join('')}
    </g>
  `),

  'wallet': svg(`
    <g transform="translate(${CX - 70} ${CY - 40})">
      <rect x="0" y="0" width="140" height="90" rx="10" fill="#5A3B2E" stroke="${BLACK}" stroke-width="10"/>
      <rect x="10" y="14" width="120" height="62" rx="6" fill="#7A5540"/>
      <rect x="35" y="-28" width="80" height="46" rx="4" fill="#3E8A47" stroke="${BLACK}" stroke-width="8"/>
      <rect x="30" y="-38" width="80" height="46" rx="4" fill="#4FA85A" stroke="${BLACK}" stroke-width="8"/>
    </g>
  `),
};

const run = async () => {
  for (const [name, source] of Object.entries(TRAITS)) {
    const svgPath = `${OUT}/${name}.svg`;
    const pngPath = `${OUT}/trait-${name}_left_hand.png`;
    writeFileSync(svgPath, source);
    await sharp(svgPath).png().toFile(pngPath);
    console.log('rendered', pngPath);
  }
};

run();
