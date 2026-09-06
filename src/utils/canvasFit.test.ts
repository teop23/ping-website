import { describe, expect, it } from 'vitest';
import { fitSquare, fitToAspect, insetBy } from './canvasFit';

/**
 * These are the regression tests for two shipped bugs:
 * the watermark canvas was fixed square, so a landscape upload exported with
 * grey bars baked into the PNG; and the trait editor's canvas was stretched to
 * a non-square box, which desynced pointer coordinates from the cursor.
 */

describe('fitToAspect', () => {
  it('preserves a landscape aspect ratio', () => {
    const { width, height } = fitToAspect({ width: 800, height: 800 }, 1.5);
    expect(width / height).toBeCloseTo(1.5, 2);
  });

  it('preserves a portrait aspect ratio', () => {
    const aspect = 400 / 700;
    const { width, height } = fitToAspect({ width: 800, height: 800 }, aspect);
    expect(width / height).toBeCloseTo(aspect, 2);
  });

  it('never exceeds the space it is given', () => {
    const available = { width: 300, height: 500 };
    for (const aspect of [0.4, 0.75, 1, 1.5, 2.5, 4]) {
      const fitted = fitToAspect(available, aspect);
      expect(fitted.width).toBeLessThanOrEqual(available.width);
      expect(fitted.height).toBeLessThanOrEqual(available.height);
    }
  });

  it('is limited by height when the box is wide', () => {
    const fitted = fitToAspect({ width: 2000, height: 300 }, 1.5);
    expect(fitted.height).toBe(300);
    expect(fitted.width).toBe(450);
  });

  it('is limited by width when the box is tall', () => {
    const fitted = fitToAspect({ width: 300, height: 2000 }, 1.5);
    expect(fitted.width).toBe(300);
    expect(fitted.height).toBe(200);
  });

  it('returns whole pixels so fabric is not resampling on a half-pixel grid', () => {
    const fitted = fitToAspect({ width: 501, height: 337 }, 1.37);
    expect(Number.isInteger(fitted.width)).toBe(true);
    expect(Number.isInteger(fitted.height)).toBe(true);
  });

  it('produces a square for a square source, which is the case that used to be assumed', () => {
    const fitted = fitToAspect({ width: 600, height: 600 }, 1);
    expect(fitted.width).toBe(fitted.height);
  });

  it('collapses rather than throwing on a degenerate box', () => {
    expect(fitToAspect({ width: 0, height: 500 }, 1.5)).toEqual({ width: 0, height: 0 });
    expect(fitToAspect({ width: -20, height: 500 }, 1.5)).toEqual({ width: 0, height: 0 });
  });

  it('collapses rather than throwing on a degenerate aspect', () => {
    expect(fitToAspect({ width: 500, height: 500 }, 0)).toEqual({ width: 0, height: 0 });
    expect(fitToAspect({ width: 500, height: 500 }, NaN)).toEqual({ width: 0, height: 0 });
    expect(fitToAspect({ width: 500, height: 500 }, Infinity)).toEqual({ width: 0, height: 0 });
  });
});

describe('fitSquare', () => {
  it('takes the shorter side', () => {
    expect(fitSquare({ width: 900, height: 400 })).toBe(400);
    expect(fitSquare({ width: 400, height: 900 })).toBe(400);
  });

  it('stays square on a very oblong column, which is what broke the editor', () => {
    const size = fitSquare({ width: 672, height: 1218 });
    expect(size).toBe(672);
  });

  it('returns whole pixels', () => {
    expect(Number.isInteger(fitSquare({ width: 333.7, height: 500.2 }))).toBe(true);
  });

  it('returns 0 for a collapsed box rather than a negative size', () => {
    expect(fitSquare({ width: 0, height: 500 })).toBe(0);
    expect(fitSquare({ width: -50, height: 500 })).toBe(0);
  });
});

describe('insetBy', () => {
  it('subtracts padding from both axes', () => {
    expect(insetBy({ width: 500, height: 400 }, 32)).toEqual({ width: 468, height: 368 });
  });

  it('clamps at zero instead of going negative', () => {
    expect(insetBy({ width: 10, height: 10 }, 32)).toEqual({ width: 0, height: 0 });
  });
});
