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
        className="border-2 border-gray-200 rounded-lg shadow-sm w-[400px] h-[400px] md:w-[600px] md:h-[600px] lg:w-[700px] lg:h-[700px]"
      />
    </div>
  );
};

export default CanvasArea;