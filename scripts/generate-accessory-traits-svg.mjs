import sharp from 'sharp';
import { mkdirSync, writeFileSync } from 'fs';

/**
 * One-off generator: a batch of new `accessory` traits, Treatment A (flat
 * cartoon), hand-built as SVG and rasterized with sharp.
 *
 * Registration measured off eight real accessory traits: the large majority
 * sit at ground level on the left (cx 120-200, cy 820-970 on this 1147
 * canvas) - something standing beside the character, not held or worn.
 * Used here: CX=155, CY=900. A few existing traits have "-(right)" mirrored
 * twins (pet-ping, sad-pepe, reimu-fumo); not duplicated here, but the
 * pattern is there if any of these need a right-side pair later.
 *
 * Paints after the base in TRAIT_ORDER, so no safe-zone mask is needed.
 *
 * Check registration with:
 *   node scripts/preview-trait.mjs out.png .trait-work/trait-<name>_accessory.png
 */

const OUT = '.trait-work';
mkdirSync(OUT, { recursive: true });

const BLACK = '#000000';
const CANVAS = 1147;
const CX = 155, CY = 900;

const svg = (body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${CANVAS}" height="${CANVAS}" viewBox="0 0 ${CANVAS} ${CANVAS}">${body}</svg>`;

const TRAITS = {
  'plant-pot': svg(`
    <g transform="translate(${CX - 80} ${CY - 160})">
      <path d="M 20 140 L 40 260 L 120 260 L 140 140 Z" fill="#C9793E" stroke="${BLACK}" stroke-width="11" stroke-linejoin="round"/>
      <path d="M 10 130 L 150 130 L 145 150 L 15 150 Z" fill="#A85F2E" stroke="${BLACK}" stroke-width="10" stroke-linejoin="round"/>
      <path d="M 80 130 Q 60 60 30 50 Q 40 90 60 120" fill="#3E8A47" stroke="${BLACK}" stroke-width="9" stroke-linejoin="round"/>
      <path d="M 80 130 Q 90 40 130 20 Q 115 70 95 115" fill="#4FA85A" stroke="${BLACK}" stroke-width="9" stroke-linejoin="round"/>
      <path d="M 80 130 Q 80 70 80 30" fill="none" stroke="#3E8A47" stroke-width="9" stroke-linecap="round"/>
    </g>
  `),

  'mailbox': svg(`
    <g transform="translate(${CX - 70} ${CY - 200})">
      <rect x="55" y="260" width="18" height="60" fill="#8A6A3E" stroke="${BLACK}" stroke-width="9"/>
      <path d="M 20 180 Q 20 120 65 120 Q 110 120 110 180 L 110 260 L 20 260 Z" fill="#C4283A" stroke="${BLACK}" stroke-width="11" stroke-linejoin="round"/>
      <rect x="20" y="180" width="90" height="16" fill="${BLACK}" opacity="0.15"/>
      <rect x="94" y="150" width="26" height="18" rx="3" fill="#E8C34A" stroke="${BLACK}" stroke-width="6" transform="rotate(35 107 159)"/>
    </g>
  `),

  'fire-hydrant': svg(`
    <g transform="translate(${CX - 55} ${CY - 190})">
      <rect x="20" y="230" width="70" height="30" rx="6" fill="#8A2E2E" stroke="${BLACK}" stroke-width="10"/>
      <path d="M 30 100 Q 30 60 55 60 Q 80 60 80 100 L 90 230 L 20 230 Z" fill="#D6473C" stroke="${BLACK}" stroke-width="11" stroke-linejoin="round"/>
      <rect x="10" y="150" width="20" height="34" rx="8" fill="#D6473C" stroke="${BLACK}" stroke-width="9"/>
      <rect x="80" y="150" width="20" height="34" rx="8" fill="#D6473C" stroke="${BLACK}" stroke-width="9"/>
      <circle cx="55" cy="55" r="18" fill="#B0342E" stroke="${BLACK}" stroke-width="9"/>
      <rect x="45" y="180" width="20" height="20" fill="#8A2E2E" stroke="${BLACK}" stroke-width="6"/>
    </g>
  `),

  'boombox': svg(`
    <g transform="translate(${CX - 100} ${CY - 90})">
      <rect x="0" y="20" width="200" height="110" rx="14" fill="#3A3F48" stroke="${BLACK}" stroke-width="12"/>
      <circle cx="50" cy="75" r="38" fill="#181B20" stroke="${BLACK}" stroke-width="9"/>
      <circle cx="50" cy="75" r="16" fill="#4A505A"/>
      <circle cx="150" cy="75" r="38" fill="#181B20" stroke="${BLACK}" stroke-width="9"/>
      <circle cx="150" cy="75" r="16" fill="#4A505A"/>
      <rect x="86" y="30" width="28" height="16" rx="4" fill="#5A606A"/>
      <path d="M 20 20 Q 20 -30 60 -20 M 180 20 Q 180 -30 140 -20" fill="none" stroke="${BLACK}" stroke-width="9" stroke-linecap="round"/>
    </g>
  `),

  'treasure-chest': svg(`
    <g transform="translate(${CX - 90} ${CY - 130})">
      <path d="M 10 90 L 10 190 L 170 190 L 170 90 Z" fill="#8A6A3E" stroke="${BLACK}" stroke-width="11" stroke-linejoin="round"/>
      <path d="M 10 90 Q 90 40 170 90 L 170 110 Q 90 65 10 110 Z" fill="#C9793E" stroke="${BLACK}" stroke-width="11" stroke-linejoin="round"/>
      <rect x="70" y="90" width="40" height="34" fill="#E8C34A" stroke="${BLACK}" stroke-width="8"/>
      <circle cx="90" cy="107" r="7" fill="${BLACK}"/>
      <path d="M 10 140 L 170 140" stroke="${BLACK}" stroke-width="6" opacity="0.4"/>
    </g>
  `),

  // Small toy rocket - crypto's own "to the moon" motif, no branding.
  // Sits 130px lower than first drawn (builder audit, 2026-09-11): after the
  // batch's 1.45x grow about the bottom point it hovered ~140px above the
  // ground line every other accessory stands on (bottoms at y~920-1000).
  // Shipped asset = this output, then rescale-trait.mjs --factor 1.45 --anchor bottom.
  'rocket': svg(`
    <g transform="translate(${CX} ${CY - 30}) rotate(-8)">
      <path d="M -32 40 Q -32 -100 0 -140 Q 32 -100 32 40 Z" fill="#E0403A" stroke="${BLACK}" stroke-width="11" stroke-linejoin="round"/>
      <circle cx="0" cy="-50" r="18" fill="#7FCBE0" stroke="${BLACK}" stroke-width="8"/>
      <path d="M -32 20 L -60 60 L -32 60 Z" fill="#B0342E" stroke="${BLACK}" stroke-width="9" stroke-linejoin="round"/>
      <path d="M 32 20 L 60 60 L 32 60 Z" fill="#B0342E" stroke="${BLACK}" stroke-width="9" stroke-linejoin="round"/>
      <path d="M -16 40 Q 0 90 16 40 Q 0 65 -16 40 Z" fill="#F2A64A" stroke="${BLACK}" stroke-width="8" stroke-linejoin="round"/>
    </g>
  `),

  // Basket filled white: with fill="none" it rendered as bare wireframe on
  // the lime share card.
  'shopping-cart': svg(`
    <g transform="translate(${CX - 100} ${CY - 90})">
      <path d="M 20 20 L 210 20 L 185 110 L 55 110 Z" fill="white" stroke="${BLACK}" stroke-width="10" stroke-linejoin="round"/>
      <path d="M 30 110 L 30 40 L 10 40" fill="none" stroke="${BLACK}" stroke-width="10" stroke-linecap="round"/>
      <path d="M 55 40 L 190 40 M 60 60 L 180 60 M 65 80 L 172 80" stroke="${BLACK}" stroke-width="6" opacity="0.5"/>
      <circle cx="75" cy="150" r="16" fill="#3A3F48" stroke="${BLACK}" stroke-width="8"/>
      <circle cx="165" cy="150" r="16" fill="#3A3F48" stroke="${BLACK}" stroke-width="8"/>
    </g>
  `),

  // First pass buried a small flame under crossed sticks the same brown as
  // the ground shadow beneath it - net silhouette read as a moth or bowtie.
  // Bigger, brighter flame in front, logs flattened low behind it instead of
  // crossing over the top.
  'campfire': svg(`
    <g transform="translate(${CX - 80} ${CY - 130})">
      <path d="M 10 175 L 150 175" stroke="${BLACK}" stroke-width="12" stroke-linecap="round"/>
      <path d="M 20 175 L 70 145 M 140 175 L 90 145 M 35 175 L 125 175" stroke="#8A6A3E" stroke-width="16" stroke-linecap="round"/>
      <path d="M 80 175 Q 35 130 55 75 Q 70 100 78 82 Q 78 60 85 40 Q 105 75 100 105 Q 118 90 120 65 Q 135 120 100 155 Q 90 170 80 175 Z"
            fill="#F2A64A" stroke="${BLACK}" stroke-width="11" stroke-linejoin="round"/>
      <path d="M 80 175 Q 60 145 70 110 Q 80 125 85 112 Q 95 140 80 175 Z" fill="#E8C34A"/>
    </g>
  `),

  // Deliberately generic: blank/abstract screen, no game or brand shown.
  'arcade-machine': svg(`
    <g transform="translate(${CX - 75} ${CY - 220})">
      <path d="M 10 300 L 10 40 Q 10 20 30 20 L 120 20 Q 140 20 140 40 L 140 300 Z" fill="#3A3F48" stroke="${BLACK}" stroke-width="12" stroke-linejoin="round"/>
      <rect x="28" y="45" width="94" height="80" rx="6" fill="#182028" stroke="${BLACK}" stroke-width="8"/>
      <path d="M 45 60 L 75 60 L 60 90 Z" fill="#4FE0C4" opacity="0.8"/>
      <circle cx="90" cy="95" r="10" fill="#E0403A" opacity="0.8"/>
      <rect x="40" y="150" width="70" height="16" rx="8" fill="#5A606A"/>
      <circle cx="55" cy="185" r="12" fill="#D6473C" stroke="${BLACK}" stroke-width="6"/>
      <circle cx="95" cy="185" r="12" fill="#4A9BD6" stroke="${BLACK}" stroke-width="6"/>
    </g>
  `),

  'birdhouse': svg(`
    <g transform="translate(${CX - 60} ${CY - 160})">
      <rect x="20" y="80" width="100" height="90" rx="6" fill="#C9793E" stroke="${BLACK}" stroke-width="11"/>
      <path d="M 5 80 L 70 20 L 135 80 Z" fill="#8A2E2E" stroke="${BLACK}" stroke-width="11" stroke-linejoin="round"/>
      <circle cx="70" cy="120" r="18" fill="#3A2318" stroke="${BLACK}" stroke-width="8"/>
      <rect x="55" y="168" width="30" height="12" fill="#8A6A3E" stroke="${BLACK}" stroke-width="6"/>
      <rect x="65" y="170" width="90" height="10" fill="#8A6A3E" stroke="${BLACK}" stroke-width="7"/>
    </g>
  `),
};

const run = async () => {
  for (const [name, source] of Object.entries(TRAITS)) {
    const svgPath = `${OUT}/${name}.svg`;
    const pngPath = `${OUT}/trait-${name}_accessory.png`;
    writeFileSync(svgPath, source);
    await sharp(svgPath).png().toFile(pngPath);
    console.log('rendered', pngPath);
  }
};

run();
