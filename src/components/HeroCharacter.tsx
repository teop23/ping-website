import { useReducedMotion } from 'framer-motion';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { baseCharacterImage } from '../data/traits';
import { BASE_IMAGE_SCALE_MULTIPLIER } from '../utils/canvasConstants';
import { TRAIT_RENDER_ORDER } from '../data/traitOrder';
import { TraitCategory } from '../types';

/**
 * The hero's proof: real characters, composited live from the same trait PNGs
 * the image API layers, cycling through a few combinations.
 *
 * Deliberately not a pre-rendered GIF. A GIF goes stale the moment a trait is
 * added, weighs far more than these PNGs, and proves nothing about whether the
 * generator works. This is the generator, running.
 */

type Combo = Partial<Record<TraitCategory, string>>;

/** Every entry verified against public/traits at build time. */
const COMBOS: Combo[] = [
  { head: 'cowboy-hat', face: 'cool-glasses', body: 'ping-tee', right_hand: 'bitcoin' },
  { head: 'crown', aura: 'fire-aura', body: '6-figs-club-tee', left_hand: 'beer' },
  { head: 'backwards-cap', face: 'pit-vipers', body: 'blank-tee', right_hand: 'basketball' },
  { head: 'luffy-strawhat', face: 'star-eyes', body: 'luffy-shirt', right_hand: 'coffee-mug' },
  { head: 'party-hat', face: 'heart-glasses', body: 'dress', accessory: 'pet-ping-(right)' },
  { aura: 'blue-aura', head: 'devil-horns', face: 'angry', right_hand: 'devil-trident' },
];

const HOLD_MS = 1900;
/**
 * How long the outgoing character takes to fade away.
 *
 * Also drives the CSS animation inline, because this same value times the
 * unmount: if the stylesheet and this constant drift apart the layer is removed
 * mid-fade and the dissolve ends in a snap.
 */
const DISSOLVE_MS = 600;

const layersFor = (combo: Combo): string[] =>
  TRAIT_RENDER_ORDER.filter((category) => combo[category]).map(
    (category) => `/traits/trait-${combo[category]}_${category}.png`
  );

const describe = (combo: Combo): string => {
  const names = TRAIT_RENDER_ORDER.filter((c) => combo[c]).map((c) =>
    (combo[c] as string).replace(/-/g, ' ')
  );
  return `PING character wearing ${names.join(', ')}`;
};

// Hoisted: declared inside HeroCharacter this would be a new component type on
// every render, so React would unmount and remount every <img> and the layers
// would blink instead of dissolving.
const Character: React.FC<{ combo: Combo }> = ({ combo }) => (
  <>
    <img
      src={baseCharacterImage}
      alt=""
      className="absolute inset-0 size-full object-contain"
      style={{ transform: `scale(${BASE_IMAGE_SCALE_MULTIPLIER})` }}
    />
    {layersFor(combo).map((src) => (
      <img key={src} src={src} alt="" className="absolute inset-0 size-full object-contain" />
    ))}
  </>
);

const HeroCharacter: React.FC = () => {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [outgoing, setOutgoing] = useState<number | null>(null);
  const previousIndex = useRef(0);
  const [ready, setReady] = useState(false);

  const allLayers = useMemo(() => COMBOS.flatMap(layersFor), []);

  // Preload every layer before the first swap, so a cycle never shows a
  // half-composited character.
  useEffect(() => {
    let cancelled = false;
    let remaining = allLayers.length + 1;

    const done = () => {
      remaining -= 1;
      if (remaining <= 0 && !cancelled) setReady(true);
    };

    [baseCharacterImage, ...allLayers].forEach((src) => {
      const img = new Image();
      img.onload = done;
      img.onerror = done;
      img.src = src;
    });

    return () => {
      cancelled = true;
    };
  }, [allLayers]);

  // Reduced motion gets one character, held. Not a dropped feature, just still.
  useEffect(() => {
    if (reduceMotion || !ready) return;

    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % COMBOS.length);
    }, HOLD_MS);

    return () => clearInterval(timer);
  }, [reduceMotion, ready]);

  // Whatever was showing before this index becomes the layer that dissolves.
  // Derived from a ref rather than set inside the setIndex updater: updaters
  // must stay pure, and StrictMode invokes them twice.
  useEffect(() => {
    if (previousIndex.current !== index) {
      setOutgoing(previousIndex.current);
      previousIndex.current = index;
    }
  }, [index]);

  useEffect(() => {
    if (outgoing === null) return;
    const timer = setTimeout(() => setOutgoing(null), DISSOLVE_MS);
    return () => clearTimeout(timer);
  }, [outgoing]);

  return (
    <div
      className="relative mx-auto aspect-square w-full max-w-[15rem] sm:max-w-[18rem] lg:max-w-[30rem]"
      role="img"
      aria-label={describe(COMBOS[index])}
    >
      {/*
        The incoming character sits underneath at full opacity while the
        outgoing one dissolves over it. Nothing is ever mid-fade on its own, so
        a throttled tab shows the previous character rather than a blank box.
      */}
      <div className="absolute inset-0">
        <Character combo={COMBOS[index]} />
      </div>

      {outgoing !== null && outgoing !== index && (
        <div
          key={outgoing}
          className="absolute inset-0 motion-safe:animate-dissolve-out"
          style={{ animationDuration: `${DISSOLVE_MS}ms` }}
        >
          <Character combo={COMBOS[outgoing]} />
        </div>
      )}
    </div>
  );
};

export default HeroCharacter;
