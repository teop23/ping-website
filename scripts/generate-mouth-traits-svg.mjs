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

// Beak center measured directly off public/ping.png (zoomed crop at
// x=340..680,y=370..500) and carried through the renderer's actual math:
// canvasX = baseLeft + bx*1.4*(canvasSize/1024), traitX = canvasX*(1147/canvasSize).
// Beak bbox in trait-space: y 401-481 (half-extents ~84 x ~40 around (588,441)).
// Eyes land at trait-space (495, 381) and (658, 381), radius ~11, so the
// eye's own bottom edge is at y~392.
//
// Between those two facts is a real, narrow constraint: the cover shape's
// top edge must sit in the 9px window between y=392 (eye bottom) and y=401
// (beak top) to hide the beak without touching the eyes. The first version
// of this file used a STROKED ellipse (13px stroke) for the cover, and the
// stroke's own width ate most of that 9px window from both directions at
// once - it shipped, composited fine in isolation, and visibly overlapped
// the eyes once actually rendered on the site. A person caught it, not any
// check here.
//
// Fix: no stroke on the cover shape at all. It never needed one - its only
// job is to be the same cream as the surrounding face so the seam is
// invisible, and a decorative border was exactly what was consuming the
// clearance. A flat-topped rect (not an ellipse) makes the top edge exact
// and independent of width, rather than curving away and re-eating margin
// as rx changes.
const CX = 588; // beak center x; beak center y (441) has no remaining direct
                 // use now that the cover is a flat-topped rect rather than
                 // an ellipse centered on it.
const COVER_TOP = 399; // 2px above beak-top(401): full coverage, 7px real
                        // clearance below eye-bottom(392).
const COVER_BOTTOM = 500; // comfortably past beak-bottom(481)
const COVER_LEFT = CX - 135, COVER_RIGHT = CX + 135;

const cover = () => `
  <rect x="${COVER_LEFT}" y="${COVER_TOP}" width="${COVER_RIGHT - COVER_LEFT}" height="${COVER_BOTTOM - COVER_TOP}"
        rx="40" fill="${CREAM}"/>
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
  // The curls reached up to y=362, well into the eyes' own y-range
  // (y 370-392) - overlap that exists regardless of x-position, since the
  // shapes shared vertical space at all. Shifted the whole path down 45px
  // so its highest point clears y=399 (the same safe boundary the cover
  // patch uses) and it rests on the beak's upper edge instead, which reads
  // as a normal mustache position rather than eyebrows.
  'mustache-only': svg(`
    <path d="M 588 433
             C 552 407, 502 411, 480 433
             C 500 425, 528 427, 546 439
             C 530 429, 508 431, 495 443
             C 522 433, 552 435, 588 447
             C 624 435, 654 433, 681 443
             C 668 431, 646 429, 630 439
             C 648 427, 676 425, 696 433
             C 674 411, 624 407, 588 433 Z"
          fill="#2B2320" stroke="${BLACK}" stroke-width="7" stroke-linejoin="round"/>
  `),

  // Held in the beak's right corner, matching the existing cigar/joint
  // convention, and shifted clear of the (658,381) eye.
  // The candy head at (706,428) was 67px from the right eye (658,381) with a
  // combined effective radius (candy + stroke, eye + stroke) of ~74px -
  // genuine overlap, not a rounding error. Shifted right and down for real
  // clearance (~96px center-to-center against the same ~74px combined
  // radius - about 22px of actual daylight between the two shapes).
  'lollipop': svg(`
    <g transform="rotate(-16 726 472)">
      <rect x="718" y="472" width="16" height="130" rx="7" fill="white" stroke="${BLACK}" stroke-width="8"/>
      <circle cx="726" cy="448" r="58" fill="#F2A6C4" stroke="${BLACK}" stroke-width="10"/>
      <path d="M 726 448 m -38 0 a 38 38 0 0 1 76 0" fill="none" stroke="#E8536B" stroke-width="8"/>
      <path d="M 726 448 m -22 0 a 22 22 0 0 1 44 0" fill="none" stroke="#E8536B" stroke-width="7"/>
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
