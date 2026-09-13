import { describe, expect, it } from 'vitest';
import { traitsFromSearch } from './shareSelection';
import { Trait } from '../types';

const traits: Trait[] = [
  { id: 'crown_head', category: 'head', name: 'Crown', imageSrc: '' },
  { id: 'blue-aura_aura', category: 'aura', name: 'Blue Aura', imageSrc: '' },
];

describe('traitsFromSearch', () => {
  it('resolves known category=name pairs to traits', () => {
    const picked = traitsFromSearch('?head=crown&aura=blue-aura', traits);
    expect(picked.map((t) => t.id)).toEqual(['crown_head', 'blue-aura_aura']);
  });

  it('ignores unknown categories or trait names', () => {
    const picked = traitsFromSearch('?nope=whatever&head=missing', traits);
    expect(picked).toEqual([]);
  });
});
