import { CategoryOption, Trait } from '../types';
import { loadTraitsFromManifest } from '../utils/traitLoader';

/**
 * Fallback category list, used only if the manifest fails to load so the
 * builder still renders empty tabs instead of nothing. The manifest generated
 * by scripts/generate-index.mjs is the real source of truth.
 */
export const defaultCategories: CategoryOption[] = [
  { id: 'aura', label: 'Aura' },
  { id: 'head', label: 'Head' },
  { id: 'face', label: 'Face' },
  { id: 'mouth', label: 'Mouth' },
  { id: 'body', label: 'Body' },
  { id: 'right_hand', label: 'Right Hand' },
  { id: 'left_hand', label: 'Left Hand' },
  { id: 'accessory', label: 'Accessory' },
];

export const baseCharacterImage = '/ping.png';

let loadedTraits: Trait[] = [];
let loadedCategories: CategoryOption[] = defaultCategories;

export const initializeTraits = async (): Promise<{
  traits: Trait[];
  categories: CategoryOption[];
}> => {
  const { traits: traitFiles, categories } = await loadTraitsFromManifest();

  if (traitFiles.length === 0) {
    console.warn('Trait manifest empty or unavailable; falling back to empty categories.');
    return { traits: [], categories: defaultCategories };
  }

  loadedTraits = traitFiles.map((file) => ({
    id: file.id,
    name: file.uiName,
    category: file.category as Trait['category'],
    imageSrc: file.imageSrc,
  }));

  // Every category stays visible even when it has no traits, so the tab row
  // does not reflow as the library grows.
  loadedCategories = categories.length > 0 ? categories : defaultCategories;

  return { traits: loadedTraits, categories: loadedCategories };
};

export const traits: Trait[] = loadedTraits;
export const categories: CategoryOption[] = loadedCategories;
