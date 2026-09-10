import sharp from 'sharp';
import { mkdirSync, writeFileSync } from 'fs';

/**
 * One-off generator: a batch of new `right_hand` traits, Treatment A (flat
 * cartoon), hand-built as SVG and rasterized with sharp.
 *
 * Registration measured off real right_hand traits (beer, solana-coin,
 * money-stack): all center within cx 860-880, cy 649-702 on this 1147
 * canvas - the mirror of left_hand's flipper position. Used CX=870, CY=680.
 *
 * Paints after the base, no safe-zone mask needed.
 *
 * Check registration with:
 *   node scripts/preview-trait.mjs out.png .trait-work/trait-<name>_right_hand.png
 */

const OUT = '.trait-work';
mkdirSync(OUT, { recursive: true });

const BLACK = '#000000';
const CANVAS = 1147;
const CX = 870, CY = 680;

// guitar, kite and balloon-animal measured visibly smaller than the
// library's existing hand items (basketball, mug, beer) once composited at
// the 512 render size. Each is wrapped in a scale about the flipper contact
// point (CX, CY) so it grows outward from the hand rather than drifting.

const svg = (body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${CANVAS}" height="${CANVAS}" viewBox="0 0 ${CANVAS} ${CANVAS}">${body}</svg>`;

const TRAITS = {
  // First pass put most of the body behind the flipper and left only the
  // thin neck visible - looked like a stick, not a guitar. Shifted further
  // out and scaled up so the body is the dominant, unmissable shape.
  'guitar': svg(`
    <g transform="translate(${CX} ${CY}) scale(1.5) translate(${-CX} ${-CY})">
    <g transform="translate(${CX + 30} ${CY - 60}) rotate(18)">
      <path d="M -9 -170 L 9 -170 L 14 20 L -14 20 Z" fill="#5A3B2E" stroke="${BLACK}" stroke-width="10"/>
      <path d="M -54 40 Q -95 40 -92 92 Q -88 138 -30 142 Q 0 145 8 112 Q 16 145 46 142 Q 98 137 95 88 Q 92 40 52 40 Q 34 78 0 78 Q -34 78 -54 40 Z"
            fill="#C9793E" stroke="${BLACK}" stroke-width="13" stroke-linejoin="round"/>
      <circle cx="6" cy="98" r="26" fill="#3A2318" stroke="${BLACK}" stroke-width="8"/>
      <path d="M -6 -170 L -8 100 M 6 -170 L 8 100" stroke="#E8DDB8" stroke-width="3" opacity="0.6"/>
    </g>
    </g>
  `),

  'camera': svg(`
    <g transform="translate(${CX - 75} ${CY - 50})">
      <rect x="0" y="20" width="150" height="100" rx="12" fill="#2A2E33" stroke="${BLACK}" stroke-width="11"/>
      <rect x="35" y="0" width="60" height="25" rx="4" fill="#2A2E33" stroke="${BLACK}" stroke-width="9"/>
      <circle cx="75" cy="72" r="38" fill="#181B20" stroke="${BLACK}" stroke-width="10"/>
      <circle cx="75" cy="72" r="20" fill="#4A9BD6"/>
      <circle cx="130" cy="45" r="8" fill="#D6473C" stroke="${BLACK}" stroke-width="4"/>
    </g>
  `),

  'telescope': svg(`
    <g transform="rotate(-30 ${CX} ${CY})">
      <rect x="${CX - 100}" y="${CY - 22}" width="150" height="44" rx="10" fill="#8A8F96" stroke="${BLACK}" stroke-width="11"/>
      <rect x="${CX + 40}" y="${CY - 30}" width="40" height="60" rx="8" fill="#5A606A" stroke="${BLACK}" stroke-width="10"/>
      <circle cx="${CX - 100}" cy="${CY}" r="24" fill="#3A3F48" stroke="${BLACK}" stroke-width="9"/>
      <path d="M ${CX} ${CY + 22} L ${CX} ${CY + 90} L ${CX - 30} ${CY + 130} M ${CX} ${CY + 90} L ${CX + 30} ${CY + 130}"
            stroke="${BLACK}" stroke-width="9" stroke-linecap="round" fill="none"/>
    </g>
  `),

  'trophy': svg(`
    <g transform="translate(${CX - 55} ${CY - 110})">
      <path d="M 20 20 L 90 20 L 82 90 Q 55 105 28 90 Z" fill="#E8C34A" stroke="${BLACK}" stroke-width="11" stroke-linejoin="round"/>
      <path d="M 20 30 Q -20 30 -15 60 Q -10 85 20 80" fill="none" stroke="${BLACK}" stroke-width="9"/>
      <path d="M 90 30 Q 130 30 125 60 Q 120 85 90 80" fill="none" stroke="${BLACK}" stroke-width="9"/>
      <rect x="45" y="95" width="20" height="25" fill="#C9A03E" stroke="${BLACK}" stroke-width="8"/>
      <rect x="25" y="118" width="60" height="16" rx="4" fill="#E8C34A" stroke="${BLACK}" stroke-width="9"/>
      <path d="M 40 45 L 55 65 L 70 45" fill="none" stroke="white" stroke-width="6" opacity="0.6" stroke-linecap="round"/>
    </g>
  `),

  'kite': svg(`
    <g transform="translate(${CX} ${CY}) scale(1.5) translate(${-CX} ${-CY})">
    <g transform="rotate(20 ${CX} ${CY})">
      <path d="M ${CX} ${CY - 90} L ${CX + 65} ${CY} L ${CX} ${CY + 90} L ${CX - 65} ${CY} Z"
            fill="#4A9BD6" stroke="${BLACK}" stroke-width="11" stroke-linejoin="round"/>
      <path d="M ${CX - 65} ${CY} L ${CX} ${CY - 90} M ${CX} ${CY - 90} L ${CX + 65} ${CY}" stroke="${BLACK}" stroke-width="6" opacity="0.4"/>
      <path d="M ${CX} ${CY + 90} Q ${CX + 20} ${CY + 130} ${CX} ${CY + 160} Q ${CX - 20} ${CY + 190} ${CX} ${CY + 220}"
            fill="none" stroke="${BLACK}" stroke-width="5" stroke-dasharray="2 10" stroke-linecap="round"/>
      <path d="M ${CX - 25} ${CY - 30} L ${CX + 25} ${CY - 30} M ${CX - 40} ${CY + 20} L ${CX + 40} ${CY + 20}" stroke="white" stroke-width="5" opacity="0.5"/>
    </g>
    </g>
  `),

  'ice-cream-cone': svg(`
    <g transform="translate(${CX - 50} ${CY - 130})">
      <path d="M 10 100 L 50 190 L 90 100 Z" fill="#C9793E" stroke="${BLACK}" stroke-width="10" stroke-linejoin="round"/>
      <path d="M 18 105 L 50 105 M 30 130 L 62 130 M 24 155 L 70 155" stroke="${BLACK}" stroke-width="3" opacity="0.4"/>
      <path d="M 5 100 Q 5 40 50 45 Q 95 40 95 100 Q 75 115 50 105 Q 25 115 5 100 Z"
            fill="#F2A6C4" stroke="${BLACK}" stroke-width="10" stroke-linejoin="round"/>
      <circle cx="50" cy="30" r="15" fill="#D6473C" stroke="${BLACK}" stroke-width="6"/>
    </g>
  `),

  'tennis-racket': svg(`
    <g transform="rotate(-15 ${CX} ${CY})">
      <ellipse cx="${CX}" cy="${CY - 60}" rx="55" ry="75" fill="none" stroke="${BLACK}" stroke-width="14"/>
      <path d="M ${CX - 45} ${CY - 100} L ${CX + 45} ${CY - 20} M ${CX - 45} ${CY - 20} L ${CX + 45} ${CY - 100} M ${CX} ${CY - 135} L ${CX} ${CY + 15} M ${CX - 30} ${CY - 130} L ${CX - 30} ${CY + 5} M ${CX + 30} ${CY - 130} L ${CX + 30} ${CY + 5}"
            stroke="#D9DEE4" stroke-width="4" opacity="0.7"/>
      <rect x="${CX - 12}" y="${CY + 15}" width="24" height="90" rx="8" fill="#3A6EA8" stroke="${BLACK}" stroke-width="11"/>
    </g>
  `),

  // First pass read as a generic red mitt, nothing distinguished it as a
  // boxing glove specifically. The thumb (its defining feature) and a much
  // bigger, rounder fist shape fix that.
  'boxing-glove': svg(`
    <g transform="translate(${CX - 75} ${CY - 110})">
      <path d="M 15 55 Q 10 -15 75 -15 Q 140 -15 140 55 L 140 110 Q 140 155 85 160 Q 30 165 15 130 Z"
            fill="#C4283A" stroke="${BLACK}" stroke-width="14" stroke-linejoin="round"/>
      <path d="M 15 55 Q -25 45 -25 90 Q -25 120 10 118 Q 20 100 20 80" fill="#C4283A" stroke="${BLACK}" stroke-width="13" stroke-linejoin="round"/>
      <rect x="18" y="120" width="115" height="38" rx="12" fill="#8A2E2E" stroke="${BLACK}" stroke-width="12"/>
      <path d="M 50 25 L 50 80 M 80 20 L 80 85 M 108 25 L 108 80" stroke="${BLACK}" stroke-width="7" opacity="0.35"/>
    </g>
  `),

  // First pass was a small hook shape with no visible bone/meat contrast -
  // read as an anchor, not food. Classic lollipop-shaped drumstick silhouette
  // (bone handle, rounded meaty top) at roughly double the scale.
  // Second pass sat too far left, mostly behind the flipper - only the
  // meaty top cleared it. Shifted well clear of the body instead of relying
  // on rotation to expose it.
  'drumstick': svg(`
    <g transform="translate(${CX + 25} ${CY - 130})">
      <path d="M 35 100 L 42 175 Q 50 195 58 175 L 65 100 Z" fill="#F2EFE6" stroke="${BLACK}" stroke-width="10" stroke-linejoin="round"/>
      <path d="M 5 100 Q 5 20 50 15 Q 95 20 95 100 Q 95 140 50 140 Q 5 140 5 100 Z"
            fill="#C9793E" stroke="${BLACK}" stroke-width="13" stroke-linejoin="round"/>
      <path d="M 25 55 Q 50 40 75 55" fill="none" stroke="#8A5A2E" stroke-width="7" stroke-linecap="round" opacity="0.6"/>
    </g>
  `),

  // First pass was a thin green squiggle, invisible at any distance. A real
  // balloon-dog silhouette (round head, long snout, floppy ear, twisted
  // knot legs) at roughly triple the scale reads unambiguously.
  'balloon-animal': svg(`
    <g transform="translate(${CX} ${CY}) scale(1.4) translate(${-CX} ${-CY})">
    <g transform="translate(${CX - 70} ${CY - 160})">
      <ellipse cx="70" cy="45" rx="42" ry="36" fill="#4FA85A" stroke="${BLACK}" stroke-width="13"/>
      <path d="M 108 50 Q 155 55 150 30 Q 148 12 128 15 Q 132 30 112 38" fill="#4FA85A" stroke="${BLACK}" stroke-width="12" stroke-linejoin="round"/>
      <path d="M 45 15 Q 20 -5 35 -25 Q 50 -8 55 15" fill="#4FA85A" stroke="${BLACK}" stroke-width="11" stroke-linejoin="round"/>
      <path d="M 45 78 Q 20 95 22 130 Q 24 150 44 148 Q 54 147 52 132 Q 50 115 62 105"
            fill="none" stroke="#4FA85A" stroke-width="15" stroke-linecap="round"/>
      <path d="M 95 78 Q 120 95 118 130 Q 116 150 96 148 Q 86 147 88 132 Q 90 115 78 105"
            fill="none" stroke="#4FA85A" stroke-width="15" stroke-linecap="round"/>
      <circle cx="95" cy="35" r="5" fill="${BLACK}"/>
    </g>
    </g>
  `),
};

const run = async () => {
  for (const [name, source] of Object.entries(TRAITS)) {
    const svgPath = `${OUT}/${name}.svg`;
    const pngPath = `${OUT}/trait-${name}_right_hand.png`;
    writeFileSync(svgPath, source);
    await sharp(svgPath).png().toFile(pngPath);
    console.log('rendered', pngPath);
  }
};

run();
