import React from 'react';

/**
 * The page ground.
 *
 * This used to be a canvas painting a white-to-slate gradient with four
 * rainbow blobs on a permanent requestAnimationFrame loop. It burned a frame
 * budget forever to produce an effect nobody could name, and it fought the
 * dark palette rather than supporting it.
 *
 * Now: two static washes in CSS. One warm lift under the fold where the hero
 * sits, one cold falloff at the edges so the near-black has depth instead of
 * reading flat. No JS, no animation frame, nothing to clean up.
 */
const Background: React.FC = () => (
  <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 bg-ground">
    {/* Lime lift behind the hero. Barely there; it warms rather than glows. */}
    <div
      className="absolute inset-x-0 top-0 h-[70vh]"
      style={{
        background:
          'radial-gradient(70% 55% at 50% 0%, oklch(var(--brand) / 0.10) 0%, transparent 70%)',
      }}
    />
    {/* Edge falloff. On a light ground a black vignette reads as grime, so this
        deepens the page's own tint instead. */}
    <div
      className="absolute inset-0"
      style={{
        background:
          'radial-gradient(120% 80% at 50% 40%, transparent 45%, oklch(88% 0.018 92.7 / 0.55) 100%)',
      }}
    />
  </div>
);

export default Background;
