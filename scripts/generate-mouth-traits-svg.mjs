import sharp from 'sharp';
import { mkdirSync, writeFileSync } from 'fs';

/**
 * One-off generator: the first batch of `mouth` traits, hand-drawn as SVG and
 * rasterized with sharp rather than produced by an image model. Kept as a
 * worked reference for hand-authoring more flat-cartoon (Treatment A) traits
 * directly - see docs/trait-style-guide.md. Not part of the build; nothing
 * imports this.
 *
 * After editing, check registration with:
 *   node scripts/preview-trait.mjs out.png .trait-work/trait-<name>_mouth.png
 */

const OUT = '.trait-work';
mkdirSync(OUT, { recursive: true });

const BLACK = '#000000';
const CREAM = '#FDF8EF';
const STROKE = 13;

// Beak center measured directly off public/ping.png (zoomed crop at
// x=340..680,y=370..500) and carried through the renderer's actual math:
// canvasX = baseLeft + bx*1.4*(canvasSize/1024), traitX = canvasX*(1147/canvasSize).
// Beak bbox in ping.png space: x 468-575, y 402-453, center (521.5, 427.5)
// -> trait-space center (588, 441), half-extents ~(84, 40).
// Eyes land at trait-space (495, 381) and (658, 381) - the cover patch's top
// edge has to clear y=392 (eye bottom) or it visibly eats the eyes.
const CX = 588, CY = 441;

const cover = () => `
  <ellipse cx="${CX}" cy="${CY}" rx="128" ry="52" fill="${CREAM}" stroke="${BLACK}" stroke-width="${STROKE}"/>
`;

const svg = (body) => `<svg xmlns="http://www.w3.org/2000/svg" width="1147" height="1147" viewBox="0 0 1147 1147">${body}</svg>`;

