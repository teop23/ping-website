import sharp from 'sharp';
import { mkdirSync, writeFileSync } from 'fs';

/**
 * One-off generator: a batch of new `head` traits, Treatment A (flat
 * cartoon), hand-built as SVG and rasterized with sharp.
 *
 * Registration measured off six real head traits: all center within
 * cx 556-580, cy 125-237 on this 1147 canvas - well above the eyes
 * (y~381, from the face-trait generator), sitting on top of the head. Taller
 * hats (crown, winter-cap) sit higher (cy~125-136); flatter ones (cap) sit
 * lower (cy~237). Used here: CX=560, base CY varies per hat height below.
 *
 * Paints after the base (TRAIT_ORDER puts head after mouth), no safe-zone
 * mask needed.
 *
 * Check registration with:
 *   node scripts/preview-trait.mjs out.png .trait-work/trait-<name>_head.png
 */

const OUT = '.trait-work';
mkdirSync(OUT, { recursive: true });

const BLACK = '#000000';
const CANVAS = 1147;
const CX = 560;

const svg = (body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${CANVAS}" height="${CANVAS}" viewBox="0 0 ${CANVAS} ${CANVAS}">${body}</svg>`;

const TRAITS = {
  'beanie': svg(`
    <g transform="translate(${CX} 190)">
      <path d="M -170 40 Q -170 -110 0 -110 Q 170 -110 170 40 L 170 70 L -170 70 Z" fill="#8A2E2E" stroke="${BLACK}" stroke-width="13" stroke-linejoin="round"/>
      <rect x="-170" y="30" width="340" height="50" fill="#B0342E" stroke="${BLACK}" stroke-width="12"/>
      <circle cx="0" cy="-108" r="20" fill="#E8DDB8" stroke="${BLACK}" stroke-width="9"/>
    </g>
  `),

  // Generic mythology archetype, not tied to any brand or franchise.
  'viking-helmet': svg(`
    <g transform="translate(${CX} 200)">
      <path d="M -150 60 Q -150 -80 0 -90 Q 150 -80 150 60 L 150 90 L -150 90 Z" fill="#8A8F96" stroke="${BLACK}" stroke-width="13" stroke-linejoin="round"/>
      <rect x="-150" y="55" width="300" height="35" fill="#6A6F76" stroke="${BLACK}" stroke-width="11"/>
      <path d="M -150 20 Q -230 -30 -195 -95 Q -160 -50 -140 0 Z" fill="#E8DDB8" stroke="${BLACK}" stroke-width="11" stroke-linejoin="round"/>
      <path d="M 150 20 Q 230 -30 195 -95 Q 160 -50 140 0 Z" fill="#E8DDB8" stroke="${BLACK}" stroke-width="11" stroke-linejoin="round"/>
    </g>
  `),

  'graduation-cap': svg(`
    <g transform="translate(${CX} 150)">
      <rect x="-40" y="-30" width="80" height="60" fill="#242830" stroke="${BLACK}" stroke-width="11"/>
      <path d="M -200 -60 L 0 -130 L 200 -60 L 0 10 Z" fill="#181B20" stroke="${BLACK}" stroke-width="13" stroke-linejoin="round"/>
      <path d="M 0 10 L 0 60" stroke="#E8C34A" stroke-width="8" stroke-linecap="round"/>
      <circle cx="0" cy="70" r="14" fill="#E8C34A" stroke="${BLACK}" stroke-width="6"/>
    </g>
  `),

  'chef-hat': svg(`
    <g transform="translate(${CX} 150)">
      <rect x="-90" y="60" width="180" height="50" fill="white" stroke="${BLACK}" stroke-width="12"/>
      <path d="M -95 60 Q -140 60 -140 10 Q -140 -30 -100 -35 Q -95 -75 -50 -80 Q -20 -110 20 -80 Q 60 -85 75 -50 Q 115 -50 115 -10 Q 115 30 90 45 Q 100 55 90 65 L -90 65 Q -100 55 -95 60 Z"
            fill="white" stroke="${BLACK}" stroke-width="12" stroke-linejoin="round"/>
    </g>
  `),

  // Plain black pirate hat with a generic skull-and-crossbones - distinct
  // from the existing jack-sparrow-hat trait, no character reference. First
  // pass had the top and bottom edges of the bicorne only 40-80px apart -
  // a thin sliver, not a hat with real body. Pulled the bottom edge much
  // further down so the crescent has actual thickness.
  'pirate-hat': svg(`
    <g transform="translate(${CX} 175)">
      <path d="M -230 70 Q -150 -90 0 -60 Q 150 -90 230 70 Q 150 30 0 55 Q -150 30 -230 70 Z"
            fill="#181B20" stroke="${BLACK}" stroke-width="14" stroke-linejoin="round"/>
      <circle cx="0" cy="0" r="26" fill="white" stroke="${BLACK}" stroke-width="7"/>
      <circle cx="-9" cy="-6" r="6" fill="${BLACK}"/>
      <circle cx="9" cy="-6" r="6" fill="${BLACK}"/>
      <path d="M -10 8 L 10 8 L 0 20 Z" fill="${BLACK}"/>
      <path d="M -28 22 L -44 38 M 28 22 L 44 38 M -28 22 L -44 6 M 28 22 L 44 6" stroke="white" stroke-width="6" stroke-linecap="round"/>
    </g>
  `),

  'flower-crown': svg(`
    <g transform="translate(${CX} 220)">
      <path d="M -180 20 Q 0 -30 180 20" fill="none" stroke="#5A8A47" stroke-width="14" stroke-linecap="round"/>
      ${[-150, -90, -30, 30, 90, 150].map((x, i) => {
        const y = -Math.sin(((x + 180) / 360) * Math.PI) * 40 - 10;
        const colors = ['#F2A6C4', '#E8C34A', '#7FCBE0'];
        return `
        <g transform="translate(${x} ${y})">
          ${[0, 72, 144, 216, 288].map((deg) => `<ellipse cx="0" cy="-11" rx="7" ry="12" fill="${colors[i % 3]}" transform="rotate(${deg})"/>`).join('')}
          <circle r="5" fill="#8A6A3E"/>
        </g>`;
      }).join('')}
    </g>
  `),

  'bucket-hat': svg(`
    <g transform="translate(${CX} 220)">
      <path d="M -100 -20 Q -100 -80 0 -80 Q 100 -80 100 -20 L 100 20 L -100 20 Z" fill="#4A6B4A" stroke="${BLACK}" stroke-width="13" stroke-linejoin="round"/>
      <path d="M -220 20 Q -160 60 0 60 Q 160 60 220 20 L 220 40 Q 160 80 0 80 Q -160 80 -220 40 Z"
            fill="#5A8058" stroke="${BLACK}" stroke-width="12" stroke-linejoin="round"/>
    </g>
  `),

  // Generic fantasy wizard hat - not tied to any franchise. First pass drew
  // the cone only ~70px wide at its base, needle-thin against a 400px-wide
  // brim - it read as an antenna, not a hat. Widened the cone's base to
  // match the brim's scale and shortened it so it stays a hat silhouette
  // rather than a spike.
  'wizard-hat': svg(`
    <g transform="translate(${CX} 210)">
      <path d="M -190 20 Q -60 40 0 40 Q 60 40 190 20 L 200 55 Q 60 80 0 80 Q -60 80 -200 55 Z"
            fill="#3E2E6B" stroke="${BLACK}" stroke-width="13" stroke-linejoin="round"/>
      <path d="M -110 35 Q -30 -190 15 -230 Q 90 -60 55 35 Z" fill="#4E3B85" stroke="${BLACK}" stroke-width="13" stroke-linejoin="round"/>
      <circle cx="15" cy="-130" r="16" fill="#F2E23A" stroke="${BLACK}" stroke-width="5"/>
      <circle cx="-30" cy="-30" r="12" fill="#F2E23A" stroke="${BLACK}" stroke-width="5"/>
    </g>
  `),

  // First pass was too small and too thin (18px branches on a ~100px-tall
  // shape) to read against the character's own black hood. Doubled the
  // scale and the branch weight, and gave each antler two forks instead of
  // one so the silhouette reads as "antler," not "twig."
  'antlers': svg(`
    <g transform="translate(${CX} 90)">
      <path d="M -50 110 Q -75 20 -150 -50 Q -130 10 -190 30 Q -145 50 -175 110 Q -125 95 -140 150"
            fill="none" stroke="#8A6A3E" stroke-width="28" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M 50 110 Q 75 20 150 -50 Q 130 10 190 30 Q 145 50 175 110 Q 125 95 140 150"
            fill="none" stroke="#8A6A3E" stroke-width="28" stroke-linecap="round" stroke-linejoin="round"/>
      <ellipse cx="-58" cy="150" rx="26" ry="34" fill="#5A3B2E" stroke="${BLACK}" stroke-width="11"/>
      <ellipse cx="58" cy="150" rx="26" ry="34" fill="#5A3B2E" stroke="${BLACK}" stroke-width="11"/>
    </g>
  `),

  'halo': svg(`
    <ellipse cx="${CX}" cy="130" rx="120" ry="30" fill="none" stroke="#F2E23A" stroke-width="16"/>
    <ellipse cx="${CX}" cy="130" rx="120" ry="30" fill="none" stroke="#FFF6D8" stroke-width="6"/>
  `),
};

const run = async () => {
  for (const [name, source] of Object.entries(TRAITS)) {
    const svgPath = `${OUT}/${name}.svg`;
    const pngPath = `${OUT}/trait-${name}_head.png`;
    writeFileSync(svgPath, source);
    await sharp(svgPath).png().toFile(pngPath);
    console.log('rendered', pngPath);
  }
};

run();
