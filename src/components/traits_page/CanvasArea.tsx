import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

interface CanvasAreaProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  showBaseLayer: boolean;
  onToggleBaseLayer: () => void;
}

const CanvasArea: React.FC<CanvasAreaProps> = ({
  canvasRef,
  showBaseLayer,
  onToggleBaseLayer
}) => {
  return (
    <Card className="p-3 sm:p-6 h-auto lg:h-[700px]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base sm:text-lg font-semibold">Canvas</h3>
        <Button
          variant="outline"
          onClick={onToggleBaseLayer}
          size="sm"
        >
          {showBaseLayer ? <EyeOff size={14} className="sm:w-4 sm:h-4" /> : <Eye size={14} className="sm:w-4 sm:h-4" />}
          <span className="ml-1 sm:ml-2 text-xs sm:text-sm">{showBaseLayer ? 'Hide' : 'Show'} Base</span>
        </Button>
      </div>
      
      <div className="flex justify-center items-center overflow-hidden mb-4">
        <canvas
          ref={canvasRef}
          className="border-2 border-gray-200 rounded-lg shadow-sm max-w-full aspect-square object-contain mx-auto block"
        />
      </div>
    </Card>
  );
};

export default CanvasArea;