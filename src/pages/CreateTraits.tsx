import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fabric } from 'fabric';
import pingImage from '../assets/images/ping.png';
import { ToolType } from '../types/traits';
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
import { setupCanvasEventHandlers, setupClipboardHandlers } from '../utils/canvasEventHandlers';
import ToolsPanel from '../components/traits_page/ToolsPanel';
import CanvasArea from '../components/traits_page/CanvasArea';
import SavedTraitsPanel from '../components/traits_page/SavedTraitsPanel';
import SaveControls from '../components/traits_page/SaveControls';

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
  const [tempCurveLine, setTempCurveLine] = useState<fabric.Object | null>(null);

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

    // Let the canvas size itself based on its container
    const container = canvasRef.current.parentElement;
    if (!container) return;
    
    const containerRect = container.getBoundingClientRect();
    const size = Math.min(containerRect.width, containerRect.height) * 0.9;

    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width: size,
      height: size,
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
  }, []);

  // Handle canvas click events
  useEffect(() => {
    if (!canvas) return;

    return setupCanvasEventHandlers(
      canvas,
      tool,
      textSize,
      textColor,
      color,
      brushSize,
      curvePoints,
      setCurvePoints,
      tempCurveLine,
      setTempCurveLine,
      setTool
    );
  }, [canvas, tool, textSize, textColor, color, brushSize, curvePoints, tempCurveLine]);

  // Handle clipboard paste
  useEffect(() => {
    if (!canvas) return;
    return setupClipboardHandlers(canvas);
  }, [canvas]);

  // Handle window resize
  useEffect(() => {
    if (!canvas) return;

    const handleResize = () => {
      const container = canvasRef.current?.parentElement;
      if (!container) return;
      
      const containerRect = container.getBoundingClientRect();
      const size = Math.min(containerRect.width, containerRect.height) * 0.9;
      
      canvas.setDimensions({ width: size, height: size });
      
      if (baseImage) {
        updateBaseImageScale(canvas, baseImage);
      }
      
      updateLoadedTraitsScale(canvas, loadedTraits);
      safeRenderAll(canvas);
    };


    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
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

  const handleSaveTrait = () => {
    saveTrait(canvas!, traitName, baseImage, loadedTraits, savedTraits, setSavedTraits, setTraitName);
  };

  const handleDownloadTrait = () => {
    downloadTrait(canvas!, traitName, downloadMode, baseImage, loadedTraits);
  };

  const handleToggleTrait = (trait: SavedTrait) => {
    toggleTrait(trait, canvas!, loadedTraits, setLoadedTraits, savedTraits, setSavedTraits, baseImage);
  };

  const handleDeleteTrait = (id: string) => {
    deleteTrait(id, canvas, loadedTraits, setLoadedTraits, savedTraits, setSavedTraits);
  };

  return (
    <div className="h-full bg-gradient-to-br from-gray-50 to-gray-100 w-full flex flex-col lg:flex-row">
      {/* Left Sidebar - Tools */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="w-full lg:w-80 flex-shrink-0 p-2 lg:p-4 border-b lg:border-b-0 lg:border-r border-gray-200 bg-white/50 backdrop-blur-sm"
      >
        <ToolsPanel
          tool={tool}
          setTool={setTool}
          color={color}
          setColor={setColor}
          showColorPicker={showColorPicker}
          setShowColorPicker={setShowColorPicker}
          brushSize={brushSize}
          setBrushSize={setBrushSize}
          textSize={textSize}
          setTextSize={setTextSize}
          textColor={textColor}
          setTextColor={setTextColor}
          showTextColorPicker={showTextColorPicker}
          setShowTextColorPicker={setShowTextColorPicker}
          curvePoints={curvePoints}
          canvas={canvas}
          historyIndex={historyIndex}
          canvasHistory={canvasHistory}
          showBaseLayer={showBaseLayer}
          onToggleBaseLayer={() => setShowBaseLayer(!showBaseLayer)}
          onUploadImage={() => uploadImage(canvas!)}
          onDeleteSelected={() => deleteSelected(canvas!)}
          onUndo={undo}
          onRedo={redo}
          onClearCanvas={() => clearCanvas(canvas!)}
        />
      </motion.div>

      {/* Center - Canvas */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="flex-1 flex flex-col min-w-0 min-h-0 order-1 lg:order-none"
      >
        <CanvasArea canvasRef={canvasRef} />
      </motion.div>

      {/* Right Sidebar - Saved Traits + Save Controls */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="w-full lg:w-80 flex-shrink-0 p-2 lg:p-4 border-t lg:border-t-0 lg:border-l border-gray-200 bg-white/50 backdrop-blur-sm flex flex-col gap-4 order-2 lg:order-none"
      >
        <SavedTraitsPanel
          savedTraits={savedTraits}
          traitToDelete={traitToDelete}
          setTraitToDelete={setTraitToDelete}
          onToggleTrait={handleToggleTrait}
          onDownloadTrait={downloadIndividualTrait}
          onDeleteTrait={handleDeleteTrait}
        />
        
        <SaveControls
          traitName={traitName}
          setTraitName={setTraitName}
          downloadMode={downloadMode}
          setDownloadMode={setDownloadMode}
          onSaveTrait={handleSaveTrait}
          onDownloadTrait={handleDownloadTrait}
        />
      </motion.div>
    </div>
  );
};

export default CreateTraits;