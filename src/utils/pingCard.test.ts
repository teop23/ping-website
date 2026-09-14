import { readFileSync } from 'fs';
import { describe, expect, it } from 'vitest';
import { MAX_MESSAGE_LENGTH, PING_MESSAGES, cardLayout, fitLine, normalizeMessage } from './pingCard';

// A monospace stand-in: every character is 10 units wide.
const measure = (s: string) => s.length * 10;

describe('normalizeMessage', () => {
  it('collapses whitespace and trims', () => {
    expect(normalizeMessage('  Order\n\n  filled.  ')).toBe('Order filled.');
  });

  it('caps the length', () => {
    expect(normalizeMessage('x'.repeat(100))).toHaveLength(MAX_MESSAGE_LENGTH);
  });

  it('leaves every preset untouched', () => {
    for (const message of PING_MESSAGES) expect(normalizeMessage(message)).toBe(message);
  });
});

describe('fitLine', () => {
  it('returns text that already fits', () => {
    expect(fitLine('Seen.', 50, measure)).toBe('Seen.');
  });

  it('ellipsizes text that does not, within the width', () => {
    const line = fitLine('Bought the dip.', 80, measure);
    expect(line.endsWith('…')).toBe(true);
    expect(measure(line)).toBeLessThanOrEqual(80);
    expect(line).toBe('Bought…');
  });

  it('returns nothing when not even the ellipsis fits', () => {
    expect(fitLine('gm.', 5, measure)).toBe('');
  });
});

describe('PING_MESSAGES', () => {
  it('has no duplicates', () => {
    expect(new Set(PING_MESSAGES).size).toBe(PING_MESSAGES.length);
  });

  /**
   * The presets are declared once per build system: here, for the client
   * canvas, and again in functions/_lib.ts for the Cloudflare Functions
   * bundle (which /api/share and the open image API validate a message
   * against). They cannot share a module cheaply - the same situation
   * TRAIT_ORDER/traitOrder.test.ts is in - so this asserts they agree rather
   * than importing functions/_lib.ts directly, which would pull DOM types
   * this file needs into a program that does not carry them.
   */
  it('matches the presets mirrored in functions/_lib.ts', () => {
    const lib = readFileSync('functions/_lib.ts', 'utf8');
    const block = lib.match(/export const PING_MESSAGES = \[([\s\S]*?)\] as const;/);
    if (!block) throw new Error('PING_MESSAGES not found in functions/_lib.ts');
    const fromFunctions = [...block[1].matchAll(/'((?:[^'\\]|\\.)*)'/g)].map((m) =>
      m[1].replace(/\\(.)/g, '$1')
    );
    expect(fromFunctions).toEqual(PING_MESSAGES);
  });
});

describe('cardLayout', () => {
  it('keeps the banner above the character and everything inside the square', () => {
    for (const size of [512, 1024]) {
      const { banner, character } = cardLayout(size);
      expect(banner.y + banner.h).toBeLessThanOrEqual(character.y + 0.001);
      expect(banner.x + banner.w).toBeLessThanOrEqual(size);
      expect(character.x + character.size).toBeLessThanOrEqual(size);
      expect(character.y + character.size).toBeLessThanOrEqual(size + 0.001);
    }
  });

  it('scales proportionally between sticker and card sizes', () => {
    const small = cardLayout(512);
    const large = cardLayout(1024);
    expect(large.textX).toBeCloseTo(small.textX * 2);
    expect(large.messageSize).toBeCloseTo(small.messageSize * 2);
  });
});
