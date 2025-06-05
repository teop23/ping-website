export interface Trait {
  id: string;
  name: string;
  category: TraitCategory;
  imageSrc: string;
}

export type TraitCategory = 'head' | 'face' | 'body' | 'accessory';

export interface CategoryOption {
  id: TraitCategory;
  label: string;
}