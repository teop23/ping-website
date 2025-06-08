import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '../components/ui/card';
import { HexColorPicker } from 'react-colorful';
import { 
  Download, 
  Eye, 
  EyeOff, 
  Undo, 
  Redo, 
  Save, 
  Image, 
  X, 
  Type, 
  Circle,
  Square,
  Triangle,
  Minus,
  Upload,
  Trash2,
  RotateCw,
  Copy,
  Layers
} from 'lucide-react';
import { fabric } from 'fabric';
import pingImage from '../assets/images/ping.png'; 
import { ScrollArea } from '../components/ui/scroll-area';

interface SavedTrait {
  name: string;
  data: string;
  timestamp: number;
}

const CreateTraits: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [baseImage, setBaseImage] = useState<fabric.Image | null>(null);
  const [color, setColor] = useState("#000000");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [brushSize, setBrushSize] = useState(5);
  const [showBaseLayer, setShowBaseLayer] = useState(true);
  const [tool, setTool] = useState<'select' | 'brush' | 'text' | 'rectangle' | 'circle' | 'triangle' | 'line'>('select');
  const [traitName, setTraitName] = useState('');
  const [savedTraits, setSavedTraits] = useState<SavedTrait[]>([]);
  const [selectedTraits, setSelectedTraits] = useState<SavedTrait[]>([]);
  
  // Text properties
  const [textSize, setTextSize] = useState(24);
  const [textColor, setTextColor] = useState('#000000');
  const [showTextColorPicker, setShowTextColorPicker] = useState(false);
  const [textFont, setTextFont] = useState('Arial');

  // Load saved traits on mount
  useEffect(() => {
    const savedTraits = localStorage.getItem('savedTraits');
    if (savedTraits) {
      setSavedTraits(JSON.parse(savedTraits));
    }
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize Fabric.js canvas
    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width: 800,
      height: 800,
      backgroundColor: 'transparent',
      selection: tool === 'select',
      isDrawingMode: tool === 'brush'
    });

    // Configure drawing brush
    fabricCanvas.freeDrawingBrush.width = brushSize;
    fabricCanvas.freeDrawingBrush.color = color;

    // Load base image
    fabric.Image.fromURL(pingImage, (img) => {
      const scale = Math.min(
        fabricCanvas.width! / img.width!,
        fabricCanvas.height! / img.height!
      ) * 0.8;
      
      img.set({
        left: fabricCanvas.width! / 2,
        top: fabricCanvas.height! / 2,
        originX: 'center',
        originY: 'center',
        scaleX: scale,
        scaleY: scale,
        selectable: false,
        evented: false,
        excludeFromExport: false
      });
      
      setBaseImage(img);
      fabricCanvas.add(img);
      fabricCanvas.sendToBack(img);
      fabricCanvas.renderAll();
    });

    // Handle canvas events
    fabricCanvas.on('mouse:down', handleCanvasMouseDown);
    fabricCanvas.on('selection:created', handleSelection);
    fabricCanvas.on('selection:updated', handleSelection);
    fabricCanvas.on('selection:cleared', handleSelectionCleared);

    setCanvas(fabricCanvas);

    return () => {
      fabricCanvas.dispose();
    };
  }, []);

  // Update canvas properties when tool changes
  useEffect(() => {
    if (!canvas) return;

    canvas.selection = tool === 'select';
    canvas.isDrawingMode = tool === 'brush';
    
    if (tool === 'brush') {
      canvas.freeDrawingBrush.width = brushSize;
      canvas.freeDrawingBrush.color = color;
    }

    canvas.defaultCursor = tool === 'select' ? 'default' : 'crosshair';
    canvas.renderAll();
  }, [tool, canvas, brushSize, color]);

  // Update base image visibility
  useEffect(() => {
    if (!baseImage) return;
    baseImage.set({ opacity: showBaseLayer ? 1 : 0.3 });
    canvas?.renderAll();
  }, [showBaseLayer, baseImage, canvas]);

  const handleCanvasMouseDown = (e: fabric.IEvent) => {
    if (!canvas || tool === 'select' || tool === 'brush') return;

    const pointer = canvas.getPointer(e.e);
    
    switch (tool) {
      case 'text':
        addText(pointer.x, pointer.y);
        break;
      case 'rectangle':
        addRectangle(pointer.x, pointer.y);
        break;
      case 'circle':
        addCircle(pointer.x, pointer.y);
        break;
      case 'triangle':
        addTriangle(pointer.x, pointer.y);
        break;
      case 'line':
        addLine(pointer.x, pointer.y);
        break;
    }
  };

  const addText = (x: number, y: number) => {
    const text = new fabric.IText('Click to edit', {
      left: x,
      top: y,
      fontSize: textSize,
      fill: textColor,
      fontFamily: textFont,
      editable: true
    });
    
    canvas?.add(text);
    canvas?.setActiveObject(text);
    canvas?.renderAll();
  };

  const addRectangle = (x: number, y: number) => {
    const rect = new fabric.Rect({
      left: x - 50,
      top: y - 25,
      width: 100,
      height: 50,
      fill: color,
      stroke: color,
      strokeWidth: 2
    });
    
    canvas?.add(rect);
    canvas?.setActiveObject(rect);
    canvas?.renderAll();
  };

  const addCircle = (x: number, y: number) => {
    const circle = new fabric.Circle({
      left: x - 25,
      top: y - 25,
      radius: 25,
      fill: color,
      stroke: color,
      strokeWidth: 2
    });
    
    canvas?.add(circle);
    canvas?.setActiveObject(circle);
    canvas?.renderAll();
  };

  const addTriangle = (x: number, y: number) => {
    const triangle = new fabric.Triangle({
      left: x - 25,
      top: y - 25,
      width: 50,
      height: 50,
      fill: color,
      stroke: color,
      strokeWidth: 2
    });
    
    canvas?.add(triangle);
    canvas?.setActiveObject(triangle);
    canvas?.renderAll();
  };

  const addLine = (x: number, y: number) => {
    const line = new fabric.Line([x, y, x + 100, y], {
      stroke: color,
      strokeWidth: brushSize,
      selectable: true
    });
    
    canvas?.add(line);
    canvas?.setActiveObject(line);
    canvas?.renderAll();
  };

  const handleSelection = () => {
    // Handle object selection
  };

  const handleSelectionCleared = () => {
    // Handle selection cleared
  };

  const deleteSelected = () => {
    const activeObjects = canvas?.getActiveObjects();
    if (activeObjects && activeObjects.length > 0) {
      activeObjects.forEach(obj => {
        if (obj !== baseImage) {
          canvas?.remove(obj);
        }
      });
      canvas?.discardActiveObject();
      canvas?.renderAll();
    }
  };

  const duplicateSelected = () => {
    const activeObject = canvas?.getActiveObject();
    if (activeObject && activeObject !== baseImage) {
      activeObject.clone((cloned: fabric.Object) => {
        cloned.set({
          left: cloned.left! + 10,
          top: cloned.top! + 10,
        });
        canvas?.add(cloned);
        canvas?.setActiveObject(cloned);
        canvas?.renderAll();
      });
    }
  };

  const bringToFront = () => {
    const activeObject = canvas?.getActiveObject();
    if (activeObject && activeObject !== baseImage) {
      canvas?.bringToFront(activeObject);
      canvas?.renderAll();
    }
  };

  const sendToBack = () => {
    const activeObject = canvas?.getActiveObject();
    if (activeObject && activeObject !== baseImage) {
      canvas?.sendToBack(activeObject);
      if (baseImage) {
        canvas?.sendToBack(baseImage);
      }
      canvas?.renderAll();
    }
  };

  const undo = () => {
    // Fabric.js doesn't have built-in undo/redo, but we can implement it
    // For now, we'll use a simple approach
    const objects = canvas?.getObjects();
    if (objects && objects.length > 1) {
      const lastObject = objects[objects.length - 1];
      if (lastObject !== baseImage) {
        canvas?.remove(lastObject);
        canvas?.renderAll();
      }
    }
  };

  const clearCanvas = () => {
    canvas?.clear();
    if (baseImage) {
      canvas?.add(baseImage);
      canvas?.sendToBack(baseImage);
    }
    canvas?.renderAll();
  };

  const uploadImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imgSrc = e.target?.result as string;
          fabric.Image.fromURL(imgSrc, (img) => {
            img.set({
              left: canvas!.width! / 2,
              top: canvas!.height! / 2,
              originX: 'center',
              originY: 'center',
              scaleX: 0.5,
              scaleY: 0.5
            });
            canvas?.add(img);
            canvas?.setActiveObject(img);
            canvas?.renderAll();
          });
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const downloadImage = () => {
    if (!canvas) return;

    // Temporarily hide base image if needed
    const originalOpacity = baseImage?.opacity;
    if (baseImage && !showBaseLayer) {
      baseImage.set({ opacity: 0 });
      canvas.renderAll();
    }

    const dataURL = canvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 1
    });

    // Restore base image opacity
    if (baseImage && originalOpacity !== undefined) {
      baseImage.set({ opacity: originalOpacity });
      canvas.renderAll();
    }

    const link = document.createElement('a');
    link.download = 'ping-trait.png';
    link.href = dataURL;
    link.click();
  };

  const saveTrait = () => {
    if (!canvas || !traitName) return;

    // Temporarily hide base image for saving
    const originalOpacity = baseImage?.opacity;
    if (baseImage) {
      baseImage.set({ opacity: 0 });
      canvas.renderAll();
    }

    const dataURL = canvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 1
    });

    // Restore base image
    if (baseImage && originalOpacity !== undefined) {
      baseImage.set({ opacity: originalOpacity });
      canvas.renderAll();
    }

    const newTrait = {
      name: traitName,
      data: dataURL,
      timestamp: Date.now()
    };
    
    const updatedTraits = [...savedTraits, newTrait];
    setSavedTraits(updatedTraits);
    localStorage.setItem('savedTraits', JSON.stringify(updatedTraits));
    setTraitName('');
    
    // Clear canvas except base image
    clearCanvas();
  };

  const loadTrait = (trait: SavedTrait) => {
    setSelectedTraits(prev => {
      const isSelected = prev.some(t => t.timestamp === trait.timestamp);
      if (isSelected) {
        return prev.filter(t => t.timestamp !== trait.timestamp);
      } else {
        // Load trait as image on canvas
        fabric.Image.fromURL(trait.data, (img) => {
          img.set({
            left: canvas!.width! / 2,
            top: canvas!.height! / 2,
            originX: 'center',
            originY: 'center'
          });
          canvas?.add(img);
          canvas?.renderAll();
        });
        return [...prev, trait];
      }
    });
  };

  const deleteTrait = (timestamp: number) => {
    const updatedTraits = savedTraits.filter(trait => trait.timestamp !== timestamp);
    setSavedTraits(updatedTraits);
    localStorage.setItem('savedTraits', JSON.stringify(updatedTraits));
    setSelectedTraits(prev => prev.filter(t => t.timestamp !== timestamp));
  };

  return (
    <motion.div 
      className="flex-1 flex items-start justify-center gap-8 p-8"
      initial={{ opacity: 0, filter: "blur(10px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      {/* Saved Traits Panel */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.7 }}
      >
        <Card className="w-64 flex flex-col">
          <div className="p-4 border-b">
            <h3 className="font-semibold">Saved Traits</h3>
          </div>
          <ScrollArea className="flex-grow h-[600px]">
            <CardContent className="p-4 space-y-2">
              {savedTraits.map((trait) => (
                <motion.div
                  key={trait.timestamp}
                  className={`relative group rounded-lg border p-2 cursor-pointer ${
                    selectedTraits.some(t => t.timestamp === trait.timestamp)
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => loadTrait(trait)}
                >
                  <div className="flex items-center gap-2">
                    <Image size={16} className="text-muted-foreground" />
                    <span className="text-sm truncate flex-grow">{trait.name}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteTrait(trait.timestamp);
                      }}
                      className="opacity-0 group-hover:opacity-100 hover:text-destructive"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </ScrollArea>
        </Card>
      </motion.div>

      {/* Tools Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.7 }}
      >
        <Card className="w-80 p-6 flex flex-col gap-4">
          {/* Tools */}
          <div className="grid grid-cols-2 gap-2">
            <ToolButton
              icon={<Circle size={20} />}
              label="Select"
              active={tool === 'select'}
              onClick={() => setTool('select')}
            />
            <ToolButton
              icon={<Circle size={20} />}
              label="Brush"
              active={tool === 'brush'}
              onClick={() => setTool('brush')}
            />
            <ToolButton
              icon={<Type size={20} />}
              label="Text"
              active={tool === 'text'}
              onClick={() => setTool('text')}
            />
            <ToolButton
              icon={<Square size={20} />}
              label="Rectangle"
              active={tool === 'rectangle'}
              onClick={() => setTool('rectangle')}
            />
            <ToolButton
              icon={<Circle size={20} />}
              label="Circle"
              active={tool === 'circle'}
              onClick={() => setTool('circle')}
            />
            <ToolButton
              icon={<Triangle size={20} />}
              label="Triangle"
              active={tool === 'triangle'}
              onClick={() => setTool('triangle')}
            />
            <ToolButton
              icon={<Minus size={20} />}
              label="Line"
              active={tool === 'line'}
              onClick={() => setTool('line')}
            />
            <ToolButton
              icon={<Upload size={20} />}
              label="Upload"
              onClick={uploadImage}
            />
          </div>

          {/* Color picker */}
          <div className="space-y-2">
            <label className="text-sm text-gray-600">Color</label>
            <div className="relative">
              <button
                className="w-10 h-10 rounded-lg border"
                style={{ backgroundColor: color }}
                onClick={() => setShowColorPicker(!showColorPicker)}
              />
              {showColorPicker && (
                <div className="absolute z-10 mt-2">
                  <HexColorPicker color={color} onChange={setColor} />
                </div>
              )}
            </div>
          </div>

          {/* Brush size */}
          {(tool === 'brush' || tool === 'line') && (
            <div className="space-y-2">
              <label className="text-sm text-gray-600">Brush Size</label>
              <input
                type="range"
                min="1"
                max="50"
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="w-full"
              />
              <span className="text-xs text-gray-500">{brushSize}px</span>
            </div>
          )}

          {/* Text controls */}
          {tool === 'text' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-gray-600">Font Size</label>
                <input
                  type="range"
                  min="12"
                  max="72"
                  value={textSize}
                  onChange={(e) => setTextSize(Number(e.target.value))}
                  className="w-full"
                />
                <span className="text-xs text-gray-500">{textSize}px</span>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm text-gray-600">Text Color</label>
                <div className="relative">
                  <button
                    className="w-10 h-10 rounded-lg border"
                    style={{ backgroundColor: textColor }}
                    onClick={() => setShowTextColorPicker(!showTextColorPicker)}
                  />
                  {showTextColorPicker && (
                    <div className="absolute z-10 mt-2">
                      <HexColorPicker color={textColor} onChange={setTextColor} />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-600">Font</label>
                <select
                  value={textFont}
                  onChange={(e) => setTextFont(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="Arial">Arial</option>
                  <option value="Helvetica">Helvetica</option>
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Courier New">Courier New</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Verdana">Verdana</option>
                </select>
              </div>
            </div>
          )}

          {/* Object controls */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Object Controls</h4>
            <div className="grid grid-cols-2 gap-2">
              <ToolButton
                icon={<Trash2 size={16} />}
                label="Delete"
                onClick={deleteSelected}
                className="text-xs"
              />
              <ToolButton
                icon={<Copy size={16} />}
                label="Duplicate"
                onClick={duplicateSelected}
                className="text-xs"
              />
              <ToolButton
                icon={<Layers size={16} />}
                label="To Front"
                onClick={bringToFront}
                className="text-xs"
              />
              <ToolButton
                icon={<Layers size={16} />}
                label="To Back"
                onClick={sendToBack}
                className="text-xs"
              />
            </div>
          </div>

          {/* Canvas controls */}
          <div className="flex gap-2">
            <ToolButton
              icon={<Undo size={20} />}
              label="Undo"
              onClick={undo}
            />
            <ToolButton
              icon={<RotateCw size={20} />}
              label="Clear"
              onClick={clearCanvas}
            />
          </div>

          {/* Base layer toggle */}
          <ToolButton
            icon={showBaseLayer ? <EyeOff size={20} /> : <Eye size={20} />}
            label={showBaseLayer ? "Hide Base" : "Show Base"}
            onClick={() => setShowBaseLayer(!showBaseLayer)}
          />

          {/* Download button */}
          <ToolButton
            icon={<Download size={20} />}
            label="Download"
            onClick={downloadImage}
            className="bg-blue-600 text-white hover:bg-blue-700"
          />
          
          {/* Save trait */}
          <div className="space-y-2">
            <input
              type="text"
              value={traitName}
              onChange={(e) => setTraitName(e.target.value)}
              placeholder="Enter trait name"
              className="w-full px-3 py-2 border rounded-lg"
            />
            <ToolButton
              icon={<Save size={20} />}
              label="Save Trait"
              onClick={saveTrait}
              disabled={!traitName}
              className="bg-indigo-600 text-white hover:bg-indigo-700 w-full"
            />
          </div>
        </Card>
      </motion.div>

      {/* Canvas Area */}
      <motion.div 
        className="relative"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.7, duration: 0.7 }}
      >
        <canvas
          ref={canvasRef}
          className="border border-gray-200 rounded-lg bg-white shadow-lg"
        />
      </motion.div>
    </motion.div>
  );
};

interface ToolButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  className?: string;
}

const ToolButton: React.FC<ToolButtonProps> = ({
  icon,
  label,
  onClick,
  active = false,
  disabled = false,
  className = ""
}) => {
  return (
    <motion.button
      className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm ${
        active 
          ? 'bg-primary text-primary-foreground' 
          : 'hover:bg-accent hover:text-accent-foreground'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      onClick={onClick}
      whileHover={!disabled ? { scale: 1.02 } : undefined}
      whileTap={!disabled ? { scale: 0.98 } : undefined}
      disabled={disabled}
    >
      {icon}
      <span>{label}</span>
    </motion.button>
  );
};

export default CreateTraits;