import { Trait, CategoryOption } from '../types';
import { loadTraitsFromAssets, getAvailableCategories } from '../utils/traitLoader';

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
    const traitFiles = await loadTraitsFromAssets();
    
    // Convert trait files to Trait objects
    loadedTraits = traitFiles.map(traitFile => ({
      id: traitFile.id,
      name: traitFile.name,
      category: traitFile.category as any,
      imageSrc: traitFile.imageSrc
    }));
    
    // Get available categories from loaded traits
    const availableCategories = getAvailableCategories(traitFiles);
    
    // Create category options, using defaults where available
    loadedCategories = availableCategories.map(categoryId => {
      const defaultCategory = defaultCategories.find(cat => cat.id === categoryId);
      return defaultCategory || {
        id: categoryId as any,
        label: categoryId.charAt(0).toUpperCase() + categoryId.slice(1)
      };
    });
    
    // If no traits were loaded, fall back to default categories
    if (loadedCategories.length === 0) {
      loadedCategories = defaultCategories;
    }
    
    console.log('Traits initialized:', { 
      traitsCount: loadedTraits.length, 
      categories: loadedCategories.map(c => c.id) 
    });
    
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

// Placeholder images for fallback (when no actual trait files are available)
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