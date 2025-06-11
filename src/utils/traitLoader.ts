// Utility to load traits from the assets/traits folder
// File naming convention: trait-{trait-name}_{category}.png

export interface TraitFile {
  id: string;
  name: string;
  uiName: string;
  category: string;
  imageSrc: string;
}

// Function to extract trait info from filename
export const parseTraitFilename = (filename: string): { name: string; uiName: string; category: string } | null => {
  // Remove file extension
  const nameWithoutExt = filename.replace(/\.(png|jpg|jpeg|gif|webp)$/i, '');
  
  // Check if it follows the pattern: trait-{name}_{category}
  // Updated regex to handle categories with underscores (like right_hand, left_hand)
  const match = nameWithoutExt.match(/^trait-(.+)_(head|face|body|right_hand|left_hand|accessory)$/);
  
  if (match) {
    const [, name, category] = match;
    const uiName = name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()); // Convert kebab-case to Title Case
    return {
      name: name, // Keep original kebab-case for ID matching
      uiName: uiName, // Human-readable name for UI
      category: category // Keep exact category match (already lowercase in regex)
    };
  }
  
  return null;
};

// Function to test if an image exists and can be loaded
const testImageLoad = (src: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });
};

// Function to load traits using explicit imports
export const loadTraitsFromAssets = async (): Promise<TraitFile[]> => {
  const traits: TraitFile[] = [];
  
  // Since we don't know what files exist, we'll return empty array
  // This will be populated when you add actual trait files
  
  return traits;
};

// Function to load traits using dynamic imports
export const loadTraitsFromAssetsDynamic = async (): Promise<TraitFile[]> => {
  const traits: TraitFile[] = [];
  
  try {
    // Use Vite's import.meta.glob to get all trait files
    const traitModules = import.meta.glob('/src/assets/traits/trait-*_*.{png,jpg,jpeg,gif,webp}', { 
      eager: true,
      as: 'url'
    });
    
    console.log(`🎨 Found ${Object.keys(traitModules).length} trait files`);
    
    Object.entries(traitModules).forEach(([path, url]) => {
      // Extract filename from path
      const filename = path.split('/').pop();
      
      if (filename) {
        const parsed = parseTraitFilename(filename);
        
        if (parsed) {
          traits.push({
            id: parsed.name, // Use the parsed name as ID
            name: parsed.name,
            uiName: parsed.uiName,
            category: parsed.category,
            imageSrc: url as string
          });
        }
      }
    });
    
    return traits;
  } catch (error) {
    console.error('Error in dynamic trait loading:', error);
    return [];
  }
};

// Function to get available categories from loaded traits
export const getAvailableCategories = (traits: TraitFile[]): string[] => {
  const categories = new Set(traits.map(trait => trait.category));
  return Array.from(categories).sort();
};