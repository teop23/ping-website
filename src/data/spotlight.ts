import { TraitCategory } from '../types';

export type Combo = Partial<Record<TraitCategory, string>>;

/**
 * The homepage hero's rotation: each character spotlights one recent trait,
 * named under the art, so a new drop shows up on the marketing page instead of
 * only inside the builder. Edit this list when a batch ships.
 *
 * `spotlight.test.ts` fails the build if any trait here is not in
 * public/traits, which is what happens when a trait is parked or cut.
 */
export type Spotlight = {
  combo: Combo;
  /** The slot whose trait is named as the new one. Must be set in `combo`. */
  featured: TraitCategory;
};

export const SPOTLIGHT: Spotlight[] = [
  {
    combo: {
      aura: 'meteor-shower',
      head: 'cowboy-hat',
      face: 'cool-glasses',
      body: 'ping-tee',
      right_hand: 'bitcoin',
    },
    featured: 'aura',
  },
  {
    combo: {
      head: 'headphones',
      body: 'puffer-jacket',
      right_hand: 'microphone',
    },
    featured: 'head',
  },
  {
    combo: {
      aura: 'casino-jackpot',
      head: 'crown',
      body: 'gold-chain',
      left_hand: 'money-bag',
    },
    featured: 'aura',
  },
  {
    combo: { mouth: 'fish-in-beak', head: 'ushanka', body: 'knit-sweater' },
    featured: 'mouth',
  },
  {
    combo: {
      aura: 'rave-lasers',
      face: 'vr-headset',
      head: 'backwards-cap',
      body: 'tracksuit',
    },
    featured: 'face',
  },
  {
    combo: {
      aura: 'black-hole',
      head: 'devil-horns',
      face: 'angry',
      right_hand: 'devil-trident',
    },
    featured: 'aura',
  },
];

const CATEGORY_LABEL: Record<TraitCategory, string> = {
  aura: 'aura',
  head: 'head',
  face: 'face',
  mouth: 'mouth',
  body: 'body',
  right_hand: 'right hand',
  left_hand: 'left hand',
  accessory: 'accessory',
};

/** "Meteor Shower" and "aura" for the caption under the hero art. */
export const spotlightLabel = ({ combo, featured }: Spotlight): { name: string; slot: string } => ({
  name: (combo[featured] ?? '').replace(/-/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase()),
  slot: CATEGORY_LABEL[featured],
});
