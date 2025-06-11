export interface BasicTrait {
  id: string;
  name: string;
  path: string;
  category: TraitCategory;
}

// Legacy interface for compatibility
export interface Trait extends BasicTrait {
  imageSrc: string;
}

export type TraitCategory = 'head' | 'face' | 'body' | 'right_hand' | 'left_hand' | 'accessory';

export interface CategoryOption {
  id: TraitCategory;
  label: string;
}