import { BasicTrait, Trait, CategoryOption } from '../types';

// Category options in the order you specified
export const categories: CategoryOption[] = [
  { id: 'head', label: 'Head' },
  { id: 'face', label: 'Face' },
  { id: 'body', label: 'Body' },
  { id: 'right_hand', label: 'Right Hand' },
  { id: 'left_hand', label: 'Left Hand' },
  { id: 'accessory', label: 'Accessory' }
];

// Base character
export const baseCharacterImage = './assets/images/ping.png';

// Empty basic traits list - you can fill this later
export const basicTraits: BasicTrait[] = [
  // Example structure (remove these when adding real traits):
  // {
  //   id: 'cool-hat',
  //   name: 'Cool Hat',
  //   path: '/src/assets/traits/cool-hat.png',
  //   category: 'head'
  // }
];

// Convert BasicTrait to Trait for compatibility
export const traits: Trait[] = basicTraits.map(basicTrait => ({
  ...basicTrait,
  imageSrc: basicTrait.path
}));