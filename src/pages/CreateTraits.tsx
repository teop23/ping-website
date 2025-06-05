import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HexColorPicker } from 'react-colorful';
import { Download, Eraser, Eye, EyeOff, Undo, Redo, Circle, Save } from 'lucide-react';

const CreateTraits: React.FC = () => {
  const baseCanvasRef = useRef<HTMLCanvasElement>(null);
  const drawCanvasRef = useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#000000");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [brushSize, setBrushSize] = useState(5);
  const [showBaseLayer, setShowBaseLayer] = useState(true);
  const [tool, setTool] = useState<'brush' | 'eraser'>('brush');
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [traitName, setTraitName] = useState('');
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  // Load saved traits on mount
  useEffect(() => {
    const savedTraits = localStorage.getItem('savedTraits');
    if (savedTraits) {
      const traits = JSON.parse(savedTraits);
      // Load the most recent trait if it exists
      if (traits.length > 0 && drawCanvasRef.current && ctx) {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0);
          saveToHistory(ctx.getImageData(0, 0, drawCanvasRef.current!.width, drawCanvasRef.current!.height));
        };
        img.src = traits[traits.length - 1].data;
      }
    }
  }, [ctx]);

  useEffect(() => {
    const baseCanvas = baseCanvasRef.current;
    const drawCanvas = drawCanvasRef.current;
    if (!baseCanvas || !drawCanvas) return;

    // Set up base canvas
    baseCanvas.width = 500;
    baseCanvas.height = 500;
    const baseCtx = baseCanvas.getContext('2d');
    if (!baseCtx) return;

    // Set up drawing canvas
    drawCanvas.width = 500;
    drawCanvas.height = 500;
    const drawCtx = drawCanvas.getContext('2d');
    if (!drawCtx) return;

    setCtx(drawCtx);
    drawCtx.lineCap = 'round';
    drawCtx.lineJoin = 'round';

    // Load and draw base image
    const baseImage = new Image();
    baseImage.src = '/images/ping.png';
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

  const saveToHistory = (imageData: ImageData) => {
    setHistory(prev => [...prev.slice(0, historyIndex + 1), imageData]);
    setHistoryIndex(prev => prev + 1);
  };

  const undo = () => {
    if (historyIndex > 0 && ctx && drawCanvasRef.current) {
      setHistoryIndex(prev => prev - 1);
      ctx.putImageData(history[historyIndex - 1], 0, 0);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1 && ctx && drawCanvasRef.current) {
      setHistoryIndex(prev => prev + 1);
      ctx.putImageData(history[historyIndex + 1], 0, 0);
    }
  };

  const getCanvasPoint = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = drawCanvasRef.current?.getBoundingClientRect();
    if (!rect) return null;
    
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!ctx) return;
    
    const point = getCanvasPoint(e);
    if (!point) return;
    
    setIsDrawing(true);
    lastPos.current = point;
    
    // Set composite operation based on tool
    ctx.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over';
    
    // Start a new path and move to the starting point
    ctx.beginPath();
    ctx.moveTo(point.x, point.y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !ctx || !drawCanvasRef.current || !lastPos.current) return;
    
    const point = getCanvasPoint(e);
    if (!point) return;
    
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
    if (!ctx || !drawCanvasRef.current) return;
    
    setIsDrawing(false);
    lastPos.current = null;
    
    // Reset composite operation to default
    ctx.globalCompositeOperation = 'source-over';
    
    // Save the current state to history
    saveToHistory(ctx.getImageData(0, 0, drawCanvasRef.current.width, drawCanvasRef.current.height));
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
    const savedTraits = JSON.parse(localStorage.getItem('savedTraits') || '[]');
    
    savedTraits.push({
      name: traitName,
      data: traitImage,
      timestamp: Date.now()
    });

    localStorage.setItem('savedTraits', JSON.stringify(savedTraits));
    setTraitName('');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Create PING Traits</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Tools Panel */}
          <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col gap-4">
            {/* Color picker */}
            <div className="relative">
              <button
                className="w-10 h-10 rounded-lg shadow-inner"
                style={{ backgroundColor: color }}
                onClick={() => setShowColorPicker(!showColorPicker)}
              />
              {showColorPicker && (
                <div className="absolute z-10 mt-2">
                  <HexColorPicker color={color} onChange={setColor} />
                </div>
              )}
            </div>

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
            </div>

            {/* Brush size */}
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
          </div>

          {/* Canvas Container */}
          <div className="flex-grow">
            <div className="relative bg-white rounded-xl shadow-lg p-4">
              {/* Base Layer Canvas */}
              <canvas
                ref={baseCanvasRef}
                className="absolute top-4 left-4 border border-gray-200 rounded-lg"
                style={{ opacity: showBaseLayer ? 1 : 0.5 }}
              />
              {/* Drawing Layer Canvas */}
              <canvas
                ref={drawCanvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                className="absolute top-4 left-4 border border-gray-200 rounded-lg cursor-crosshair"
                style={{ background: 'transparent' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
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
      className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
        active 
          ? 'bg-indigo-100 text-indigo-600' 
          : 'hover:bg-gray-100'
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