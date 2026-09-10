import sharp from 'sharp';
import { mkdirSync, writeFileSync } from 'fs';

/**
 * One-off generator: a batch of new `body` traits, Treatment A (flat
 * cartoon), hand-built as SVG and rasterized with sharp.
 *
 * Two distinct registration patterns measured off real body traits, not
 * assumed - `body` covers both full shirts and small chest tattoos and they
 * do not share a size:
 *   - shirts (blank-tee, ping-tee): wide torso coverage, cx~550, cy~643,
 *     roughly 600x375 on this 1147 canvas
 *   - tattoos (bitcoin-tattoo, solana-tattoo): a small chest mark,
 *     cx~568, cy~680, roughly 170x180
 *
 * Paints after the base, no safe-zone mask needed.
 *
 * Check registration with:
 *   node scripts/preview-trait.mjs out.png .trait-work/trait-<name>_body.png
 */

const OUT = '.trait-work';
mkdirSync(OUT, { recursive: true });

const BLACK = '#000000';
const CANVAS = 1147;

const SHIRT_CX = 551, SHIRT_CY = 643;
const TAT_CX = 568, TAT_CY = 680;

const svg = (body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${CANVAS}" height="${CANVAS}" viewBox="0 0 ${CANVAS} ${CANVAS}">${body}</svg>`;

/**
 * The same tee silhouette every shirt trait in the library shares - collar
 * notch, short raglan sleeves - so a new pattern only has to define its own
 * fill/print, not redraw the garment from scratch.
 *
 * Split into two pieces deliberately: `teeClipDef` is a `<clipPath>`, which
 * only has meaning inside `<defs>` and is correctly invisible there.
 * `teeShirt` is the actual visible fill+stroke path and must NOT be inside
 * `<defs>` - an early version put both in one string and wrapped the whole
 * thing in `<defs>`, which silently swallowed the entire visible garment.
 * Every shirt using it rendered as a bare torso with just the clipped
 * pattern floating on it, no collar, no sleeves, no outline - caught by
 * looking at the actual contact sheet, not by any validation step, because
 * a syntactically valid SVG with an accidentally-invisible element doesn't
 * error anywhere.
 */
const teeOutline = `M ${SHIRT_CX - 302} ${SHIRT_CY - 60}
  Q ${SHIRT_CX - 260} ${SHIRT_CY - 140} ${SHIRT_CX - 130} ${SHIRT_CY - 160}
  Q ${SHIRT_CX} ${SHIRT_CY - 120} ${SHIRT_CX + 130} ${SHIRT_CY - 160}
  Q ${SHIRT_CX + 260} ${SHIRT_CY - 140} ${SHIRT_CX + 302} ${SHIRT_CY - 60}
  L ${SHIRT_CX + 260} ${SHIRT_CY + 30}
  Q ${SHIRT_CX + 200} ${SHIRT_CY - 10} ${SHIRT_CX + 170} ${SHIRT_CY + 10}
  L ${SHIRT_CX + 150} ${SHIRT_CY + 175}
  L ${SHIRT_CX - 150} ${SHIRT_CY + 175}
  L ${SHIRT_CX - 170} ${SHIRT_CY + 10}
  Q ${SHIRT_CX - 200} ${SHIRT_CY - 10} ${SHIRT_CX - 260} ${SHIRT_CY + 30}
  Z`;

const teeClipDef = (clipId) => `<clipPath id="${clipId}"><path d="${teeOutline}"/></clipPath>`;

const teeShirt = (fill) => `
  <path d="${teeOutline}" fill="${fill}" stroke="${BLACK}" stroke-width="13" stroke-linejoin="round"/>
  <path d="M ${SHIRT_CX - 130} ${SHIRT_CY - 160} Q ${SHIRT_CX} ${SHIRT_CY - 115} ${SHIRT_CX + 130} ${SHIRT_CY - 160}"
        fill="none" stroke="${BLACK}" stroke-width="9"/>
`;

const TRAITS = {
  'hawaiian-shirt': svg(`
    <defs>${teeClipDef('clip-hawaiian')}</defs>
    ${teeShirt('#F2D9B0')}
    <g clip-path="url(#clip-hawaiian)">
      ${[[430, 560], [560, 600], [680, 550], [500, 680], [630, 700]].map(([x, y]) => `
        <g transform="translate(${x} ${y})">
          ${[0, 72, 144, 216, 288].map((deg) => `<ellipse cx="0" cy="-16" rx="9" ry="16" fill="#E8536B" transform="rotate(${deg})"/>`).join('')}
          <circle r="7" fill="#E8C34A"/>
        </g>
      `).join('')}
    </g>
  `),

  'tuxedo-shirt': svg(`
    <defs>${teeClipDef('clip-tux')}</defs>
    ${teeShirt('white')}
    <g clip-path="url(#clip-tux)">
      <path d="M ${SHIRT_CX - 302} ${SHIRT_CY - 60} L ${SHIRT_CX - 60} ${SHIRT_CY + 175} L ${SHIRT_CX - 150} ${SHIRT_CY + 175} L ${SHIRT_CX - 260} ${SHIRT_CY + 30} Z" fill="#181B20"/>
      <path d="M ${SHIRT_CX + 302} ${SHIRT_CY - 60} L ${SHIRT_CX + 60} ${SHIRT_CY + 175} L ${SHIRT_CX + 150} ${SHIRT_CY + 175} L ${SHIRT_CX + 260} ${SHIRT_CY + 30} Z" fill="#181B20"/>
      <path d="M ${SHIRT_CX - 50} ${SHIRT_CY - 130} L ${SHIRT_CX} ${SHIRT_CY - 60} L ${SHIRT_CX + 50} ${SHIRT_CY - 130} L ${SHIRT_CX} ${SHIRT_CY + 175} Z" fill="white" stroke="${BLACK}" stroke-width="6" stroke-linejoin="round"/>
      <path d="M ${SHIRT_CX - 32} ${SHIRT_CY - 108} L ${SHIRT_CX - 6} ${SHIRT_CY - 88} L ${SHIRT_CX - 32} ${SHIRT_CY - 68} L ${SHIRT_CX - 44} ${SHIRT_CY - 88} Z" fill="#181B20" stroke="${BLACK}" stroke-width="6" stroke-linejoin="round"/>
      <path d="M ${SHIRT_CX + 32} ${SHIRT_CY - 108} L ${SHIRT_CX + 6} ${SHIRT_CY - 88} L ${SHIRT_CX + 32} ${SHIRT_CY - 68} L ${SHIRT_CX + 44} ${SHIRT_CY - 88} Z" fill="#181B20" stroke="${BLACK}" stroke-width="6" stroke-linejoin="round"/>
    </g>
  `),

  'hoodie': svg(`
    <defs>${teeClipDef('clip-hoodie')}</defs>
    ${teeShirt('#4A5568')}
    <path d="M ${SHIRT_CX - 150} ${SHIRT_CY - 150} Q ${SHIRT_CX} ${SHIRT_CY - 55} ${SHIRT_CX + 150} ${SHIRT_CY - 150}
             Q ${SHIRT_CX + 90} ${SHIRT_CY - 100} ${SHIRT_CX} ${SHIRT_CY - 95}
             Q ${SHIRT_CX - 90} ${SHIRT_CY - 100} ${SHIRT_CX - 150} ${SHIRT_CY - 150} Z"
          fill="#3A4250" stroke="${BLACK}" stroke-width="10" stroke-linejoin="round"/>
    <path d="M ${SHIRT_CX - 40} ${SHIRT_CY - 90} L ${SHIRT_CX - 46} ${SHIRT_CY + 10}" stroke="#D9DEE4" stroke-width="9" stroke-linecap="round"/>
    <path d="M ${SHIRT_CX + 40} ${SHIRT_CY - 90} L ${SHIRT_CX + 46} ${SHIRT_CY + 10}" stroke="#D9DEE4" stroke-width="9" stroke-linecap="round"/>
    <circle cx="${SHIRT_CX - 46}" cy="${SHIRT_CY + 20}" r="7" fill="#D9DEE4" stroke="${BLACK}" stroke-width="3"/>
    <circle cx="${SHIRT_CX + 46}" cy="${SHIRT_CY + 20}" r="7" fill="#D9DEE4" stroke="${BLACK}" stroke-width="3"/>
  `),

  'sailor-shirt': svg(`
    <defs>${teeClipDef('clip-sailor')}</defs>
    ${teeShirt('white')}
    <g clip-path="url(#clip-sailor)">
      ${[0, 1, 2, 3, 4, 5].map((i) => `<rect x="${SHIRT_CX - 302}" y="${SHIRT_CY - 60 + i * 65}" width="604" height="32" fill="#2E5C8A"/>`).join('')}
    </g>
  `),

  'flannel-shirt': svg(`
    <defs>${teeClipDef('clip-flannel')}</defs>
    ${teeShirt('#8A2E2E')}
    <g clip-path="url(#clip-flannel)">
      ${[0, 1, 2, 3].map((i) => `<rect x="${SHIRT_CX - 302}" y="${SHIRT_CY - 60 + i * 100}" width="604" height="14" fill="#3A2318"/>`).join('')}
      ${[0, 1, 2, 3, 4].map((i) => `<rect x="${SHIRT_CX - 280 + i * 145}" y="${SHIRT_CY - 60}" width="14" height="400" fill="#3A2318"/>`).join('')}
    </g>
  `),

  'heart-tattoo': svg(`
    <path d="M ${TAT_CX} ${TAT_CY + 40}
             C ${TAT_CX - 90} ${TAT_CY - 30}, ${TAT_CX - 50} ${TAT_CY - 90}, ${TAT_CX} ${TAT_CY - 40}
             C ${TAT_CX + 50} ${TAT_CY - 90}, ${TAT_CX + 90} ${TAT_CY - 30}, ${TAT_CX} ${TAT_CY + 40} Z"
          fill="#C4283A" stroke="${BLACK}" stroke-width="9" stroke-linejoin="round"/>
  `),

  'star-tattoo': svg(`
    <path d="${Array.from({ length: 10 }, (_, i) => {
      const a = (i * Math.PI) / 5 - Math.PI / 2;
      const r = i % 2 === 0 ? 65 : 28;
      return `${i === 0 ? 'M' : 'L'} ${(TAT_CX + Math.cos(a) * r).toFixed(1)} ${(TAT_CY + Math.sin(a) * r).toFixed(1)}`;
    }).join(' ')} Z" fill="#2E5C8A" stroke="${BLACK}" stroke-width="9" stroke-linejoin="round"/>
  `),

  'anchor-tattoo': svg(`
    <g transform="translate(${TAT_CX} ${TAT_CY})">
      <circle cx="0" cy="-55" r="14" fill="none" stroke="${BLACK}" stroke-width="9"/>
      <path d="M 0 -42 L 0 55" stroke="${BLACK}" stroke-width="11" stroke-linecap="round"/>
      <path d="M -38 -20 L 38 -20" stroke="${BLACK}" stroke-width="9" stroke-linecap="round"/>
      <path d="M 0 55 Q -55 55 -55 5 M 0 55 Q 55 55 55 5" fill="none" stroke="${BLACK}" stroke-width="11" stroke-linecap="round"/>
      <path d="M -55 5 L -40 20 M 55 5 L 40 20" stroke="${BLACK}" stroke-width="9" stroke-linecap="round"/>
    </g>
  `),

  'lightning-tattoo': svg(`
    <path d="M ${TAT_CX + 20} ${TAT_CY - 80} L ${TAT_CX - 40} ${TAT_CY + 5} L ${TAT_CX - 5} ${TAT_CY + 5} L ${TAT_CX - 25} ${TAT_CY + 80} L ${TAT_CX + 45} ${TAT_CY - 15} L ${TAT_CX + 8} ${TAT_CY - 15} Z"
          fill="#E8C34A" stroke="${BLACK}" stroke-width="9" stroke-linejoin="round"/>
  `),

  'skull-tattoo': svg(`
    <g transform="translate(${TAT_CX} ${TAT_CY})">
      <path d="M -55 -10 Q -55 -70 0 -70 Q 55 -70 55 -10 Q 55 30 30 40 L 30 60 L 18 60 L 18 45 L -18 45 L -18 60 L -30 60 L -30 40 Q -55 30 -55 -10 Z"
            fill="#F2EFE6" stroke="${BLACK}" stroke-width="9" stroke-linejoin="round"/>
      <circle cx="-22" cy="-15" r="13" fill="${BLACK}"/>
      <circle cx="22" cy="-15" r="13" fill="${BLACK}"/>
      <path d="M -8 5 L 8 5 L 0 20 Z" fill="${BLACK}"/>
    </g>
  `),
};

const run = async () => {
  for (const [name, source] of Object.entries(TRAITS)) {
    const svgPath = `${OUT}/${name}.svg`;
    const pngPath = `${OUT}/trait-${name}_body.png`;
    writeFileSync(svgPath, source);
    await sharp(svgPath).png().toFile(pngPath);
    console.log('rendered', pngPath);
  }
};

run();
