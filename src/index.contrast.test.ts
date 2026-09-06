import { readFileSync } from 'fs';
import { describe, expect, it } from 'vitest';

/**
 * Contrast invariants for whichever palette is checked out.
 *
 * Every colour bug in this project has been the same shape: a token is changed
 * for one surface, and a pairing somewhere else that depended on its old value
 * silently becomes unreadable. It has happened with the text selection, the
 * keyboard focus ring, the selected trait card and the selected-trait chip, and
 * each was found by eye rather than by anything that would catch it again.
 *
 * These read the real tokens out of index.css and assert the pairings the UI
 * actually relies on. Changing a token now fails here rather than shipping.
 */

const CSS = readFileSync('src/index.css', 'utf8');

/** Pull a bare OKLCH triple, following one level of var() indirection. */
const token = (name: string): [number, number, number] => {
  const raw = CSS.match(new RegExp(`--${name}:\\s*([^;]+);`))?.[1]?.trim();
  if (!raw) throw new Error(`token --${name} not found in src/index.css`);

  const indirect = raw.match(/^var\(--([\w-]+)\)$/);
  if (indirect) return token(indirect[1]);

  const parts = raw.replace('%', '').split(/\s+/).map(Number);
  if (parts.length < 3 || parts.some(Number.isNaN)) {
    throw new Error(`token --${name} is not a bare OKLCH triple: "${raw}"`);
  }
  return [parts[0], parts[1], parts[2]];
};

const linToSrgb = (c: number) => (c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055);

const oklchToRgb = ([L, C, H]: [number, number, number]) => {
  const l0 = L / 100;
  const h = (H * Math.PI) / 180;
  const a = C * Math.cos(h);
  const b = C * Math.sin(h);
  const l = (l0 + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (l0 - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (l0 - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ].map((v) => Math.max(0, Math.min(1, linToSrgb(v))));
};

const srgbToLin = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);

const luminance = (name: string) => {
  const [r, g, b] = oklchToRgb(token(name)).map(srgbToLin);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const contrast = (fg: string, bg: string) => {
  const [hi, lo] = [luminance(fg), luminance(bg)].sort((a, b) => b - a);
  return (hi + 0.05) / (lo + 0.05);
};

/** Every surface a piece of body text can end up sitting on. */
const SURFACES = ['bg-ground', 'bg-raised', 'bg-panel'];

const AA_BODY = 4.5;
/** WCAG 1.4.11: non-text UI such as a focus ring. */
const AA_UI = 3;

describe('text on every surface', () => {
  for (const ink of ['ink', 'ink-muted', 'ink-faint']) {
    for (const surface of SURFACES) {
      it(`${ink} on ${surface}`, () => {
        expect(contrast(ink, surface)).toBeGreaterThanOrEqual(AA_BODY);
      });
    }
  }
});

describe('the accent', () => {
  it('text on a brand fill is readable', () => {
    // The buy button, the category badges and the hero all put text on lime.
    expect(contrast('ink-inverse', 'brand')).toBeGreaterThanOrEqual(AA_BODY);
  });

  it('text on the brand wash is readable', () => {
    // The selected-traits bar and the selected trait card use this as a ground.
    // A lime-on-lime chip here measured 1.03:1.
    expect(contrast('ink', 'brand-wash')).toBeGreaterThanOrEqual(AA_BODY);
  });

  it('the hover fill keeps its text readable', () => {
    expect(contrast('ink-inverse', 'brand-hover')).toBeGreaterThanOrEqual(AA_BODY);
  });
});

describe('selection and focus', () => {
  it('selected text is readable against the selection fill', () => {
    expect(contrast('selection-ink', 'selection-bg')).toBeGreaterThanOrEqual(AA_BODY);
  });

  it('the inverted selection on a brand surface is readable', () => {
    // .surface-brand swaps the pair, so it has to work in both directions.
    expect(contrast('selection-bg', 'selection-ink')).toBeGreaterThanOrEqual(AA_BODY);
  });

  for (const surface of SURFACES) {
    it(`the focus ring is visible on ${surface}`, () => {
      expect(contrast('focus-ring', surface)).toBeGreaterThanOrEqual(AA_UI);
    });
  }

  it('the focus ring reads against a brand fill', () => {
    // Lime buttons are focusable and the hero is a lime surface, so the ring
    // lands on lime. It is two-tone precisely because no single colour clears
    // 3:1 against both the surfaces and the accent; either tone may do the work.
    const best = Math.max(contrast('focus-ring', 'brand'), contrast('focus-ring-halo', 'brand'));
    expect(best).toBeGreaterThanOrEqual(AA_UI);
  });

  for (const surface of SURFACES) {
    it(`the focus halo reads against ${surface}`, () => {
      const best = Math.max(contrast('focus-ring', surface), contrast('focus-ring-halo', surface));
      expect(best).toBeGreaterThanOrEqual(AA_UI);
    });
  }
});

describe('state colours', () => {
  for (const state of ['positive', 'negative']) {
    for (const surface of SURFACES) {
      it(`${state} on ${surface}`, () => {
        expect(contrast(state, surface)).toBeGreaterThanOrEqual(AA_BODY);
      });
    }
  }
});

describe('structure', () => {
  it('hairlines are visible against the page', () => {
    // Borders are how cards separate from the ground; below this they vanish.
    expect(contrast('hairline', 'bg-ground')).toBeGreaterThanOrEqual(1.2);
  });

  it('surfaces are distinguishable from one another', () => {
    expect(contrast('bg-raised', 'bg-ground')).toBeGreaterThanOrEqual(1.05);
    expect(contrast('bg-panel', 'bg-raised')).toBeGreaterThanOrEqual(1.05);
  });
});
