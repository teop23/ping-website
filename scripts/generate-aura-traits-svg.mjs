import sharp from 'sharp';
import { mkdirSync, writeFileSync } from 'fs';
import { decodePng, encodeRgba } from './lib/png.mjs';

/**
 * One-off generator: a batch of new `aura` traits (Treatment B - see
 * docs/trait-style-guide.md), hand-built as SVG plus a JS grain pass,
 * rasterized with sharp.
 *
 * This covers ONLY the flame/glow-halo sub-style (fire-aura, sunrise-aura).
 * Opening more of the category while building this turned up two other
 * sub-styles under the same "aura" label that this generator does NOT
 * attempt: full-frame flag/logo backdrops with a white cutout of the
 * character (american-aura, persian-aura, LGBTQ-aura, link-aura) and an
 * ornate swirl/tendril halo (fart-aura). Both involve picking specific
 * affiliations or a different geometry system entirely - left as a separate
 * decision rather than guessed at here.
 *
 * Three things did not work on the first attempt and are worth recording -
 * the last one shipped once, passed every mechanical check, and was only
 * caught by actually looking at a real composite:
 *
 *   - The gradient radius has to match the halo's own extent. Setting it to
 *     the full canvas size means the shape - which only reaches maybe 45% of
 *     that radius - never shows the gradient's brighter stops at all; every
 *     first-pass render came out muddy and dark for exactly this reason.
 *   - SVG filter grain (feTurbulence -> feColorMatrix -> feBlend/feComposite)
 *     rendered as solid noise in one attempt and vanished entirely in the
 *     next - this renderer's filter primitive support is not reliable enough
 *     to build on. Grain is added as a JS pass on the decoded pixel buffer
 *     instead, reusing scripts/lib/png.mjs - the same approach already
 *     trusted for the favicon and token image.
 *   - haloPath's first version closed an open arc (less than 360 degrees)
 *     with a single straight line from one end to the other. That draws a
 *     chord straight across the middle, so the shape fills in as a solid
 *     wedge over the character's face instead of a hollow crown - and it
 *     looked completely correct in isolation, in scripts/preview-trait.mjs,
 *     and in generate-index.mjs's validation, because none of those render
 *     the aura BEHIND a base character the way the live site does. It only
 *     showed up once actually composited: verified with a real
 *     `wrangler pages dev` render, repeated 4 times with identical byte
 *     counts (deterministic, not the site's separate intermittent CPU-budget
 *     issue), and diagnosed by directly sampling decoded pixel alpha at the
 *     exact coordinate where the base's face sits. Fixed two ways at once,
 *     deliberately redundant: haloPath's valleys and closing point now stay
 *     near the center instead of at a wide fixed radius, AND every shape is
 *     additionally clipped through an SVG mask that force-transparents a
 *     239px-radius disc around the face regardless of what the path drawing
 *     code does. The second one is the actual guarantee; the first is just
 *     better-looking geometry within it.
 *
 * The halo itself is an open ARC (roughly 250 degrees, top and sides only),
 * not a closed star - a full star put one spike straight down through where
 * the character's face sits. Every reference file (fire-aura, sunrise-aura)
 * wraps the head and shoulders and stops well short of the belly.
 *
 * Check registration and paint order with:
 *   node scripts/preview-trait.mjs --aura out.png .trait-work/trait-<name>_aura.png
 * That checks registration. It does NOT catch the wedge bug by itself - it
 * paints the aura behind the base the same way the live site does, so it
 * would have caught this one too, but always sample actual pixel alpha at
 * the face coordinate for anything reaching this close to center rather than
 * trusting a visual check alone.
 */

const OUT = '.trait-work';
mkdirSync(OUT, { recursive: true });

const CANVAS = 1147;
const CX = 573, CY = 490;

