import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { HexColorPicker } from 'react-colorful';
import { 
  Download, 
  Eye, 
  EyeOff, 
  Undo, 
  Save, 
  Type, 
  Circle,
  Square,
  Minus,
  Upload,
  Trash2,
  RotateCw,
  Palette,
  MousePointer,
  Spline
} from 'lucide-react';
import { fabric } from 'fabric';
import pingImage from '../assets/images/ping.png';
import ToolButton from '../components/ToolButton';
import { 
  calculateCanvasSize, 
  setupBaseImage, 
  updateBaseImageScale, 
  updateLoadedTraitsScale,
  saveCanvasState,
  restoreCanvasState,
  ensureProperLayering,
  safeRenderAll,
  type CanvasState
} from '../utils/canvasUtils';
import { 
  addText, 
  addRectangle, 
  addCircle, 
  addLine, 
  addCurvedLine,
  uploadImage, 
  deleteSelected, 
  clearCanvas 
} from '../utils/drawingTools';
import { 
  saveTrait, 
  downloadTrait, 
  deleteTrait, 
  downloadIndividualTrait, 
  toggleTrait,
  type SavedTrait 
} from '../utils/traitManager';

type ToolType = 'select' | 'brush' | 'text' | 'rectangle' | 'circle' | 'line' | 'curve';

