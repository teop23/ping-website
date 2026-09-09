import sharp from 'sharp';
import { mkdirSync, writeFileSync } from 'fs';

/**
 * One-off generator: a batch of new `face` traits, Treatment A (flat
 * cartoon - see docs/trait-style-guide.md), hand-built as SVG and rasterized
 * with sharp.
 *
 * Registration: eye centers measured off real face traits rather than
 * assumed. star-eyes_face spans both eyes and its own bounding-box center,
 * converted to this 1147 canvas, lands at (576.5, 375) - exactly the
 * midpoint of the two eye positions independently derived from ping.png
 * (495, 381) and (658, 381) in functions/api/image geometry. Both single-eye
 * traits (monocle, eye-patch) confirm the same eye x-positions. Used here:
 * LEFT_EYE=(495,381), RIGHT_EYE=(658,381), MID=(576,378).
 *
 * Face items that cover the eyes (glasses, a blindfold) draw an opaque shape
 * over the default eye dots, the same "occlude, then draw the real thing on
 * top" approach mouth traits use on the beak. No safe-zone mask is needed
 * here the way aura needed one: face draws AFTER the base in paint order, so
 * anything this file draws is naturally in front, not behind - confirmed by
 * TRAIT_ORDER in functions/_lib.ts (aura, body, face, mouth, head, ...) and
 * the fact every existing face trait already works this way. The aura bug
 * was specific to being the one category drawn before the base.
 *
 * Check registration with:
 *   node scripts/preview-trait.mjs out.png .trait-work/trait-<name>_face.png
 */

const OUT = '.trait-work';
mkdirSync(OUT, { recursive: true });

const BLACK = '#000000';
const CREAM = '#FDF8EF';
const CANVAS = 1147;

const LEFT_EYE = [495, 381];
const RIGHT_EYE = [658, 381];

