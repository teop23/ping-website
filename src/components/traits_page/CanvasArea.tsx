import React from 'react';

interface CanvasAreaProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  showBaseLayer: boolean;
  onToggleBaseLayer: () => void;
}

const CanvasArea: React.FC<CanvasAreaProps> = ({
  canvasRef
}) => {
  return (
    <div className="flex justify-center items-center flex-1 overflow-hidden min-h-0 aspect-square">
      <canvas
        ref={canvasRef}
        className="border-2 border-gray-200 rounded-lg shadow-sm w-full h-full max-w-full max-h-full object-contain"
      />
    </div>
  );
};

export default CanvasArea;