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

// Function to test if an image exists and can be loaded
const testImageLoad = (src: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });
};

// Manually define available traits with their import paths
const traitDefinitions = [
  { filename: 'trait-example-hat_head.png', importPath: () => import('../assets/traits/trait-example-hat_head.png') },
  { filename: 'trait-cool-sunglasses_face.png', importPath: () => import('../assets/traits/trait-cool-sunglasses_face.png') },
  { filename: 'trait-gold-necklace_body.png', importPath: () => import('../assets/traits/trait-gold-necklace_body.png') },
  { filename: 'trait-magic-wand_accessory.png', importPath: () => import('../assets/traits/trait-magic-wand_accessory.png') },
  { filename: 'trait-sword_right_hand.png', importPath: () => import('../assets/traits/trait-sword_right_hand.png') },
  { filename: 'trait-magic-book_left_hand.png', importPath: () => import('../assets/traits/trait-magic-book_left_hand.png') }
];

// Function to load traits using explicit imports
export const loadTraitsFromAssets = async (): Promise<TraitFile[]> => {
  const traits: TraitFile[] = [];
  
  console.log('Loading traits using explicit imports...');
  
  for (const traitDef of traitDefinitions) {
    try {
      const parsed = parseTraitFilename(traitDef.filename);
      
      if (parsed) {
        // Try to import the trait file
        const module = await traitDef.importPath();
        const imageSrc = module.default;
        
        // Test if the image can be loaded
        const canLoad = await testImageLoad(imageSrc);
        
        if (canLoad) {
          traits.push({
            id: parsed.name, // Use the parsed name as ID
            name: parsed.name,
            uiName: parsed.uiName,
            category: parsed.category,
            imageSrc: imageSrc
          });
          console.log(`✓ Loaded trait: ${parsed.uiName} (${parsed.category})`);
        } else {
          console.warn(`✗ Failed to load image for trait: ${traitDef.filename}`);
        }
      }
    } catch (error) {
      console.warn(`✗ Failed to import trait: ${traitDef.filename}`, error);
    }
  }
  
  console.log(`Successfully loaded ${traits.length} traits`);
  return traits;
};

// Function to load traits using dynamic imports (fallback)
export const loadTraitsFromAssetsDynamic = async (): Promise<TraitFile[]> => {
  const traits: TraitFile[] = [];
  
  try {
    console.log('Attempting dynamic trait loading...');
    
    // Use Vite's import.meta.glob to get all trait files
    const traitModules = import.meta.glob('/src/assets/traits/trait-*_*.{png,jpg,jpeg,gif,webp}', { 
      eager: true,
      as: 'url'
    });
    
    console.log('Found trait modules:', Object.keys(traitModules));
    
    if (Object.keys(traitModules).length === 0) {
      console.log('No trait modules found via dynamic import');
      return [];
    }
    
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
          console.log(`✓ Dynamically loaded trait: ${parsed.uiName} (${parsed.category})`);
        }
      }
    });
    
    console.log(`Dynamically loaded ${traits.length} traits`);
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