const svg = (body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${CANVAS}" height="${CANVAS}" viewBox="0 0 ${CANVAS} ${CANVAS}">${body}</svg>`;

/** Occludes both default eye dots with the face's own cream, so a new eye
 *  graphic doesn't have the base's black dots showing through underneath. */
const coverEyes = (rx = 34, ry = 30) => `
  <ellipse cx="${LEFT_EYE[0]}" cy="${LEFT_EYE[1]}" rx="${rx}" ry="${ry}" fill="${CREAM}"/>
  <ellipse cx="${RIGHT_EYE[0]}" cy="${RIGHT_EYE[1]}" rx="${rx}" ry="${ry}" fill="${CREAM}"/>
`;

const TRAITS = {
  'wink': svg(`
    ${coverEyes()}
    <circle cx="${RIGHT_EYE[0]}" cy="${RIGHT_EYE[1]}" r="15" fill="${BLACK}"/>
    <path d="M 470 381 Q 495 397 520 381" fill="none" stroke="${BLACK}" stroke-width="10" stroke-linecap="round"/>
  `),

  'sleepy-eyes': svg(`
    ${coverEyes()}
    <path d="M 470 383 Q 495 398 520 383" fill="none" stroke="${BLACK}" stroke-width="10" stroke-linecap="round"/>
    <path d="M 633 383 Q 658 398 683 383" fill="none" stroke="${BLACK}" stroke-width="10" stroke-linecap="round"/>
  `),

  // Crypto-twitter's own meme, not third-party IP: glowing eye beams. First
  // pass used thin 1px-ish lines fanning out - invisible at thumbnail scale,
  // same failure mode as the early mouth traits. Solid wide triangular beams
  // and much bigger glowing eyes fix it the same way: make the one defining
  // shape bigger and higher-contrast rather than adding detail.
  'laser-eyes': svg(`
    ${coverEyes(34, 30)}
    <path d="M ${LEFT_EYE[0]} ${LEFT_EYE[1] - 20} L 40 250 L 40 340 Z" fill="#FF3B1A"/>
    <path d="M ${LEFT_EYE[0]} ${LEFT_EYE[1] - 8} L 60 290 L 60 335 Z" fill="#FFC94A"/>
    <path d="M ${RIGHT_EYE[0]} ${RIGHT_EYE[1] - 20} L 1112 250 L 1112 340 Z" fill="#FF3B1A"/>
    <path d="M ${RIGHT_EYE[0]} ${RIGHT_EYE[1] - 8} L 1092 290 L 1092 335 Z" fill="#FFC94A"/>
    <circle cx="${LEFT_EYE[0]}" cy="${LEFT_EYE[1]}" r="20" fill="#FF3B1A"/>
    <circle cx="${LEFT_EYE[0]}" cy="${LEFT_EYE[1]}" r="10" fill="#FFE8A0"/>
    <circle cx="${RIGHT_EYE[0]}" cy="${RIGHT_EYE[1]}" r="20" fill="#FF3B1A"/>
    <circle cx="${RIGHT_EYE[0]}" cy="${RIGHT_EYE[1]}" r="10" fill="#FFE8A0"/>
  `),

  // Spiral "dazed" eyes - a cartoon-universal, not any specific IP.
  'dizzy-eyes': (() => {
    const spiral = (cx, cy, seed) => {
      let d = `M ${cx} ${cy}`;
      for (let i = 1; i <= 60; i++) {
        const t = i / 60;
        const r = t * 24;
        const a = t * Math.PI * 6 + seed;
        d += ` L ${(cx + Math.cos(a) * r).toFixed(1)} ${(cy + Math.sin(a) * r).toFixed(1)}`;
      }
      return d;
    };
    return svg(`
      ${coverEyes()}
      <path d="${spiral(LEFT_EYE[0], LEFT_EYE[1], 0)}" fill="none" stroke="${BLACK}" stroke-width="6" stroke-linecap="round"/>
      <path d="${spiral(RIGHT_EYE[0], RIGHT_EYE[1], 1)}" fill="none" stroke="${BLACK}" stroke-width="6" stroke-linecap="round"/>
    `);
  })(),

  '3d-glasses': svg(`
    <rect x="440" y="350" width="90" height="70" rx="10" fill="#1A1A1A" stroke="${BLACK}" stroke-width="10"/>
    <rect x="605" y="350" width="90" height="70" rx="10" fill="#1A1A1A" stroke="${BLACK}" stroke-width="10"/>
    <rect x="447" y="357" width="76" height="56" rx="6" fill="#3A9BE0" opacity="0.85"/>
    <rect x="612" y="357" width="76" height="56" rx="6" fill="#E0403A" opacity="0.85"/>
    <path d="M 530 383 L 605 383" stroke="${BLACK}" stroke-width="9"/>
    <path d="M 440 383 L 370 360" stroke="${BLACK}" stroke-width="9" stroke-linecap="round"/>
    <path d="M 695 383 L 765 360" stroke="${BLACK}" stroke-width="9" stroke-linecap="round"/>
  `),

  // Plain black round frames, no brand reference.
  'round-glasses': svg(`
    <circle cx="${LEFT_EYE[0]}" cy="${LEFT_EYE[1]}" r="46" fill="${CREAM}" stroke="${BLACK}" stroke-width="11"/>
    <circle cx="${RIGHT_EYE[0]}" cy="${RIGHT_EYE[1]}" r="46" fill="${CREAM}" stroke="${BLACK}" stroke-width="11"/>
    <path d="M 541 381 L 612 381" stroke="${BLACK}" stroke-width="9"/>
    <path d="M ${LEFT_EYE[0] - 46} 381 L 400 362" stroke="${BLACK}" stroke-width="9" stroke-linecap="round"/>
    <path d="M ${RIGHT_EYE[0] + 46} 381 L 753 362" stroke="${BLACK}" stroke-width="9" stroke-linecap="round"/>
  `),

  // Thick black rectangular frames with a center taped repair - a generic
  // "nerd glasses" costume item, not any specific character.
  'nerd-glasses': svg(`
    <rect x="446" y="348" width="98" height="66" rx="8" fill="${CREAM}" stroke="${BLACK}" stroke-width="14"/>
    <rect x="609" y="348" width="98" height="66" rx="8" fill="${CREAM}" stroke="${BLACK}" stroke-width="14"/>
    <path d="M 544 381 L 609 381" stroke="${BLACK}" stroke-width="12"/>
    <path d="M 446 381 L 380 358" stroke="${BLACK}" stroke-width="12" stroke-linecap="round"/>
    <path d="M 707 381 L 773 358" stroke="${BLACK}" stroke-width="12" stroke-linecap="round"/>
    <rect x="562" y="373" width="28" height="16" fill="#E8DDB8" stroke="${BLACK}" stroke-width="3" transform="rotate(-8 576 381)"/>
  `),

  // A plain bandit-style bandana across the eyes - deliberately generic
  // (solid color, no pattern, no cultural or political reference), paired
  // thematically with the existing cowboy-hat head trait.
  'bandana-mask': svg(`
    <path d="M 380 350 Q 576 405 772 350 L 772 415 Q 576 465 380 415 Z" fill="#8C3A3A" stroke="${BLACK}" stroke-width="12" stroke-linejoin="round"/>
    <path d="M 420 375 Q 576 415 732 375" fill="none" stroke="${BLACK}" stroke-width="5" opacity="0.4"/>
  `),

  'blindfold': svg(`
    <path d="M 375 365 Q 576 410 777 365 L 777 400 Q 576 445 375 400 Z" fill="#242424" stroke="${BLACK}" stroke-width="10" stroke-linejoin="round"/>
    <path d="M 375 382 L 300 360" stroke="${BLACK}" stroke-width="10" stroke-linecap="round"/>
    <path d="M 777 382 L 852 360" stroke="${BLACK}" stroke-width="10" stroke-linecap="round"/>
  `),

  // Tears streaming from closed, happy eyes - a laughing-so-hard-I'm-crying
  // face, universal rather than tied to any specific emoji/brand.
  'tears-of-joy': svg(`
    ${coverEyes()}
    <path d="M 470 384 Q 495 371 520 384" fill="none" stroke="${BLACK}" stroke-width="10" stroke-linecap="round"/>
    <path d="M 633 384 Q 658 371 683 384" fill="none" stroke="${BLACK}" stroke-width="10" stroke-linecap="round"/>
    <path d="M 480 398 Q 470 440 483 462 Q 496 440 486 398 Z" fill="#7FC7E8" opacity="0.9"/>
    <path d="M 648 398 Q 638 440 651 462 Q 664 440 654 398 Z" fill="#7FC7E8" opacity="0.9"/>
  `),
};

const run = async () => {
  for (const [name, source] of Object.entries(TRAITS)) {
    const svgPath = `${OUT}/${name}.svg`;
    const pngPath = `${OUT}/trait-${name}_face.png`;
    writeFileSync(svgPath, source);
    await sharp(svgPath).png().toFile(pngPath);
    console.log('rendered', pngPath);
  }
};

run();