const TRAITS = {
  'smile': svg(`
    ${cover()}
    <path d="M 505 450 Q 588 518 671 448" fill="none" stroke="${BLACK}" stroke-width="14" stroke-linecap="round"/>
  `),

  // Bigger tilt and a raised eyebrow-adjacent corner dot so it reads as
  // asymmetric at thumbnail scale, not just a slightly crooked smile.
  // One corner pulled sharply up into a raised cheek pocket, the other left
  // flat - the asymmetry has to be gross at thumbnail scale or it reads as
  // a plain smile.
  'smirk': svg(`
    ${cover()}
    <path d="M 510 448 L 588 448 Q 630 448 650 408 Q 660 442 626 462 Q 560 476 510 448 Z" fill="${BLACK}"/>
    <circle cx="642" cy="420" r="10" fill="${CREAM}"/>
  `),

  'tongue-out': svg(`
    ${cover()}
    <path d="M 508 435 Q 588 480 668 435 Q 588 452 508 435 Z" fill="${BLACK}"/>
    <path d="M 548 466 Q 588 535 628 466 Q 588 508 548 466 Z" fill="#E8536B" stroke="${BLACK}" stroke-width="8" stroke-linejoin="round"/>
  `),

  // Wide dark mouth with a bold white tooth row, one tooth pointedly missing
  // and outlined so the gap itself reads instead of just fading into the fill.
  // Three big square teeth, then a conspicuously empty black socket, then
  // one more tooth - the previous pass diced the row into slivers too thin
  // to read; a single missing block reads as "gap" far more clearly.
  'gap-tooth': svg(`
    ${cover()}
    <path d="M 498 420 Q 588 500 678 418 Q 588 472 498 420 Z" fill="${BLACK}"/>
    <rect x="514" y="424" width="34" height="38" fill="white" stroke="${BLACK}" stroke-width="4"/>
    <rect x="548" y="434" width="34" height="40" fill="white" stroke="${BLACK}" stroke-width="4"/>
    <rect x="628" y="436" width="34" height="36" fill="white" stroke="${BLACK}" stroke-width="4"/>
    <rect x="582" y="440" width="46" height="10" fill="${BLACK}"/>
  `),

  // The gold tooth is now the single largest shape in the mouth rather than
  // an accent on top of a smile curve, which is what it takes to survive
  // being scaled down to a trait-picker thumbnail.
  'gold-tooth': svg(`
    ${cover()}
    <path d="M 500 428 Q 588 500 676 424 Q 588 462 500 428 Z" fill="${BLACK}"/>
    <path d="M 556 434 L 556 478 L 606 486 L 606 442 Z" fill="#E8C34A" stroke="${BLACK}" stroke-width="6" stroke-linejoin="round"/>
    <path d="M 566 442 L 566 460" stroke="white" stroke-width="4" stroke-linecap="round" opacity="0.6"/>
  `),

  // Larger cavity and a thicker, higher-contrast tooth bar - the previous
  // pass read as a smear at 256px, this one has real fill area.
  'open-laugh': svg(`
    ${cover()}
    <path d="M 495 415 Q 588 520 681 408 Q 588 488 495 415 Z" fill="#3A2318"/>
    <path d="M 512 420 Q 588 468 664 412 L 654 440 Q 588 478 522 448 Z" fill="white" stroke="${BLACK}" stroke-width="4" stroke-linejoin="round"/>
  `),

  'gum-bubble': svg(`
    ${cover()}
    <path d="M 528 448 Q 588 475 648 442" fill="none" stroke="${BLACK}" stroke-width="11" stroke-linecap="round"/>
    <circle cx="588" cy="500" r="52" fill="#F2A6C4" stroke="${BLACK}" stroke-width="10"/>
    <path d="M 566 472 Q 554 486 563 500" fill="none" stroke="white" stroke-width="6" stroke-linecap="round" opacity="0.75"/>
  `),

  // Bigger, higher-contrast twirl above the (uncovered) default beak.
  'mustache-only': svg(`
    <path d="M 588 388
             C 552 362, 502 366, 480 388
             C 500 380, 528 382, 546 394
             C 530 384, 508 386, 495 398
             C 522 388, 552 390, 588 402
             C 624 390, 654 388, 681 398
             C 668 386, 646 384, 630 394
             C 648 382, 676 380, 696 388
             C 674 366, 624 362, 588 388 Z"
          fill="#2B2320" stroke="${BLACK}" stroke-width="7" stroke-linejoin="round"/>
  `),

  // Held in the beak's right corner, matching the existing cigar/joint
  // convention, and shifted clear of the (658,381) eye.
  'lollipop': svg(`
    <g transform="rotate(-16 706 452)">
      <rect x="698" y="452" width="16" height="130" rx="7" fill="white" stroke="${BLACK}" stroke-width="8"/>
      <circle cx="706" cy="428" r="58" fill="#F2A6C4" stroke="${BLACK}" stroke-width="10"/>
      <path d="M 706 428 m -38 0 a 38 38 0 0 1 76 0" fill="none" stroke="#E8536B" stroke-width="8"/>
      <path d="M 706 428 m -22 0 a 22 22 0 0 1 44 0" fill="none" stroke="#E8536B" stroke-width="7"/>
    </g>
  `),

  // Bigger, higher-contrast whistle, plus bolder motion lines - the previous
  // pass was invisible at thumbnail scale.
  // Scaled up again and given a heavier outline - matches the weight class
  // of the lollipop now instead of disappearing next to it.
  'whistle': svg(`
    <g transform="rotate(6 700 452)">
      <ellipse cx="694" cy="450" rx="62" ry="42" fill="#C7CCD1" stroke="${BLACK}" stroke-width="13"/>
      <rect x="748" y="434" width="52" height="30" rx="7" fill="#9AA1A8" stroke="${BLACK}" stroke-width="10"/>
      <circle cx="682" cy="450" r="12" fill="${BLACK}"/>
    </g>
    <path d="M 812 420 Q 838 430 858 416" fill="none" stroke="${BLACK}" stroke-width="9" stroke-linecap="round" opacity="0.75"/>
    <path d="M 812 466 Q 842 480 864 468" fill="none" stroke="${BLACK}" stroke-width="9" stroke-linecap="round" opacity="0.55"/>
  `),
};

const run = async () => {
  for (const [name, source] of Object.entries(TRAITS)) {
    const svgPath = `${OUT}/${name}.svg`;
    const pngPath = `${OUT}/trait-${name}_mouth.png`;
    writeFileSync(svgPath, source);
    await sharp(svgPath).png().toFile(pngPath);
    console.log('rendered', pngPath);
  }
};

run();
