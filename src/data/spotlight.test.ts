import { existsSync } from 'fs';
import { describe, expect, it } from 'vitest';
import { SPOTLIGHT, spotlightLabel } from './spotlight';

describe('SPOTLIGHT', () => {
  it('only uses traits that are live in public/traits', () => {
    const missing = SPOTLIGHT.flatMap(({ combo }) =>
      Object.entries(combo)
        .map(([category, trait]) => `public/traits/trait-${trait}_${category}.png`)
        .filter((file) => !existsSync(file)),
    );
    expect(missing).toEqual([]);
  });

  it('features a slot each combo actually fills', () => {
    for (const entry of SPOTLIGHT) expect(entry.combo[entry.featured]).toBeTruthy();
  });
});

describe('spotlightLabel', () => {
  it('title-cases the trait and names the slot in words', () => {
    expect(spotlightLabel({ combo: { left_hand: 'money-bag' }, featured: 'left_hand' })).toEqual({
      name: 'Money Bag',
      slot: 'left hand',
    });
  });
});
