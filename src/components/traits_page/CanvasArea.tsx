import React from 'react';

interface CanvasAreaProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  containerRef: React.RefObject<HTMLDivElement>;
}

/**
 * Fabric writes inline width/height styles onto the canvas element and wraps it
 * in its own .canvas-container. Tailwind sizing utilities here fight that: an
 * earlier `max-w-full max-h-full aspect-square` clamped the width to the column
 * while the inline height stayed at 1000px, so the canvas rendered squashed and
 * pointer coordinates no longer matched what was on screen.
 *
 * Sizing now lives in CreateTraits, which scales the CSS box only and leaves the
 * 1000x1000 drawing buffer alone.
 */
const CanvasArea: React.FC<CanvasAreaProps> = ({ canvasRef, containerRef }) => (
  <div
    ref={containerRef}
    className="flex min-h-0 w-full flex-1 items-center justify-center overflow-hidden p-4 lg:p-8"
  >
    <canvas ref={canvasRef} className="rounded-lg border border-hairline shadow-panel" />
  </div>
);

export default CanvasArea;