const mulberry32 = (seed) => () => {
  seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

/**
 * An open crown of spikes from `startDeg` to `endDeg` (measured clockwise
 * from straight up). Valleys dip down to a small `innerR` - close to the
 * center point, the way adjacent flame licks in the reference art (fire-aura,
 * sunrise-aura) converge low rather than stopping at a wide, uniform inner
 * radius - and the two open ends close by running straight down to the
 * center point itself rather than to each other.
 *
 * That last part matters and was wrong in an earlier version of this
 * function: closing the two ends of an arc with ONE straight line between
 * them draws a chord across the whole middle, so the shape fills in as a
 * solid wedge over the character's face instead of a hollow crown. It
 * rendered as a perfectly plausible halo in isolation - a jagged edge over a
 * dark fill looks right on its own - and only showed up once actually
 * composited over the base, where the wedge's opaque color replaced the face
 * instead of leaving it visible. Every aura in this file shared the
 * function, so all six had it; it was invisible on the ones whose wedge
 * color was already close to the base's near-black hood, and glaring on the
 * ones where it wasn't. Closing to a single center point, with valleys that
 * already run close to that same point, keeps the shape consistently thin
 * the whole way round instead of ballooning into a wedge at the seam.
 */
const haloPath = ({ spikes, outerR, innerR, jitter, seed, startDeg = -125, endDeg = 125 }) => {
  const rand = mulberry32(seed);
  const toXY = (deg, r) => {
    const a = ((deg - 90) * Math.PI) / 180;
    return [CX + Math.cos(a) * r, CY + Math.sin(a) * r * 0.92];
  };
  const points = [];
  const steps = spikes * 2;
  for (let i = 0; i <= steps; i++) {
    const deg = startDeg + ((endDeg - startDeg) * i) / steps;
    const isSpike = i % 2 === 0;
    let r = isSpike ? outerR : innerR;
    r *= 1 + (rand() - 0.5) * jitter;
    points.push(toXY(deg, r));
  }
  const d = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
  return `${d} L ${CX.toFixed(1)} ${CY.toFixed(1)} Z`;
};

/**
 * Radius of the zone that must never carry opaque aura content: measured from
 * the base character's own face (eyes at trait-space ~(495,381)/(658,381),
 * beak spanning roughly x 504-672 / y 401-481, all relative to this file's
 * CX/CY of (573,490)). 240px centered on CX/CY covers that with real margin.
 *
 * This is a backstop, not the primary defense - haloPath's valleys and the
 * closing point already try to stay clear of center - but per-concept radius
 * and jitter tuning cannot guarantee it for every random seed, and a single
 * masked-out disc guarantees it regardless. Confirmed empirically: a spike
 * from ice-aura and galaxy-aura's un-masked geometry landed fully opaque at
 * (573,300) - inside this radius - purely because a spike peak happened to
 * fall near that angle for those two seeds.
 */
const SAFE_ZONE_R = 240;

const svg = ({ id, path, stops, gradR, extra = '' }) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${CANVAS}" height="${CANVAS}" viewBox="0 0 ${CANVAS} ${CANVAS}">
  <defs>
    <radialGradient id="grad-${id}" cx="${CX}" cy="${CY}" r="${gradR}" gradientUnits="userSpaceOnUse">
      ${stops.map((s) => `<stop offset="${s.at}" stop-color="${s.color}"/>`).join('\n      ')}
    </radialGradient>
    <mask id="safe-${id}">
      <rect x="0" y="0" width="${CANVAS}" height="${CANVAS}" fill="white"/>
      <circle cx="${CX}" cy="${CY}" r="${SAFE_ZONE_R}" fill="black"/>
    </mask>
  </defs>
  <g mask="url(#safe-${id})">
    <path d="${path}" fill="url(#grad-${id})"/>
    ${extra}
  </g>
</svg>
`;

/** JS grain pass: per-pixel luminance jitter, scaled by the pixel's own
 *  alpha so it never bleeds onto fully transparent background. */
const addGrain = ({ width, height, data }, { strength, seed }) => {
  const rand = mulberry32(seed);
  const out = Buffer.from(data);
  for (let i = 0; i < width * height; i++) {
    const o = i * 4;
    const a = out[o + 3] / 255;
    if (a <= 0) continue;
    const jitter = (rand() - 0.5) * 2 * strength * 255;
    out[o] = Math.max(0, Math.min(255, out[o] + jitter));
    out[o + 1] = Math.max(0, Math.min(255, out[o + 1] + jitter));
    out[o + 2] = Math.max(0, Math.min(255, out[o + 2] + jitter));
  }
  return { width, height, data: out };
};

const CONCEPTS = {
  // Cool blue-grey rather than purple, so it doesn't collide with
  // shadow-aura/galaxy-aura's hue range. Lightning accents were tried but sat
  // entirely behind the base character at this halo height and were
  // dropped - dead weight, never visible in the actual composite.
  'storm-aura': {
    path: haloPath({ spikes: 9, outerR: 480, innerR: 90, jitter: 0.28, seed: 11 }),
    stops: [
      { at: '0%', color: '#04070A' },
      { at: '35%', color: '#122436' },
      { at: '65%', color: '#2E5C7A' },
      { at: '88%', color: '#6FA8C4' },
      { at: '100%', color: '#E4F3FF' },
    ],
    gradR: 470,
    grainSeed: 111,
  },

  'toxic-aura': {
    path: haloPath({ spikes: 11, outerR: 450, innerR: 85, jitter: 0.4, seed: 22 }),
    stops: [
      { at: '0%', color: '#040803' },
      { at: '35%', color: '#0F3A0D' },
      { at: '65%', color: '#2F8A1E' },
      { at: '88%', color: '#7FCE3A' },
      { at: '100%', color: '#DFFFA0' },
    ],
    gradR: 440,
    grainSeed: 222,
  },

  'ice-aura': {
    path: haloPath({ spikes: 8, outerR: 490, innerR: 100, jitter: 0.15, seed: 33 }),
    stops: [
      { at: '0%', color: '#02070B' },
      { at: '35%', color: '#0E3145' },
      { at: '65%', color: '#2E7FA3' },
      { at: '88%', color: '#7FCBE0' },
      { at: '100%', color: '#F2FDFF' },
    ],
    gradR: 480,
    grainSeed: 333,
  },

  'holy-aura': (() => {
    const rayCount = 14;
    const rays = Array.from({ length: rayCount }, (_, i) => {
      const deg = -125 + (250 * i) / (rayCount - 1);
      const long = i % 2 === 0;
      const outer = long ? 520 : 420;
      const a = ((deg - 90) * Math.PI) / 180;
      const half = 0.05;
      const a1 = a - half, a2 = a + half;
      const x0 = CX + Math.cos(a) * 260, y0 = CY + Math.sin(a) * 260 * 0.92;
      const x1 = CX + Math.cos(a1) * outer, y1 = CY + Math.sin(a1) * outer * 0.92;
      const x2 = CX + Math.cos(a2) * outer, y2 = CY + Math.sin(a2) * outer * 0.92;
      return `M ${x0.toFixed(1)} ${y0.toFixed(1)} L ${x1.toFixed(1)} ${y1.toFixed(1)} L ${x2.toFixed(1)} ${y2.toFixed(1)} Z`;
    }).join(' ');
    // Rays only, no ring - each ray triangle starts at r=260 and points
    // outward, so unlike haloPath's spikes none of them ever reaches the
    // center; nothing here can create the wedge-over-the-face bug.
    return {
      path: rays,
      stops: [
        { at: '0%', color: '#0A0704' },
        { at: '35%', color: '#5A4413' },
        { at: '65%', color: '#B08B24' },
        { at: '88%', color: '#F0CB55' },
        { at: '100%', color: '#FFF8DE' },
      ],
      gradR: 500,
      grainSeed: 444,
    };
  })(),

  // Near-monochrome grey/green smoke rather than purple - storm-aura and
  // galaxy-aura already own that end of the palette, and three purples in
  // one six-trait batch would read as one color with different jitter.
  'shadow-aura': {
    path: haloPath({ spikes: 7, outerR: 460, innerR: 80, jitter: 0.5, seed: 55, startDeg: -140, endDeg: 140 }),
    stops: [
      { at: '0%', color: '#020302' },
      { at: '35%', color: '#141812' },
      { at: '65%', color: '#333B2E' },
      { at: '88%', color: '#5C6A54' },
      { at: '100%', color: '#9BAA8E' },
    ],
    gradR: 450,
    grainSeed: 555,
  },

  'galaxy-aura': (() => {
    const rand = mulberry32(66);
    const stars = Array.from({ length: 22 }, () => {
      const deg = -130 + rand() * 260;
      const a = ((deg - 90) * Math.PI) / 180;
      const r = 300 + rand() * 200;
      const x = CX + Math.cos(a) * r;
      const y = CY + Math.sin(a) * r * 0.92;
      const size = 3 + rand() * 6;
      return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${size.toFixed(1)}" fill="white" opacity="${(0.5 + rand() * 0.5).toFixed(2)}"/>`;
    }).join('\n      ');
    return {
      path: haloPath({ spikes: 12, outerR: 470, innerR: 110, jitter: 0.22, seed: 66 }),
      stops: [
        { at: '0%', color: '#01000A' },
        { at: '35%', color: '#210F4A' },
        { at: '65%', color: '#4C1E86' },
        { at: '88%', color: '#8C4ED6' },
        { at: '100%', color: '#DAB6FF' },
      ],
      gradR: 460,
      grainSeed: 666,
      extra: `\n      ${stars}\n    `,
    };
  })(),
};

const run = async () => {
  for (const [name, spec] of Object.entries(CONCEPTS)) {
    const svgPath = `${OUT}/${name}.svg`;
    const flatPngPath = `${OUT}/${name}-flat.png`;
    const pngPath = `${OUT}/trait-${name}_aura.png`;

    writeFileSync(svgPath, svg({ id: name, path: spec.path, stops: spec.stops, gradR: spec.gradR, extra: spec.extra }));
    await sharp(svgPath).png().toFile(flatPngPath);

    const flat = decodePng(await sharp(flatPngPath).toBuffer());
    const grained = addGrain(flat, { strength: 0.06, seed: spec.grainSeed });
    writeFileSync(pngPath, encodeRgba(grained));
    console.log('rendered', pngPath);
  }
};

run();
