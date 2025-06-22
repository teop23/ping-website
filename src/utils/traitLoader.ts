import { defaultCategories } from '../data/traits';

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
  const nameWithoutExt = filename.replace(/\.png$/i, '');

  // Build regex pattern dynamically from defaultCategories
  const categoryIds = defaultCategories.map(cat => cat.id).join('|');
  const regex = new RegExp(`^trait-(.+)_(${categoryIds})$`);
  // Check if it follows the pattern: trait-{name}_{category}
  const match = nameWithoutExt.match(regex);

  if (match) {
    const [, name, category] = match;
    const uiName = name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()); // Convert kebab-case to Title Case
    console.log(`Parsed trait: ${name} (UI: ${uiName}, Category: ${category})`);
    return {
      name: name, // Keep original kebab-case for ID matching
      uiName: uiName, // Human-readable name for UI
      category: category // Keep exact category match from defaultCategories
    };
  }

  return null;
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
  try {
    const res = await fetch('/traits-index.json');
    const data = await res.json();
    //log each category and number of traits like this: category1: 5, category2: 3
    console.log('📂 Categories found:', Object.keys(data).map(cat => `${cat}: ${data[cat].length}`).join(', '));
    const traits: TraitFile[] = [];

    for (const category in data) {
      for (const name of data[category]) {
        const uiName = name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        traits.push({
          id: `${name}_${category}`,
          name,
          uiName,
          category,
          imageSrc: `/traits/trait-${name}_${category}.png`
        });
      }
    }
    return traits;
  } catch (error) {
    console.error('Error in dynamic trait loading:', error);
    return [];
  }
};