import { Trait, CategoryOption } from '../types';

// Category options
export const categories: CategoryOption[] = [
  { id: 'head', label: 'Head' },
  { id: 'face', label: 'Face' },
  { id: 'body', label: 'Body' },
  { id: 'accessory', label: 'Accessory' }
];

// Base character
export const baseCharacterImage = './assets/images/ping.png';

// Trait data - empty arrays for each category
export const traits: Trait[] = [];