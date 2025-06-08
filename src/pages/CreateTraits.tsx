import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '../components/ui/card';
import { HexColorPicker } from 'react-colorful';
import { Download, Eraser, Eye, EyeOff, Undo, Redo, Circle, Save, Image, X, Type, Move } from 'lucide-react';
import pingImage from '../assets/images/ping.png'; 
import { ScrollArea } from '../components/ui/scroll-area';

interface SavedTrait {
  name: string;
  data: string;
  timestamp: number;
}

interface TextElement {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  fontFamily: string;
}

const CreateTraits: React.FC = () => {
  const baseCanvasRef = useRef<HTMLCanvasElement>(null);
  const drawCanvasRef = useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#000000");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [brushSize, setBrushSize] = useState(5);
  const [showBaseLayer, setShowBaseLayer] = useState(true);
  const [tool, setTool] = useState<'brush' | 'eraser' | 'text'>('brush');
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [traitName, setTraitName] = useState('');
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const [savedTraits, setSavedTraits] = useState<SavedTrait[]>([]);
  const [selectedTraits, setSelectedTraits] = useState<SavedTrait[]>([]);
  const [compositeCanvas, setCompositeCanvas] = useState<HTMLCanvasElement | null>(null);
  const [drawDistance, setDrawDistance] = useState(0);
  const minDrawDistance = 50;

  // Text-related state
  const [textElements, setTextElements] = useState<TextElement[]>([]);
  const [currentText, setCurrentText] = useState('');
  const [textFontSize, setTextFontSize] = useState(24);
  const [textColor, setTextColor] = useState('#000000');
  const [showTextColorPicker, setShowTextColorPicker] = useState(false);
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);
  const [isDraggingText, setIsDraggingText] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Load saved traits on mount
  useEffect(() => {
    const savedTraits = localStorage.getItem('savedTraits');
    if (savedTraits) {
      setSavedTraits(JSON.parse(savedTraits));
    }
  }, [ctx]);

  useEffect(() => {
    const baseCanvas = baseCanvasRef.current;
    const drawCanvas = drawCanvasRef.current;
    if (!baseCanvas || !drawCanvas) return;

    // Set up base canvas
    baseCanvas.width = 800;
    baseCanvas.height = 800;
    const baseCtx = baseCanvas.getContext('2d');
    if (!baseCtx) return;

    // Set up drawing canvas
    drawCanvas.width = 800;
    drawCanvas.height = 800;
    const drawCtx = drawCanvas.getContext('2d');
    if (!drawCtx) return;

    setCtx(drawCtx);
    drawCtx.lineCap = 'round';
    drawCtx.lineJoin = 'round';

    // Load and draw base image
    const baseImage = document.createElement('img');
    baseImage.src = pingImage;
    baseImage.onload = () => {
      const scale = Math.min(
        baseCanvas.width / baseImage.width,
        baseCanvas.height / baseImage.height
      );
      const x = (baseCanvas.width - baseImage.width * scale) / 2;
      const y = (baseCanvas.height - baseImage.height * scale) / 2;
      
      baseCtx.drawImage(
        baseImage,
        x, y,
        baseImage.width * scale,
        baseImage.height * scale
      );
      
      // Save initial state of drawing canvas
      saveToHistory(drawCtx.getImageData(0, 0, drawCanvas.width, drawCanvas.height));
    };
  }, []);

  // Redraw canvas with text elements
  const redrawCanvas = () => {
    if (!ctx || !drawCanvasRef.current) return;
    
    // Restore the current drawing state
    if (history[historyIndex]) {
      ctx.putImageData(history[historyIndex], 0, 0);
    }
    
    // Draw all text elements
    textElements.forEach(textElement => {
      ctx.font = `${textElement.fontSize}px ${textElement.fontFamily}`;
      ctx.fillStyle = textElement.color;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText(textElement.text, textElement.x, textElement.y);
    });
  };

  useEffect(() => {
    redrawCanvas();
  }, [textElements, historyIndex]);

  const saveToHistory = (imageData: ImageData) => {
    const newHistory = [...history.slice(0, historyIndex + 1), imageData];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0 && ctx && drawCanvasRef.current) {
      const newIndex = historyIndex - 1;
      ctx.putImageData(history[newIndex], 0, 0);
      setHistoryIndex(newIndex);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1 && ctx && drawCanvasRef.current) {
      const newIndex = historyIndex + 1;
      ctx.putImageData(history[newIndex], 0, 0);
      setHistoryIndex(newIndex);
    }
  };

  const getCanvasPoint = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = drawCanvasRef.current?.getBoundingClientRect();
    if (!rect) return null;
    
    const scaleX = drawCanvasRef.current!.width / rect.width;
    const scaleY = drawCanvasRef.current!.height / rect.height;
    
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const getTextElementAt = (x: number, y: number): TextElement | null => {
    if (!ctx) return null;
    
    // Check text elements in reverse order (top to bottom)
    for (let i = textElements.length - 1; i >= 0; i--) {
      const textElement = textElements[i];
      ctx.font = `${textElement.fontSize}px ${textElement.fontFamily}`;
      const metrics = ctx.measureText(textElement.text);
      const textWidth = metrics.width;
      const textHeight = textElement.fontSize;
      
      if (x >= textElement.x && x <= textElement.x + textWidth &&
          y >= textElement.y && y <= textElement.y + textHeight) {
        return textElement;
      }
    }
    return null;
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const point = getCanvasPoint(e);
    if (!point) return;

    if (tool === 'text') {
      if (currentText.trim()) {
        // Add new text element
        const newTextElement: TextElement = {
          id: Date.now().toString(),
          text: currentText,
          x: point.x,
          y: point.y,
          fontSize: textFontSize,
          color: textColor,
          fontFamily: 'Arial'
        };
        
        setTextElements(prev => [...prev, newTextElement]);
        setCurrentText('');
        
        // Save to history after adding text
        setTimeout(() => {
          if (ctx && drawCanvasRef.current) {
            saveToHistory(ctx.getImageData(0, 0, drawCanvasRef.current.width, drawCanvasRef.current.height));
          }
        }, 10);
      }
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!ctx) return;
    
    const point = getCanvasPoint(e);
    if (!point) return;

    if (tool === 'text') {
      // Check if clicking on existing text
      const textElement = getTextElementAt(point.x, point.y);
      if (textElement) {
        setSelectedTextId(textElement.id);
        setIsDraggingText(true);
        setDragOffset({
          x: point.x - textElement.x,
          y: point.y - textElement.y
        });
        return;
      } else {
        handleCanvasClick(e);
        return;
      }
    }
    
    setIsDrawing(true);
    lastPos.current = point;
    
    // Set composite operation based on tool
    ctx.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over';
    
    // Draw a circle at the click point
    ctx.fillStyle = tool === 'eraser' ? 'rgba(0,0,0,1)' : color;
    ctx.beginPath();
    ctx.arc(point.x, point.y, brushSize / 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Start path for potential dragging
    ctx.beginPath();
    ctx.moveTo(point.x, point.y);
    
    // Save state to history if not dragging
    if (!isDrawing && drawCanvasRef.current) {
      saveToHistory(ctx.getImageData(0, 0, drawCanvasRef.current.width, drawCanvasRef.current.height));
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const point = getCanvasPoint(e);
    if (!point) return;

    if (isDraggingText && selectedTextId) {
      // Update text position
      setTextElements(prev => prev.map(textElement => 
        textElement.id === selectedTextId 
          ? { ...textElement, x: point.x - dragOffset.x, y: point.y - dragOffset.y }
          : textElement
      ));
      return;
    }

    if (!isDrawing || !ctx || !drawCanvasRef.current || !lastPos.current || tool === 'text') return;
    
    // Calculate distance drawn
    const dx = point.x - lastPos.current.x;
    const dy = point.y - lastPos.current.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    setDrawDistance(prev => prev + distance);
    
    // Set drawing properties
    ctx.strokeStyle = tool === 'eraser' ? 'rgba(0,0,0,1)' : color;
    ctx.lineWidth = brushSize;
    
    // Draw line from last position to current position
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
    
    // Update last position
    lastPos.current = point;
  };

  const stopDrawing = () => {
    if (isDraggingText) {
      setIsDraggingText(false);
      setSelectedTextId(null);
      // Save to history after moving text
      if (ctx && drawCanvasRef.current) {
        saveToHistory(ctx.getImageData(0, 0, drawCanvasRef.current.width, drawCanvasRef.current.height));
      }
      return;
    }

    if (!ctx || !drawCanvasRef.current) return;
    
    // Only save to history if we've drawn enough
    if (drawDistance > minDrawDistance) {
      saveToHistory(ctx.getImageData(0, 0, drawCanvasRef.current.width, drawCanvasRef.current.height));
    }
    
    // Reset drawing state
    setIsDrawing(false);
    setDrawDistance(0);
    lastPos.current = null;
  };

  const downloadImage = () => {
    const drawCanvas = drawCanvasRef.current;
    if (!drawCanvas) return;

    // Only download the trait layer
    const traitImage = drawCanvas.toDataURL();

    const link = document.createElement('a');
    link.download = 'ping-trait.png';
    link.href = traitImage;
    link.click();
  };

  const saveTrait = () => {
    const drawCanvas = drawCanvasRef.current;
    if (!drawCanvas || !traitName) return;

    const traitImage = drawCanvas.toDataURL();
    const newTrait = {
      name: traitName,
      data: traitImage,
      timestamp: Date.now()
    };
    
    const updatedTraits = [...savedTraits, newTrait];
    setSavedTraits(updatedTraits);
    localStorage.setItem('savedTraits', JSON.stringify(updatedTraits));
    setTraitName('');
    
    // Clear the canvas and text elements after saving
    ctx?.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
    setTextElements([]);
    saveToHistory(ctx!.getImageData(0, 0, drawCanvas.width, drawCanvas.height));
  };

  const updateCompositeCanvas = () => {
    if (!ctx || !drawCanvasRef.current) return;
    
    ctx.clearRect(0, 0, drawCanvasRef.current.width, drawCanvasRef.current.height);
    
    // Create a promise for each trait to load
    const loadTraitPromises = selectedTraits.map(trait => new Promise<void>((resolve) => {
      const img = document.createElement('img');
      img.src = trait.data;
      img.onload = () => {
        ctx.drawImage(img, 0, 0, drawCanvasRef.current!.width, drawCanvasRef.current!.height);
        resolve();
      };
    }));
    
    // Wait for all images to load and draw
    Promise.all(loadTraitPromises).then(() => {
      saveToHistory(ctx.getImageData(0, 0, drawCanvasRef.current!.width, drawCanvasRef.current!.height));
    });
  };

  const loadTrait = (trait: SavedTrait) => {
    if (!ctx || !drawCanvasRef.current) return;
    
    setSelectedTraits(prev => {
      const isSelected = prev.some(t => t.timestamp === trait.timestamp);
      if (isSelected) {
        return prev.filter(t => t.timestamp !== trait.timestamp);
      } else {
        return [...prev, trait];
      }
    });
  };

  // Update composite canvas whenever selected traits change
  useEffect(() => {
    updateCompositeCanvas();
  }, [selectedTraits]);

  const deleteTrait = (timestamp: number) => {
    const updatedTraits = savedTraits.filter(trait => trait.timestamp !== timestamp);
    setSavedTraits(updatedTraits);
    localStorage.setItem('savedTraits', JSON.stringify(updatedTraits));
    setTraitName('');
    setSelectedTraits(prev => prev.filter(t => t.timestamp !== timestamp));
  };

  const deleteSelectedText = () => {
    if (selectedTextId) {
      setTextElements(prev => prev.filter(t => t.id !== selectedTextId));
      setSelectedTextId(null);
    }
  };

  const getCursorStyle = () => {
    if (tool === 'text') return 'text';
    if (tool === 'eraser') return 'crosshair';
    return 'crosshair';
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

        {/* Tools Panel - Fixed width sidebar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
        >
          <Card className="w-80 p-6 flex flex-col gap-4">
            {/* Color picker for brush/eraser */}
            {tool !== 'text' && (
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
            )}

            {/* Tools */}
            <div className="flex flex-col gap-2">
              <ToolButton
                icon={<Circle size={20} />}
                label="Brush"
                active={tool === 'brush'}
                onClick={() => setTool('brush')}
              />
              <ToolButton
                icon={<Eraser size={20} />}
                label="Eraser"
                active={tool === 'eraser'}
                onClick={() => setTool('eraser')}
              />
              <ToolButton
                icon={<Type size={20} />}
                label="Text"
                active={tool === 'text'}
                onClick={() => setTool('text')}
              />
            </div>

            {/* Brush size (for brush and eraser) */}
            {tool !== 'text' && (
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
              </div>
            )}

            {/* Text controls */}
            {tool === 'text' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm text-gray-600">Text</label>
                  <input
                    type="text"
                    value={currentText}
                    onChange={(e) => setCurrentText(e.target.value)}
                    placeholder="Enter text..."
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm text-gray-600">Font Size</label>
                  <input
                    type="range"
                    min="12"
                    max="72"
                    value={textFontSize}
                    onChange={(e) => setTextFontSize(Number(e.target.value))}
                    className="w-full"
                  />
                  <span className="text-xs text-gray-500">{textFontSize}px</span>
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

                {selectedTextId && (
                  <ToolButton
                    icon={<X size={20} />}
                    label="Delete Selected Text"
                    onClick={deleteSelectedText}
                    className="bg-red-600 text-white hover:bg-red-700"
                  />
                )}
              </div>
            )}

            {/* History controls */}
            <div className="flex gap-2">
              <ToolButton
                icon={<Undo size={20} />}
                label="Undo"
                onClick={undo}
                disabled={historyIndex <= 0}
              />
              <ToolButton
                icon={<Redo size={20} />}
                label="Redo"
                onClick={redo}
                disabled={historyIndex >= history.length - 1}
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
            
            {/* Save to localStorage */}
            <div className="mt-4 space-y-2">
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

        {/* Drawing Area - Takes remaining width */}
        <motion.div 
          className="relative"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7, duration: 0.7 }}
        >
            <canvas
              ref={baseCanvasRef}
              className="absolute border border-gray-200 rounded-lg bg-white"
              style={{ opacity: showBaseLayer ? 1 : 0.5 }}
            />
            <canvas
              ref={drawCanvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              className="relative border border-gray-200 rounded-lg bg-transparent"
              style={{ cursor: getCursorStyle() }}
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
      className={`flex items-center gap-2 px-4 py-2 rounded-md ${
        active 
          ? 'bg-secondary text-secondary-foreground' 
          : 'hover:bg-accent hover:text-accent-foreground'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      onClick={onClick}
      whileHover={!disabled ? { scale: 1.02 } : undefined}
      whileTap={!disabled ? { scale: 0.98 } : undefined}
      disabled={disabled}
    >
      {icon}
      <span className="text-sm">{label}</span>
    </motion.button>
  );
};

export default CreateTraits;