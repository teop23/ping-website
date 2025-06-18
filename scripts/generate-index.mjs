import { readdir, writeFile } from 'fs/promises';
import path from 'path';

const defaultCategories = [
  { id: 'aura', label: 'Aura' },
  { id: 'head', label: 'Head' },
  { id: 'face', label: 'Face' },
  { id: 'mouth', label: 'Mouth' },
  { id: 'body', label: 'Body' },
  { id: 'right_hand', label: 'Right Hand' },
  { id: 'left_hand', label: 'Left Hand' },
  { id: 'accessory', label: 'Accessory' }
];

const traitsDir = path.resolve('public/traits');
const outputFile = path.resolve('public/traits-index.json');

const categoryIds = defaultCategories.map(cat => cat.id).join('|');
const traitRegex = new RegExp(`^trait-(.+)_(${categoryIds})$`);

const files = await readdir(traitsDir);
const index = {};

for (const file of files) {
  const fileWithoutExt = file.replace(/\.png$/i, '');
  const match = fileWithoutExt.match(traitRegex);
  if (!match) continue;

  const [_, name, category] = match;
  if (!index[category]) index[category] = [];
  index[category].push(name);
}

await writeFile(outputFile, JSON.stringify(index, null, 2));
const traitCount = Object.values(index).reduce((sum, arr) => sum + arr.length, 0);
console.log(`✅ Generated traits-index.json with ${traitCount} traits across ${Object.keys(index).length} categories.`);
