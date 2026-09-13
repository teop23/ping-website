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
