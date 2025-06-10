import React from 'react';

interface CanvasAreaProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

const CanvasArea: React.FC<CanvasAreaProps> = ({
  canvasRef
}) => {
  return (
    <div className="flex justify-center items-center flex-1 overflow-hidden min-h-0 w-full h-full p-4 lg:p-8">
      <canvas
        ref={canvasRef}
        className="border-2 border-gray-200 rounded-lg shadow-lg max-w-full max-h-full aspect-square"
      />
    </div>
  );
};

export default CanvasArea;