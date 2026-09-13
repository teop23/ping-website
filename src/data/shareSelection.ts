import { Trait } from '../types';

/**
 * A share link (/p/<id>) redirects a person to /?head=crown&aura=blue-aura.
 * This turns that query back into the selection, so the character they
 * clicked on is the one they land on. Unknown categories or traits are
 * ignored rather than failing the whole load.
 */
export const traitsFromSearch = (search: string, traits: Trait[]): Trait[] => {
  const byId = new Map(traits.map((trait) => [trait.id, trait]));
  const picked: Trait[] = [];
  for (const [category, name] of new URLSearchParams(search)) {
    const trait = byId.get(`${name}_${category}`);
    if (trait && !picked.some((p) => p.category === trait.category)) picked.push(trait);
  }
  return picked;
};
