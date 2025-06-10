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
        className="border-2 border-gray-200 rounded-lg shadow-sm w-[300px] h-[300px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px]"
      />
    </div>
  );
};

export default CanvasArea;