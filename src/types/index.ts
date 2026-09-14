export interface Trait {
  id: string;
  name: string;
  category: TraitCategory;
  imageSrc: string;
  /** Lighter copy for the picker grid. Falls back to imageSrc. */
  thumbSrc?: string;
  /** Square crop, as canvas fractions, that the picker tile zooms to. */
  thumb?: ThumbBox;
}

export interface ThumbBox {
  x: number;
  y: number;
  size: number;
}

export type TraitCategory = 'aura' | 'head' | 'face' | 'mouth' | 'body' | 'right_hand' | 'left_hand' | 'accessory';

export interface CategoryOption {
  id: TraitCategory;
  label: string;
}