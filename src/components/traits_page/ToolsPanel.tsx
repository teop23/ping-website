import React from 'react';
import { HexColorPicker } from 'react-colorful';
import { Upload, Trash2, Undo, RotateCw, MousePointer, Palette, Type, Square, Circle, Minus, Spline, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import ToolButton from '../ToolButton';
import { ToolType, ToolsPanelProps } from '../../types/traits';

const ToolsPanel: React.FC<ToolsPanelProps> = ({
  tool,
  setTool,
  color,
  setColor,
  showColorPicker,
  setShowColorPicker,
  brushSize,
  setBrushSize,
  textSize,
  setTextSize,
  textColor,
  setTextColor,
  showTextColorPicker,
  setShowTextColorPicker,
  curvePoints,
  undoRedoManager,
  showBaseLayer,
  onToggleBaseLayer,
  onUploadImage,
  onDeleteSelected,
  onUndo,
  onRedo,
  onClearCanvas
}) => {
  const tools = [
    { type: 'select' as ToolType, icon: 'MousePointer', label: 'Select' },
    { type: 'brush' as ToolType, icon: 'Palette', label: 'Brush' },
    { type: 'text' as ToolType, icon: 'Type', label: 'Text' },
    { type: 'rectangle' as ToolType, icon: 'Square', label: 'Rectangle' },
    { type: 'circle' as ToolType, icon: 'Circle', label: 'Circle' },
    { type: 'line' as ToolType, icon: 'Minus', label: 'Line' },
    { type: 'curve' as ToolType, icon: 'Spline', label: 'Curve' },
  ];

  const getIconComponent = (iconName: string, size: number = 14) => {
    const iconProps = { size, className: "sm:w-[18px] sm:h-[18px]" };
   
    const icons: { [key: string]: React.ElementType } = {
      MousePointer,
      Palette,
      Type,
      Square,
      Circle,
      Minus,
      Spline,
    };

    return icons[iconName] ? React.createElement(icons[iconName], iconProps) : null;
  };

  return (
    <Card className="h-full overflow-hidden flex flex-col">
      <CardHeader>
        <h3 className="text-base sm:text-lg font-semibold">Tools</h3>
      </CardHeader>
      <CardContent className="space-y-2 sm:space-y-3 flex-1 overflow-y-auto">
        {/* Tool Selection */}
        <div className="grid grid-cols-2 gap-1 sm:gap-2">
          {tools.map((toolItem) => (
            <ToolButton
              key={toolItem.type}
              icon={getIconComponent(toolItem.icon)}
              label={toolItem.label}
              active={tool === toolItem.type}
              onClick={() => setTool(toolItem.type)}
            />
          ))}
        </div>

        {/* Color Picker */}
        <div className="space-y-1">
          <label className="text-xs sm:text-sm font-medium">Color</label>
          <div className="relative">
            <button
              className="w-full h-6 sm:h-8 rounded-md border-2 border-gray-200"
              style={{ backgroundColor: color }}
              onClick={() => setShowColorPicker(!showColorPicker)}
            />
            {showColorPicker && (
              <div className="absolute z-10 mt-2">
                <div className="p-3 bg-white rounded-lg shadow-lg border">
                  <HexColorPicker color={color} onChange={setColor} />
                  <button
                    className="mt-2 w-full px-3 py-1 text-sm bg-gray-100 rounded"
                    onClick={() => setShowColorPicker(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Brush Size */}
        {(tool === 'brush' || tool === 'line' || tool === 'curve') && (
          <div className="space-y-1">
            <label className="text-xs sm:text-sm font-medium">Brush Size: {brushSize}px</label>
            <input
              type="range"
              min="1"
              max="50"
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="w-full"
            />
          </div>
        )}

        {/* Text Controls */}
        {tool === 'text' && (
          <div className="space-y-2">
            <div className="text-xs text-blue-700 bg-blue-50 p-2 rounded border border-blue-200">
              💡 Click anywhere on canvas to add text
            </div>
            <div className="space-y-1">
              <label className="text-xs sm:text-sm font-medium">Text Size: {textSize}px</label>
              <input
                type="range"
                min="12"
                max="96"
                value={textSize}
                onChange={(e) => setTextSize(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs sm:text-sm font-medium">Text Color</label>
              <div className="relative">
                <button
                  className="w-full h-6 sm:h-8 rounded border-2 border-gray-200"
                  style={{ backgroundColor: textColor }}
                  onClick={() => setShowTextColorPicker(!showTextColorPicker)}
                />
                {showTextColorPicker && (
                  <div className="absolute z-10 mt-2">
                    <div className="p-3 bg-white rounded-lg shadow-lg border">
                      <HexColorPicker color={textColor} onChange={setTextColor} />
                      <button
                        className="mt-2 w-full px-3 py-1 text-sm bg-gray-100 rounded"
                        onClick={() => setShowTextColorPicker(false)}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs sm:text-sm font-medium">Font Weight</label>
              <select
                value={(canvas?.getActiveObject() as any)?.fontWeight || 'normal'}
                onChange={(e) => {
                  const activeObject = canvas?.getActiveObject();
                  if (activeObject && activeObject.type === 'i-text') {
                    (activeObject as any).set({ fontWeight: e.target.value });
                    if(canvas) {
                      canvas.renderAll();
                    }
                  }
                }}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
              >
                <option value="normal">Normal</option>
                <option value="bold">Bold</option>
                <option value="600">Semi Bold</option>
                <option value="300">Light</option>
              </select>
            </div>
          </div>
        )}

        {/* Curve Tool Instructions */}
        {tool === 'curve' && (
          <div className="space-y-2">
            <div className="text-xs text-blue-700 bg-blue-50 p-2 rounded border border-blue-200">
              💡 Click 3 points to create a curved line with movable anchors:
              <br />
              1. Start point (blue anchor)
              <br />
              2. Control point (orange anchor - curve direction)
              <br />
              3. End point (red anchor)
              <br />
              <span className="text-xs text-gray-600">
                After creation, you can drag any anchor point to reshape the curve in real-time!
              </span>
            </div>
            {curvePoints.length > 0 && (
              <div className="text-xs text-green-700 bg-green-50 p-2 rounded border border-green-200">
                Points clicked: {curvePoints.length}/3
                {curvePoints.length < 3 && (
                  <span className="block mt-1">
                    Click {curvePoints.length === 1 ? 'control anchor' : 'end anchor'}
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-1 pt-2 border-t">
          <Button 
            onClick={onToggleBaseLayer} 
            variant="outline" 
            size="sm" 
            className="w-full"
          >
            {showBaseLayer ? <EyeOff size={12} className="mr-1 sm:mr-2 sm:w-4 sm:h-4" /> : <Eye size={12} className="mr-1 sm:mr-2 sm:w-4 sm:h-4" />}
            {showBaseLayer ? 'Hide' : 'Show'} Base
          </Button>
          <Button onClick={onUploadImage} variant="outline" size="sm" className="w-full">
            <Upload size={12} className="mr-1 sm:mr-2 sm:w-4 sm:h-4" />
            Upload Image
          </Button>
          <div className="grid grid-cols-2 gap-1">
            <Button onClick={onDeleteSelected} variant="outline" size="sm">
              <Trash2 size={12} className="mr-1 sm:mr-2 sm:w-4 sm:h-4" />
              Delete
            </Button>
            <Button 
              onClick={onUndo} 
              variant="outline" 
              size="sm"
              disabled={!undoRedoManager?.canUndo()}
            >
              <Undo size={12} className="mr-1 sm:mr-2 sm:w-4 sm:h-4" />
              Undo
            </Button>
          </div>
          <Button 
            onClick={onRedo} 
            variant="outline" 
            size="sm" 
            className="w-full"
            disabled={!undoRedoManager?.canRedo()}
          >
            <RotateCw size={12} className="mr-1 sm:mr-2 sm:w-4 sm:h-4" />
            Redo
          </Button>
          <Button onClick={onClearCanvas} variant="outline" size="sm" className="w-full">
            <RotateCw size={12} className="mr-1 sm:mr-2 sm:w-4 sm:h-4" />
            Clear All
          </Button>
          
          {/* Paste hint */}
          <div className="text-xs text-blue-700 bg-blue-50 p-2 rounded border border-blue-200 mt-2">
            💡 Tip: You can paste images directly from your clipboard using Ctrl+V (Cmd+V on Mac)
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ToolsPanel;