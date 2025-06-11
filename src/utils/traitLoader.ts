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
  const match = nameWithoutExt.match(/^trait-(.+)_(.+)$/);
  
  if (match) {
    const [, name, category] = match;
    const uiName = name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()); // Convert kebab-case to Title Case
    return {
      name: name, // Keep original kebab-case for ID matching
      uiName: uiName, // Human-readable name for UI
      category: category.toLowerCase()
    };
  }
  
  return null;
};

// Function to dynamically import all trait files
export const loadTraitsFromAssets = async (): Promise<TraitFile[]> => {
  const traits: TraitFile[] = [];
  
  try {
    // Use Vite's import.meta.glob to get all trait files
    const traitModules = import.meta.glob('/src/assets/traits/trait-*_*.{png,jpg,jpeg,gif,webp}', { 
      eager: true,
      as: 'url'
    });
    
    Object.entries(traitModules).forEach(([path, url]) => {
      // Extract filename from path
      const filename = path.split('/').pop();
      
      if (filename) {
        const parsed = parseTraitFilename(filename);
        
        if (parsed) {
          traits.push({
            id: filename.replace(/\.(png|jpg|jpeg|gif|webp)$/i, ''), // Use filename without extension as ID
            name: parsed.name,
            uiName: parsed.uiName,
            category: parsed.category,
            imageSrc: url as string
          });
        }
      }
    });
    
    console.log(`Loaded ${traits.length} traits from assets folder:`, traits);
    return traits;
  } catch (error) {
    console.error('Error loading traits from assets:', error);
    return [];
  }
};

// Function to get available categories from loaded traits
export const getAvailableCategories = (traits: TraitFile[]): string[] => {
  const categories = new Set(traits.map(trait => trait.category));
  return Array.from(categories).sort();
};