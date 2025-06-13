export interface Trait {
  id: string;
  name: string;
  category: TraitCategory;
  imageSrc: string;
}

export type TraitCategory = 'aura' | 'head' | 'face' | 'mouth' | 'body' | 'right_hand' | 'left_hand' | 'accessory';

export interface CategoryOption {
  id: TraitCategory;
  label: string;
}