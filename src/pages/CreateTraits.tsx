import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fabric } from 'fabric';
import { baseCharacterImage } from '@/data/traits';
import { ToolType } from '../types/traits';
import { 
  calculateCanvasSize, 
  setupBaseImage, 
  updateBaseImageScale, 
  updateLoadedTraitsScale,
  ensureProperLayering,
  safeRenderAll
} from '../utils/canvasUtils';
import { UndoRedoManager } from '../utils/undoRedoManager';
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
  
  // Undo/Redo manager
  const [undoRedoManager, setUndoRedoManager] = useState<UndoRedoManager | null>(null);
  
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

    const canvasSize = 1000;

    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width: canvasSize,
      height: canvasSize,
      backgroundColor: 'white',
      selection: tool === 'select'
    });

    // Load base character image
    setupBaseImage(fabricCanvas, baseCharacterImage, (img) => {
      setBaseImage(img);
      
      // Initialize undo/redo manager
      const manager = new UndoRedoManager(fabricCanvas);
      manager.initialize();
      setUndoRedoManager(manager);
      
      setTimeout(() => {
        manager.saveState();
      }, 100);
    });

    setCanvas(fabricCanvas);

    return () => {
      fabricCanvas.dispose();
    };
  }, []);

  // Setup canvas event handlers for undo/redo
  useEffect(() => {
    if (!canvas || !undoRedoManager) return;

    const saveStateDelayed = (description?: string) => {
      setTimeout(() => {
        if (undoRedoManager && !undoRedoManager.isProcessing) {
          undoRedoManager.saveState(description);
        }
      }, 200);
    };

    canvas.on('text:editing:entered', () => {
      canvas.selection = false;
    });
    
    canvas.on('text:editing:exited', () => {
      canvas.selection = tool === 'select';
      saveStateDelayed('Text edited');
    });
    
    canvas.on('object:added', () => {
      ensureProperLayering(canvas);
      saveStateDelayed('Object added');
    });
    
    canvas.on('object:removed', () => {
      saveStateDelayed('Object removed');
    });
    
    canvas.on('object:modified', () => {
      saveStateDelayed('Object modified');
    });
    
    canvas.on('path:created', () => {
      ensureProperLayering(canvas);
      saveStateDelayed('Path created');
    });

    return () => {
      canvas.off('text:editing:entered');
      canvas.off('text:editing:exited');
      canvas.off('object:added');
      canvas.off('object:removed');
      canvas.off('object:modified');
      canvas.off('path:created');
    };
  }, [canvas, undoRedoManager, tool]);

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
    return setupClipboardHandlers(canvas, setTool);
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

    // Disable selection for drawing tools (brush, eraser, fill)
    canvas.selection = tool === 'select';
    canvas.isDrawingMode = tool === 'brush' || tool === 'eraser';
    
    if (tool === 'brush' || tool === 'eraser') {
      canvas.freeDrawingBrush.width = brushSize;
      if (tool === 'brush') {
        canvas.freeDrawingBrush.color = color;
        // Reset to normal drawing mode
        (canvas.freeDrawingBrush as any).globalCompositeOperation = 'source-over';
      } else if (tool === 'eraser') {
        // Set eraser to actually erase pixels
        canvas.freeDrawingBrush.color = 'rgba(255,255,255,1)';
        (canvas.freeDrawingBrush as any).globalCompositeOperation = 'destination-out';
      }
    }

    // Set appropriate cursors and disable object interaction for certain tools
    switch (tool) {
      case 'select':
        canvas.defaultCursor = 'default';
        // Enable object selection and interaction
        canvas.forEachObject(obj => {
          if (obj.name !== 'baseImage' && !obj.name?.startsWith('trait-') && obj.name !== 'fillLayer') {
            obj.selectable = true;
            obj.evented = true;
          }
        });
        break;
      case 'brush':
      case 'eraser':
      case 'fill':
        canvas.defaultCursor = 'crosshair';
        // Disable object selection and interaction for drawing tools
        canvas.discardActiveObject();
        canvas.forEachObject(obj => {
          if (obj.name !== 'baseImage' && !obj.name?.startsWith('trait-') && obj.name !== 'fillLayer') {
            obj.selectable = false;
            obj.evented = false;
          }
        });
        break;
      case 'text':
        canvas.defaultCursor = 'text';
        // Enable limited interaction for text tool
        canvas.forEachObject(obj => {
          if (obj.name !== 'baseImage' && !obj.name?.startsWith('trait-') && obj.name !== 'fillLayer') {
            obj.selectable = obj.type === 'i-text' || obj.type === 'text';
            obj.evented = obj.type === 'i-text' || obj.type === 'text';
          }
        });
        break;
      case 'curve':
        canvas.defaultCursor = 'crosshair';
        // Enable object selection for curve tool (to select control points)
        canvas.forEachObject(obj => {
          if (obj.name !== 'baseImage' && !obj.name?.startsWith('trait-') && obj.name !== 'fillLayer') {
            obj.selectable = true;
            obj.evented = true;
          }
        });
        break;
      default:
        canvas.defaultCursor = 'crosshair';
        // Enable object selection for other tools
        canvas.forEachObject(obj => {
          if (obj.name !== 'baseImage' && !obj.name?.startsWith('trait-') && obj.name !== 'fillLayer') {
            obj.selectable = true;
            obj.evented = true;
          }
        });
    }
    
    safeRenderAll(canvas);
  }, [tool, canvas, brushSize, color]);

  // Update base image visibility
  useEffect(() => {
    if (!baseImage || !canvas) return;
    baseImage.set({ opacity: showBaseLayer ? 1 : 0.2 });
    safeRenderAll(canvas);
  }, [showBaseLayer, baseImage, canvas]);

  const undo = async () => {
    if (undoRedoManager) {
      await undoRedoManager.undo();
    }
  };

  const redo = async () => {
    if (undoRedoManager) {
      await undoRedoManager.redo();
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
    <div className="h-[calc(100vh-56px)] flex-grow bg-gradient-to-br from-gray-50 to-gray-100 w-full min-h-0 flex flex-col lg:flex-row">
      {/* Left Sidebar - Tools */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="w-full lg:w-80 flex-shrink-0 p-4 border-b lg:border-b-0 lg:border-r border-gray-200 bg-white/50 backdrop-blur-sm"
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
          undoRedoManager={undoRedoManager}
          showBaseLayer={showBaseLayer}
          canvas={canvas}
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
        className="flex-1 flex flex-col min-w-0 order-1 lg:order-none"
      >
        <CanvasArea canvasRef={canvasRef} />
      </motion.div>

      {/* Right Sidebar - Saved Traits + Save Controls */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="w-full lg:w-80 flex-shrink-0 p-4 border-t lg:border-t-0 lg:border-l border-gray-200 bg-white/50 backdrop-blur-sm flex flex-col gap-4 order-2 lg:order-none"
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