const CreateTraits: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [baseImage, setBaseImage] = useState<fabric.Image | null>(null);
  const [showBaseLayer, setShowBaseLayer] = useState(true);
  const [tool, setTool] = useState<ToolType>('select');
  const [traitName, setTraitName] = useState('');
  const [savedTraits, setSavedTraits] = useState<SavedTrait[]>([]);
  const [loadedTraits, setLoadedTraits] = useState<Map<string, fabric.Image>>(new Map());
  
  // Undo/Redo state
  const [canvasHistory, setCanvasHistory] = useState<CanvasState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isRedoing, setIsRedoing] = useState(false);
  const [isUndoing, setIsUndoing] = useState(false);
  
  // Drawing properties
  const [color, setColor] = useState('#000000');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [brushSize, setBrushSize] = useState(5);
  
  // Text properties
  const [textSize, setTextSize] = useState(24);
  const [textColor, setTextColor] = useState('#000000');
  const [showTextColorPicker, setShowTextColorPicker] = useState(false);
  
  // Delete confirmation state
  const [traitToDelete, setTraitToDelete] = useState<string | null>(null);
  
  // Download mode toggle
  const [downloadMode, setDownloadMode] = useState<'trait' | 'character'>('trait');

  // Curved line state
  const [curvePoints, setCurvePoints] = useState<{ x: number; y: number }[]>([]);
  const [tempCurveLine, setTempCurveLine] = useState<fabric.Path | null>(null);
  // Load saved traits from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('pingTraits');
    if (saved) {
      try {
        setSavedTraits(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading saved traits:', error);
      }
    }
  }, []);

  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvasSize = calculateCanvasSize(canvasRef.current?.parentElement);

    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width: canvasSize,
      height: canvasSize,
      backgroundColor: 'white',
      selection: tool === 'select'
    });

    // Load base character image
    setupBaseImage(fabricCanvas, pingImage, (img) => {
      setBaseImage(img);
      
      // Save initial state
      setTimeout(() => {
        const initialState: CanvasState = {
          objects: [],
          timestamp: Date.now()
        };
        setCanvasHistory([initialState]);
        setHistoryIndex(0);
      }, 100);
    });

    // Canvas event handlers for saving state
    fabricCanvas.on('text:editing:entered', () => {
      fabricCanvas.selection = false;
    });
    
    fabricCanvas.on('text:editing:exited', () => {
      fabricCanvas.selection = tool === 'select';
      saveCanvasState(fabricCanvas, canvasHistory, historyIndex, setCanvasHistory, setHistoryIndex, isUndoing, isRedoing);
    });
    
    fabricCanvas.on('object:added', () => {
      ensureProperLayering(fabricCanvas);
      setTimeout(() => saveCanvasState(fabricCanvas, canvasHistory, historyIndex, setCanvasHistory, setHistoryIndex, isUndoing, isRedoing), 100);
    });
    
    fabricCanvas.on('object:removed', () => {
      setTimeout(() => saveCanvasState(fabricCanvas, canvasHistory, historyIndex, setCanvasHistory, setHistoryIndex, isUndoing, isRedoing), 100);
    });
    
    fabricCanvas.on('object:modified', () => {
      setTimeout(() => saveCanvasState(fabricCanvas, canvasHistory, historyIndex, setCanvasHistory, setHistoryIndex, isUndoing, isRedoing), 100);
    });
    
    fabricCanvas.on('path:created', () => {
      ensureProperLayering(fabricCanvas);
      setTimeout(() => saveCanvasState(fabricCanvas, canvasHistory, historyIndex, setCanvasHistory, setHistoryIndex, isUndoing, isRedoing), 100);
    });

    setCanvas(fabricCanvas);

    return () => {
      fabricCanvas.dispose();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle canvas click events
  useEffect(() => {
    if (!canvas) return;

    const handleCanvasClick = (e: fabric.IEvent) => {
      if (tool === 'select' || tool === 'brush') return;

      const pointer = canvas.getPointer(e.e as MouseEvent);
      
      switch (tool) {
        case 'text':
          addText(pointer.x, pointer.y, canvas, textSize, textColor, setTool);
          break;
        case 'rectangle':
          addRectangle(pointer.x, pointer.y, canvas, color, setTool);
          break;
        case 'circle':
          addCircle(pointer.x, pointer.y, canvas, color, setTool);
          break;
        case 'line':
          addLine(pointer.x, pointer.y, canvas, color, brushSize, setTool);
          break;
        case 'curve':
          addCurvedLine(pointer.x, pointer.y, canvas, color, brushSize, curvePoints, setCurvePoints, tempCurveLine, setTempCurveLine, setTool);
          break;
      }
    };

    canvas.on('mouse:down', handleCanvasClick);

    return () => {
      canvas.off('mouse:down', handleCanvasClick);
    };
  }, [canvas, tool, textSize, textColor, color, brushSize, curvePoints, tempCurveLine]);

  // Handle clipboard paste
  useEffect(() => {
    if (!canvas) return;

    const handlePaste = async (e: ClipboardEvent) => {
      e.preventDefault();
      
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        
        if (item.type.indexOf('image') !== -1) {
          const file = item.getAsFile();
          if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
              const imgSrc = event.target?.result as string;
              fabric.Image.fromURL(imgSrc, (img) => {
                // Scale the image to fit nicely in the canvas
                const maxSize = Math.min(canvas.width!, canvas.height!) * 0.4;
                const scale = Math.min(maxSize / img.width!, maxSize / img.height!);
                
                img.set({
                  left: canvas.width! / 2,
                  top: canvas.height! / 2,
                  originX: 'center',
                  originY: 'center',
                  scaleX: scale,
                  scaleY: scale,
                  cornerStyle: 'circle',
                  cornerColor: '#4F46E5',
                  cornerSize: 8,
                  transparentCorners: false,
                  borderColor: '#4F46E5'
                });
                
                canvas.add(img);
                canvas.bringToFront(img);
                canvas.setActiveObject(img);
                safeRenderAll(canvas);
              });
            };
            reader.readAsDataURL(file);
          }
          break;
        }
      }
    };

    // Add event listener to the document
    document.addEventListener('paste', handlePaste);

    return () => {
      document.removeEventListener('paste', handlePaste);
    };
  }, [canvas]);

  // Handle window resize
  useEffect(() => {
    if (!canvas) return;

    const handleResize = () => {
      const newSize = calculateCanvasSize(canvasRef.current?.parentElement);
      canvas.setDimensions({ width: newSize, height: newSize });
      
      if (baseImage) {
        updateBaseImageScale(canvas, baseImage);
      }
      
      updateLoadedTraitsScale(canvas, loadedTraits);
      safeRenderAll(canvas);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [canvas, baseImage, loadedTraits]);

  // Update canvas when tool changes
  useEffect(() => {
    if (!canvas) return;

    // Reset curve state when changing tools
    if (tool !== 'curve') {
      setCurvePoints([]);
      if (tempCurveLine) {
        canvas.remove(tempCurveLine);
        setTempCurveLine(null);
        safeRenderAll(canvas);
      }
    }

    canvas.selection = tool === 'select';
    canvas.isDrawingMode = tool === 'brush';
    
    if (tool === 'brush') {
      canvas.freeDrawingBrush.width = brushSize;
      canvas.freeDrawingBrush.color = color;
    }

    switch (tool) {
      case 'select':
        canvas.defaultCursor = 'default';
        break;
      case 'brush':
        canvas.defaultCursor = 'crosshair';
        break;
      case 'text':
        canvas.defaultCursor = 'text';
        break;
      case 'curve':
        canvas.defaultCursor = 'crosshair';
        break;
      default:
        canvas.defaultCursor = 'crosshair';
    }
  }, [tool, canvas, brushSize, color]);

  // Update base image visibility
  useEffect(() => {
    if (!baseImage || !canvas) return;
    baseImage.set({ opacity: showBaseLayer ? 1 : 0.2 });
    safeRenderAll(canvas);
  }, [showBaseLayer, baseImage, canvas]);

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      restoreCanvasState(canvas!, canvasHistory[newIndex], setIsUndoing);
    }
  };

  const redo = () => {
    if (historyIndex < canvasHistory.length - 1) {
      setIsRedoing(true);
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      restoreCanvasState(canvas!, canvasHistory[newIndex], setIsUndoing);
      setTimeout(() => setIsRedoing(false), 100);
    }
  };

  const getDownloadButtonText = () => {
    return downloadMode === 'trait' ? 'Download Trait' : 'Download Character';
  };

  const confirmDeleteTrait = (id: string) => {
    setTraitToDelete(id);
  };

  const handleDeleteTrait = (id: string) => {
    deleteTrait(id, canvas, loadedTraits, setLoadedTraits, savedTraits, setSavedTraits);
    setTraitToDelete(null);
  };

  const handleSaveTrait = () => {
    saveTrait(canvas!, traitName, baseImage, loadedTraits, savedTraits, setSavedTraits, setTraitName);
  };

  const handleDownloadTrait = () => {
    downloadTrait(canvas!, traitName, downloadMode, baseImage, loadedTraits);
  };

  const handleToggleTrait = (trait: SavedTrait) => {
    toggleTrait(trait, canvas!, loadedTraits, setLoadedTraits, savedTraits, setSavedTraits, baseImage);
  };

  return (
    <div className="flex-grow bg-gradient-to-br from-gray-50 to-gray-100 p-2 sm:p-4 w-full min-h-0">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-4 sm:mb-8"
        >
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2">Create PING Traits</h1>
          <p className="text-sm sm:text-base text-gray-600">Design custom traits for your PING character</p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-3 sm:gap-6 w-full">
          {/* Saved Traits Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="w-full lg:w-1/4 lg:flex-shrink-0 min-w-0"
          >
            <Card className="h-fit">
              <CardHeader>
                <h3 className="text-base sm:text-lg font-semibold">Saved Traits</h3>
              </CardHeader>
              <CardContent className="p-0">
                <div className={`p-2 sm:p-4 space-y-2 ${
                  savedTraits.length > 3 ? 'max-h-[300px] sm:max-h-[400px] overflow-y-auto' : ''
                }`}>
                  {savedTraits.map((trait) => (
                    <div
                      key={trait.id}
                      className={`flex items-center p-2 sm:p-3 rounded-lg transition-colors cursor-pointer ${
                        trait.isVisible 
                          ? 'bg-blue-50 border-2 border-blue-200 hover:bg-blue-100' 
                          : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                      }`}
                    >
                      <div 
                        className="flex items-center space-x-3 flex-1 min-w-0 cursor-pointer"
                        onClick={() => handleToggleTrait(trait)}
                      >
                        <img
                          src={trait.data}
                          alt={trait.name}
                          className={`w-8 h-8 object-cover rounded ${
                            trait.isVisible ? 'ring-2 ring-blue-400' : ''
                          }`}
                        />
                        <div className="flex flex-col min-w-0 flex-1">
                          <span className="text-xs sm:text-sm font-medium truncate">{trait.name}</span>
                          <span className={`text-xs ${trait.isVisible ? 'text-blue-600' : 'text-gray-500'}`}>
                            {trait.isVisible ? 'Visible' : 'Hidden'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 flex-shrink-0">
                        <div className={`w-2 h-2 rounded-full ${trait.isVisible ? 'bg-green-400' : 'bg-gray-300'}`} />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadIndividualTrait(trait);
                          }}
                          className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Download size={12} className="sm:w-4 sm:h-4" />
                        </Button>
                        <Dialog open={traitToDelete === trait.id} onOpenChange={(open) => !open && setTraitToDelete(null)}>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                confirmDeleteTrait(trait.id);
                              }}
                              className="h-6 w-6 sm:h-8 sm:w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 size={12} className="sm:w-4 sm:h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Delete Trait</DialogTitle>
                              <DialogDescription>
                                Are you sure you want to delete "{trait.name}"? This action cannot be undone.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button
                                variant="outline"
                                onClick={() => setTraitToDelete(null)}
                              >
                                Cancel
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={() => handleDeleteTrait(trait.id)}
                              >
                                Delete
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  ))}
                  {savedTraits.length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                      <p>No saved traits yet</p>
                      <p className="text-xs sm:text-sm">Create and save your first trait! Click on saved traits to toggle visibility.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Tools Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="w-full lg:w-1/4 lg:flex-shrink-0 min-w-0"
          >
            <Card className="h-auto lg:h-[600px] overflow-hidden">
              <CardHeader>
                <h3 className="text-base sm:text-lg font-semibold">Tools</h3>
              </CardHeader>
              <CardContent className="space-y-2 sm:space-y-3 h-auto lg:h-[520px] lg:overflow-y-auto">
                {/* Tool Selection */}
                <div className="grid grid-cols-3 gap-1 sm:gap-2">
                  <ToolButton
                    icon={<MousePointer size={14} className="sm:w-[18px] sm:h-[18px]" />}
                    label="Select"
                    active={tool === 'select'}
                    onClick={() => setTool('select')}
                  />
                  <ToolButton
                    icon={<Palette size={14} className="sm:w-[18px] sm:h-[18px]" />}
                    label="Brush"
                    active={tool === 'brush'}
                    onClick={() => setTool('brush')}
                  />
                  <ToolButton
                    icon={<Type size={14} className="sm:w-[18px] sm:h-[18px]" />}
                    label="Text"
                    active={tool === 'text'}
                    onClick={() => setTool('text')}
                  />
                  <ToolButton
                    icon={<Square size={14} className="sm:w-[18px] sm:h-[18px]" />}
                    label="Rectangle"
                    active={tool === 'rectangle'}
                    onClick={() => setTool('rectangle')}
                  />
                  <ToolButton
                    icon={<Circle size={14} className="sm:w-[18px] sm:h-[18px]" />}
                    label="Circle"
                    active={tool === 'circle'}
                    onClick={() => setTool('circle')}
                  />
                  <ToolButton
                    icon={<Minus size={14} className="sm:w-[18px] sm:h-[18px]" />}
                    label="Line"
                    active={tool === 'line'}
                    onClick={() => setTool('line')}
                  />
                  <ToolButton
                    icon={<Spline size={14} className="sm:w-[18px] sm:h-[18px]" />}
                    label="Curve"
                    active={tool === 'curve'}
                    onClick={() => setTool('curve')}
                  />
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
                        value={(canvas?.getActiveObject() as fabric.IText)?.fontWeight || 'normal'}
                        onChange={(e) => {
                          const activeObject = canvas?.getActiveObject();
                          if (activeObject && activeObject.type === 'i-text') {
                            (activeObject as fabric.IText).set({ fontWeight: e.target.value });
                            if(canvas) {
                              safeRenderAll(canvas);
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
                      💡 Click 3 points to create a curved line:
                      <br />
                      1. Start point
                      <br />
                      2. Control point (curve direction)
                      <br />
                      3. End point
                    </div>
                    {curvePoints.length > 0 && (
                      <div className="text-xs text-green-700 bg-green-50 p-2 rounded border border-green-200">
                        Points clicked: {curvePoints.length}/3
                        {curvePoints.length < 3 && (
                          <span className="block mt-1">
                            Click {curvePoints.length === 1 ? 'control point' : 'end point'}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-1 pt-2 border-t">
                  <Button onClick={() => uploadImage(canvas!)} variant="outline" size="sm" className="w-full">
                    <Upload size={12} className="mr-1 sm:mr-2 sm:w-4 sm:h-4" />
                    Upload Image
                  </Button>
                  <div className="grid grid-cols-2 gap-1">
                    <Button onClick={() => deleteSelected(canvas!)} variant="outline" size="sm">
                      <Trash2 size={12} className="mr-1 sm:mr-2 sm:w-4 sm:h-4" />
                      Delete
                    </Button>
                    <Button 
                      onClick={undo} 
                      variant="outline" 
                      size="sm"
                      disabled={historyIndex <= 0}
                    >
                      <Undo size={12} className="mr-1 sm:mr-2 sm:w-4 sm:h-4" />
                      Undo
                    </Button>
                  </div>
                  <Button 
                    onClick={redo} 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    disabled={historyIndex >= canvasHistory.length - 1}
                  >
                    <RotateCw size={12} className="mr-1 sm:mr-2 sm:w-4 sm:h-4" />
                    Redo
                  </Button>
                  <Button onClick={() => clearCanvas(canvas!)} variant="outline" size="sm" className="w-full">
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
          </motion.div>

          {/* Canvas */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="w-full lg:w-1/2 lg:flex-shrink-0 min-w-0"
          >
            <Card className="p-3 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base sm:text-lg font-semibold">Canvas</h3>
                <Button
                  variant="outline"
                  onClick={() => setShowBaseLayer(!showBaseLayer)}
                  size="sm"
                >
                  {showBaseLayer ? <EyeOff size={14} className="sm:w-4 sm:h-4" /> : <Eye size={14} className="sm:w-4 sm:h-4" />}
                  <span className="ml-1 sm:ml-2 text-xs sm:text-sm">{showBaseLayer ? 'Hide' : 'Show'} Base</span>
                </Button>
              </div>
              
              <div className="flex justify-center items-center overflow-hidden">
                <canvas
                  ref={canvasRef}
                  className="border-2 border-gray-200 rounded-lg shadow-sm w-full h-auto max-w-full aspect-square object-contain"
                />
              </div>

              {/* Save Controls */}
              <div className="mt-3 sm:mt-6 space-y-2 sm:space-y-3">
                <input
                  type="text"
                  value={traitName}
                  onChange={(e) => setTraitName(e.target.value)}
                  placeholder="Enter trait name..."
                  className="w-full px-2 sm:px-3 py-1 sm:py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                  <Button
                    onClick={handleSaveTrait}
                    disabled={!traitName.trim()}
                    className="flex-1 h-10"
                    size="sm"
                  >
                    <Save size={14} className="mr-1 sm:mr-2 sm:w-4 sm:h-4" />
                    Save Trait
                  </Button>
                  <div className="flex-1 flex space-x-1 sm:space-x-2">
                    <Button
                      onClick={handleDownloadTrait}
                      variant="outline"
                      className="flex-1 h-10"
                      size="sm"
                    >
                      <Download size={14} className="mr-1 sm:mr-2 sm:w-4 sm:h-4" />
                      {getDownloadButtonText()}
                    </Button>
                    {/* Download Mode Toggle */}
                    <div className="flex items-center space-x-1 p-1 bg-gray-100 rounded-lg min-w-[80px] sm:min-w-[100px] h-10">
                      <button
                        onClick={() => setDownloadMode('trait')}
                        className={`px-2 sm:px-3 py-1.5 text-xs font-medium rounded-md transition-colors h-8 flex items-center justify-center ${
                          downloadMode === 'trait'
                            ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        Trait
                      </button>
                      <button
                        onClick={() => setDownloadMode('character')}
                        className={`px-2 sm:px-3 py-1.5 text-xs font-medium rounded-md transition-colors h-8 flex items-center justify-center ${
                          downloadMode === 'character'
                            ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        Full
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CreateTraits;