import React, { useRef, useEffect } from 'react';

interface MagnifyingGlassProps {
  canvas: fabric.Canvas | null;
  mousePosition: { x: number; y: number };
  isActive: boolean;
  zoomLevel?: number;
  size?: number;
}

const MagnifyingGlass: React.FC<MagnifyingGlassProps> = ({
  canvas,
  mousePosition,
  isActive,
  zoomLevel = 3,
  size = 150
}) => {
  const magnifyCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvas || !magnifyCanvasRef.current || !isActive) return;

    const magnifyCanvas = magnifyCanvasRef.current;
    const magnifyCtx = magnifyCanvas.getContext('2d');
    if (!magnifyCtx) return;

    // Set canvas size
    magnifyCanvas.width = size;
    magnifyCanvas.height = size;

    // Clear the magnifying canvas
    magnifyCtx.clearRect(0, 0, size, size);

    // Get the main canvas element and context
    const mainCanvasElement = canvas.getElement();
    const mainCtx = mainCanvasElement.getContext('2d');
    if (!mainCtx) return;

    // Calculate the area to magnify
    const sourceSize = size / zoomLevel;
    const sourceX = mousePosition.x - sourceSize / 2;
    const sourceY = mousePosition.y - sourceSize / 2;

    // Draw the magnified area
    try {
      magnifyCtx.imageSmoothingEnabled = false; // For crisp pixel art style
      magnifyCtx.drawImage(
        mainCanvasElement,
        sourceX,
        sourceY,
        sourceSize,
        sourceSize,
        0,
        0,
        size,
        size
      );

      // Draw crosshairs in the center
      magnifyCtx.strokeStyle = '#ff0000';
      magnifyCtx.lineWidth = 1;
      magnifyCtx.setLineDash([2, 2]);
      
      // Vertical line
      magnifyCtx.beginPath();
      magnifyCtx.moveTo(size / 2, 0);
      magnifyCtx.lineTo(size / 2, size);
      magnifyCtx.stroke();
      
      // Horizontal line
      magnifyCtx.beginPath();
      magnifyCtx.moveTo(0, size / 2);
      magnifyCtx.lineTo(size, size / 2);
      magnifyCtx.stroke();

      magnifyCtx.setLineDash([]); // Reset line dash
    } catch (error) {
      console.warn('Error drawing magnified view:', error);
    }
  }, [canvas, mousePosition, isActive, zoomLevel, size]);

  if (!isActive) return null;

  return (
    <div
      className="fixed pointer-events-none z-50 border-4 border-gray-800 rounded-full shadow-2xl bg-white"
      style={{
        left: mousePosition.x + 20,
        top: mousePosition.y - size / 2,
        width: size,
        height: size,
      }}
    >
      <canvas
        ref={magnifyCanvasRef}
        className="rounded-full w-full h-full"
        style={{ width: size, height: size }}
      />
      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
        {zoomLevel}x
      </div>
    </div>
  );
};

export default MagnifyingGlass;