import React from 'react';

interface CanvasAreaProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

const CanvasArea: React.FC<CanvasAreaProps> = ({
  canvasRef
}) => {
  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <canvas
        ref={canvasRef}
        className="border-2 border-gray-200 rounded-lg shadow-lg"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default CanvasArea;