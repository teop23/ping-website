import { Trait, CategoryOption } from '../types';
import { loadTraitsFromAssets, loadTraitsFromAssetsDynamic, getAvailableCategories } from '../utils/traitLoader';

// Default category options (will be updated based on available traits)
export const defaultCategories: CategoryOption[] = [
  { id: 'head', label: 'Head' },
  { id: 'face', label: 'Face' },
  { id: 'body', label: 'Body' },
  { id: 'right_hand', label: 'Right Hand' },
  { id: 'left_hand', label: 'Left Hand' },
  { id: 'accessory', label: 'Accessory' }
];

// Base character
export const baseCharacterImage = './assets/images/ping.png';

// Dynamic traits loaded from assets folder
let loadedTraits: Trait[] = [];
let loadedCategories: CategoryOption[] = defaultCategories;

// Function to load traits dynamically
export const initializeTraits = async (): Promise<{ traits: Trait[], categories: CategoryOption[] }> => {
  try {
    // Try dynamic loading first, fall back to manual loading
    let traitFiles = await loadTraitsFromAssetsDynamic();
    
    // If dynamic loading fails or returns empty, try manual loading
    if (traitFiles.length === 0) {
      traitFiles = await loadTraitsFromAssets();
    }
    
    const traitCountByCategory: Record<string, number> = {};

    for (const trait of traitFiles) {
      // Count traits per category
      traitCountByCategory[trait.category] = (traitCountByCategory[trait.category] || 0) + 1;
    }

    let possibleCombinations = 1;
    for( const category in traitCountByCategory) {
      possibleCombinations *= (traitCountByCategory[category] + 1); 
    }

    console.log(`📦 Loaded ${traitFiles.length} trait files`);
    console.log(`🔢 Possible trait combinations: ${possibleCombinations}`);
    
    // Convert trait files to Trait objects
    loadedTraits = traitFiles.map(traitFile => ({
      id: traitFile.id,
      name: traitFile.uiName, // Use the UI-friendly name
      category: traitFile.category as any,
      imageSrc: traitFile.imageSrc
    }));
    
    // Log categories found for debugging
    const foundCategories = [...new Set(loadedTraits.map(t => t.category))];
    console.log('📂 Categories found:', foundCategories);
    
    // Always show all default categories regardless of whether they have traits
    loadedCategories = defaultCategories;
    
    return { traits: loadedTraits, categories: loadedCategories };
  } catch (error) {
    console.error('Error initializing traits:', error);
    // Fall back to defaults
    return { traits: [], categories: defaultCategories };
  }
};

// Export current traits and categories (will be empty until initialized)
export const traits: Trait[] = loadedTraits;
export const categories: CategoryOption[] = loadedCategories;