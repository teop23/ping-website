import { CategoryOption, TraitCategory } from '../types';

/**
 * Reads the trait manifest produced by scripts/generate-index.mjs.
 *
 * This used to re-derive the trait system from filenames at runtime: a regex
 * built from a hardcoded category list, plus its own kebab-to-title transform.
 * That list and the paint order were duplicated across ten files, so adding a
 * category meant finding all ten. The manifest is now the single source, and
 * the build refuses to emit one from malformed assets.
 */

export interface TraitFile {
  id: string;
  name: string;
  /** Human-readable, e.g. "Cowboy Hat". */
  uiName: string;
  category: string;
  imageSrc: string;
  width: number;
  height: number;
}

interface ManifestTrait {
  id: string;
  name: string;
  label: string;
  category: string;
  file: string;
  width: number;
  height: number;
  bytes: number;
}

interface TraitManifest {
  version: number;
  generatedAt: string;
  /** Back to front. Not the same as the UI ordering of categories. */
  renderOrder: string[];
  categories: { id: string; label: string; count: number }[];
  traits: ManifestTrait[];
}

const KNOWN_CATEGORIES: TraitCategory[] = [
  'aura',
  'head',
  'face',
  'mouth',
  'body',
  'right_hand',
  'left_hand',
  'accessory',
];

const isKnownCategory = (value: string): value is TraitCategory =>
  (KNOWN_CATEGORIES as string[]).includes(value);

const MANIFEST_URL = '/traits-manifest.json';

let cached: TraitManifest | null = null;

export const loadManifest = async (): Promise<TraitManifest | null> => {
  if (cached) return cached;

  try {
    const response = await fetch(MANIFEST_URL);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const manifest: TraitManifest = await response.json();
    if (!Array.isArray(manifest.traits) || !Array.isArray(manifest.renderOrder)) {
      throw new Error('manifest is missing traits or renderOrder');
    }

    cached = manifest;
    return manifest;
  } catch (error) {
    console.error('Failed to load trait manifest:', error);
    return null;
  }
};

const toTraitFile = (trait: ManifestTrait): TraitFile => ({
  id: trait.id,
  name: trait.name,
  uiName: trait.label,
  category: trait.category,
  imageSrc: trait.file,
  width: trait.width,
  height: trait.height,
});

export const loadTraitsFromManifest = async (): Promise<{
  traits: TraitFile[];
  categories: CategoryOption[];
  renderOrder: string[];
}> => {
  const manifest = await loadManifest();

  if (!manifest) {
    return { traits: [], categories: [], renderOrder: [] };
  }

  const unknown = manifest.categories.filter((c) => !isKnownCategory(c.id)).map((c) => c.id);
  if (unknown.length > 0) {
    console.warn(`Trait manifest lists unknown categories, ignoring: ${unknown.join(', ')}`);
  }

  return {
    traits: manifest.traits.filter((t) => isKnownCategory(t.category)).map(toTraitFile),
    categories: manifest.categories
      .filter((c): c is { id: TraitCategory; label: string; count: number } => isKnownCategory(c.id))
      .map(({ id, label }) => ({ id, label })),
    renderOrder: manifest.renderOrder,
  };
};

/** Paint order, for anything compositing layers. Empty until the manifest loads. */
export const getRenderOrder = (): string[] => cached?.renderOrder ?? [];
