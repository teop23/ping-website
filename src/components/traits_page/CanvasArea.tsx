import React from 'react';

interface CanvasAreaProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

const CanvasArea: React.FC<CanvasAreaProps> = ({
  canvasRef
}) => {
  return (
    <div className="flex justify-center items-center flex-1 overflow-hidden min-h-0 w-full h-full">
      <canvas
        ref={canvasRef}
        className="border-2 border-gray-200 rounded-lg shadow-sm max-w-full max-h-full"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default CanvasArea;