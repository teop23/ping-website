import { Trait, CategoryOption } from '../types';

// Category options
export const categories: CategoryOption[] = [
  { id: 'head', label: 'Head' },
  { id: 'face', label: 'Face' },
  { id: 'body', label: 'Body' },
  { id: 'accessory', label: 'Accessory' }
];

// Base character
export const baseCharacterImage = '/images/base-character.png';

// Trait data
export const traits: Trait[] = [
  // Head traits
  {
    id: 'yellow-bandana',
    name: 'Yellow Bandana',
    category: 'head',
    imageSrc: '/images/traits/head/yellow-bandana.png'
  },
  {
    id: 'green-cap',
    name: 'Green Cap',
    category: 'head',
    imageSrc: '/images/traits/head/green-cap.png'
  },
  {
    id: 'wizard-hat',
    name: 'Wizard Hat',
    category: 'head',
    imageSrc: '/images/traits/head/wizard-hat.png'
  },
  {
    id: 'party-hat',
    name: 'Party Hat',
    category: 'head',
    imageSrc: '/images/traits/head/party-hat.png'
  },
  {
    id: 'devil-horns',
    name: 'Devil Horns',
    category: 'head',
    imageSrc: '/images/traits/head/devil-horns.png'
  },
  
  // Face traits
  {
    id: 'cool-glasses',
    name: 'Cool Glasses',
    category: 'face',
    imageSrc: '/images/traits/face/cool-glasses.png'
  },
  {
    id: 'eye-patch',
    name: 'Eye Patch',
    category: 'face',
    imageSrc: '/images/traits/face/eye-patch.png'
  },
  {
    id: 'monocle',
    name: 'Monocle',
    category: 'face',
    imageSrc: '/images/traits/face/monocle.png'
  },
  
  // Body traits
  {
    id: 'gold-chain',
    name: 'Gold Chain',
    category: 'body',
    imageSrc: '/images/traits/body/gold-chain.png'
  },
  {
    id: 'tie',
    name: 'Tie',
    category: 'body',
    imageSrc: '/images/traits/body/tie.png'
  },
  {
    id: 'hoodie',
    name: 'Hoodie',
    category: 'body',
    imageSrc: '/images/traits/body/hoodie.png'
  },
  
  // Accessory traits
  {
    id: 'wand',
    name: 'Wand',
    category: 'accessory',
    imageSrc: '/images/traits/accessory/wand.png'
  },
  {
    id: 'sword',
    name: 'Sword',
    category: 'accessory',
    imageSrc: '/images/traits/accessory/sword.png'
  },
  {
    id: 'skateboard',
    name: 'Skateboard',
    category: 'accessory',
    imageSrc: '/images/traits/accessory/skateboard.png'
  },
  {
    id: 'flame',
    name: 'Flame',
    category: 'accessory',
    imageSrc: '/images/traits/accessory/flame.png'
  }
];

// Placeholder images for the MVP version since we don't have the actual trait images
export const placeholderTraits = {
  baseCharacter: 'https://via.placeholder.com/300x400/654321/ffffff?text=Base+Character',
  head: {
    'yellow-bandana': 'https://via.placeholder.com/100x100/FFD700/000000?text=Yellow+Bandana',
    'green-cap': 'https://via.placeholder.com/100x100/00FF00/000000?text=Green+Cap',
    'wizard-hat': 'https://via.placeholder.com/100x100/4B0082/ffffff?text=Wizard+Hat',
    'party-hat': 'https://via.placeholder.com/100x100/FF6347/000000?text=Party+Hat',
    'devil-horns': 'https://via.placeholder.com/100x100/FF0000/ffffff?text=Devil+Horns'
  },
  face: {
    'cool-glasses': 'https://via.placeholder.com/100x100/000000/ffffff?text=Cool+Glasses',
    'eye-patch': 'https://via.placeholder.com/100x100/000000/ffffff?text=Eye+Patch',
    'monocle': 'https://via.placeholder.com/100x100/FFD700/000000?text=Monocle'
  },
  body: {
    'gold-chain': 'https://via.placeholder.com/100x100/FFD700/000000?text=Gold+Chain',
    'tie': 'https://via.placeholder.com/100x100/FF0000/ffffff?text=Tie',
    'hoodie': 'https://via.placeholder.com/100x100/4169E1/ffffff?text=Hoodie'
  },
  accessory: {
    'wand': 'https://via.placeholder.com/100x100/9400D3/ffffff?text=Wand',
    'sword': 'https://via.placeholder.com/100x100/708090/ffffff?text=Sword',
    'skateboard': 'https://via.placeholder.com/100x100/A52A2A/ffffff?text=Skateboard',
    'flame': 'https://via.placeholder.com/100x100/FF4500/000000?text=Flame'
  }
};