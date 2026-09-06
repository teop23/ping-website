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
    {/* Warm lift behind the hero. Lime at 6% is a suggestion, not a glow. */}
    <div
      className="absolute inset-x-0 top-0 h-[70vh]"
      style={{
        background:
          'radial-gradient(70% 55% at 50% 0%, oklch(var(--brand) / 0.06) 0%, transparent 70%)',
      }}
    />
    {/* Edge falloff, so the field has a centre. */}
    <div
      className="absolute inset-0"
      style={{
        background:
          'radial-gradient(120% 80% at 50% 40%, transparent 40%, oklch(0% 0 0 / 0.45) 100%)',
      }}
    />
  </div>
);

export default Background;
