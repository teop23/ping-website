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
  MousePointer
} from 'lucide-react';
import { fabric } from 'fabric';
import pingImage from '../assets/images/ping.png';

interface SavedTrait {
  id: string;
  name: string;
  data: string;
  timestamp: number;
  isVisible: boolean;
  fabricObject?: fabric.Image;
}

interface CanvasState {
  objects: any[];
  timestamp: number;
}

const CreateTraits: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [baseImage, setBaseImage] = useState<fabric.Image | null>(null);
  const [showBaseLayer, setShowBaseLayer] = useState(true);
  const [tool, setTool] = useState<'select' | 'brush' | 'text' | 'rectangle' | 'circle' | 'line'>('select');
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

  // Save canvas state to history
  const saveCanvasState = () => {
    if (!canvas || isUndoing || isRedoing) return;
    
    const objects = canvas.getObjects().filter(obj => obj.name !== 'baseImage');
    const state: CanvasState = {
      objects: objects.map(obj => obj.toObject()),
      timestamp: Date.now()
    };
    
    // Remove any states after current index (when we're in the middle of history)
    const newHistory = canvasHistory.slice(0, historyIndex + 1);
    newHistory.push(state);
    
    // Limit history to 50 states
    if (newHistory.length > 50) {
      newHistory.shift();
    } else {
      setHistoryIndex(prev => prev + 1);
    }
    
    setCanvasHistory(newHistory);
  };

  // Restore canvas state from history
  const restoreCanvasState = (state: CanvasState) => {
    if (!canvas) return;
    
    setIsUndoing(true);
    
    // Clear all objects except base image
    const objects = canvas.getObjects();
    objects.forEach(obj => {
      if (obj.name !== 'baseImage') {
        canvas.remove(obj);
      }
    });
    
    // Restore objects from state
    state.objects.forEach(objData => {
      fabric.util.enlivenObjects([objData], (objects: fabric.Object[]) => {
        objects.forEach(obj => {
          canvas.add(obj);
        });
        canvas.renderAll();
      });
    });
    
    setTimeout(() => setIsUndoing(false), 100);
  };

  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width: 600,
      height: 600,
      backgroundColor: 'white',
      selection: tool === 'select'
    });

    // Load base character image
    fabric.Image.fromURL(pingImage, (img) => {
      const scale = Math.min(
        fabricCanvas.width! / img.width!,
        fabricCanvas.height! / img.height!
      ) * 0.7;
      
      img.set({
        left: fabricCanvas.width! / 2,
        top: fabricCanvas.height! / 2,
        originX: 'center',
        originY: 'center',
        scaleX: scale,
        scaleY: scale,
        selectable: false,
        evented: false,
        name: 'baseImage'
      });
      
      setBaseImage(img);
      fabricCanvas.add(img);
      fabricCanvas.sendToBack(img);
      fabricCanvas.renderAll();
      
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
    fabricCanvas.on('mouse:down', handleCanvasClick);
    fabricCanvas.on('object:added', () => {
      // Maintain proper layering when objects are added
      setTimeout(() => {
        const allObjects = fabricCanvas.getObjects();
        allObjects.forEach(obj => {
          if (obj.name !== 'baseImage' && !obj.name?.startsWith('trait-')) {
            fabricCanvas.bringToFront(obj);
          }
        });
        fabricCanvas.renderAll();
      }, 50);
      setTimeout(saveCanvasState, 100);
    });
    fabricCanvas.on('object:removed', () => {
      setTimeout(saveCanvasState, 100);
    });
    fabricCanvas.on('object:modified', () => {
      setTimeout(saveCanvasState, 100);
    });
    fabricCanvas.on('path:created', () => {
      // Ensure brush strokes are above saved traits
      setTimeout(() => {
        const allObjects = fabricCanvas.getObjects();
        const lastObject = allObjects[allObjects.length - 1];
        if (lastObject && lastObject.name !== 'baseImage' && !lastObject.name?.startsWith('trait-')) {
          fabricCanvas.bringToFront(lastObject);
        }
        fabricCanvas.renderAll();
      }, 50);
      setTimeout(saveCanvasState, 100);
    });

    setCanvas(fabricCanvas);

    return () => {
      fabricCanvas.dispose();
    };
  }, []);

  // Update canvas when tool changes
  useEffect(() => {
    if (!canvas) return;

    canvas.selection = tool === 'select';
    canvas.isDrawingMode = tool === 'brush';
    
    if (tool === 'brush') {
      canvas.freeDrawingBrush.width = brushSize;
      canvas.freeDrawingBrush.color = color;
    }

    canvas.defaultCursor = tool === 'select' ? 'default' : 'crosshair';
  }, [tool, canvas, brushSize, color]);

  // Update base image visibility
  useEffect(() => {
    if (!baseImage || !canvas) return;
    baseImage.set({ opacity: showBaseLayer ? 1 : 0.2 });
    canvas.renderAll();
  }, [showBaseLayer, baseImage, canvas]);

  const handleCanvasClick = (e: fabric.IEvent) => {
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
      case 'line':
        addLine(pointer.x, pointer.y);
        break;
    }
  };

  const addText = (x: number, y: number) => {
    if (!canvas) return;
    
    const text = new fabric.IText('Edit me', {
      left: x,
      top: y,
      fontSize: textSize,
      fill: textColor,
      fontFamily: 'Arial',
      editable: true
    });
    
    canvas.add(text);
    
    // Ensure new objects are above saved traits
    canvas.bringToFront(text);
    
    canvas.setActiveObject(text);
    canvas.renderAll();
    setTool('select');
  };

  const addRectangle = (x: number, y: number) => {
    if (!canvas) return;
    
    const rect = new fabric.Rect({
      left: x - 50,
      top: y - 25,
      width: 100,
      height: 50,
      fill: color,
      stroke: color,
      strokeWidth: 2
    });
    
    canvas.add(rect);
    
    // Ensure new objects are above saved traits
    canvas.bringToFront(rect);
    
    canvas.setActiveObject(rect);
    canvas.renderAll();
    setTool('select');
  };

  const addCircle = (x: number, y: number) => {
    if (!canvas) return;
    
    const circle = new fabric.Circle({
      left: x - 25,
      top: y - 25,
      radius: 25,
      fill: color,
      stroke: color,
      strokeWidth: 2
    });
    
    canvas.add(circle);
    
    // Ensure new objects are above saved traits
    canvas.bringToFront(circle);
    
    canvas.setActiveObject(circle);
    canvas.renderAll();
    setTool('select');
  };

  const addLine = (x: number, y: number) => {
    if (!canvas) return;
    
    const line = new fabric.Line([x, y, x + 100, y], {
      stroke: color,
      strokeWidth: brushSize,
      selectable: true
    });
    
    canvas.add(line);
    
    // Ensure new objects are above saved traits
    canvas.bringToFront(line);
    
    canvas.setActiveObject(line);
    canvas.renderAll();
    setTool('select');
  };

  const deleteSelected = () => {
    if (!canvas) return;
    
    const activeObjects = canvas.getActiveObjects();
    activeObjects.forEach(obj => {
      if (obj.name !== 'baseImage') {
        canvas.remove(obj);
      }
    });
    canvas.discardActiveObject();
    canvas.renderAll();
  };

  const clearCanvas = () => {
    if (!canvas) return;
    
    const objects = canvas.getObjects();
    objects.forEach(obj => {
      if (obj.name !== 'baseImage') {
        canvas.remove(obj);
      }
    });
    canvas.renderAll();
  };

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      restoreCanvasState(canvasHistory[newIndex]);
    }
  };

  const redo = () => {
    if (historyIndex < canvasHistory.length - 1) {
      setIsRedoing(true);
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      restoreCanvasState(canvasHistory[newIndex]);
      setTimeout(() => setIsRedoing(false), 100);
    }
  };

  const uploadImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file && canvas) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imgSrc = e.target?.result as string;
          fabric.Image.fromURL(imgSrc, (img) => {
            img.set({
              left: canvas.width! / 2,
              top: canvas.height! / 2,
              originX: 'center',
              originY: 'center',
              scaleX: 0.3,
              scaleY: 0.3
            });
            canvas.add(img);
            
            // Ensure uploaded images are above saved traits
            canvas.bringToFront(img);
            
            canvas.setActiveObject(img);
            canvas.renderAll();
          });
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const downloadTrait = () => {
    if (!canvas) return;

    if (downloadMode === 'trait') {
      // Download only the current drawings/objects (trait mode)
      const originalOpacity = baseImage?.opacity;
      if (baseImage) {
        baseImage.set({ opacity: 0 });
        canvas.renderAll();
      }

      // Hide any loaded saved traits to only export current work
      const hiddenTraits: { object: fabric.Image; originalVisibility: boolean }[] = [];
      loadedTraits.forEach((traitObject) => {
        if (traitObject.visible) {
          hiddenTraits.push({ object: traitObject, originalVisibility: true });
          traitObject.set({ visible: false });
        }
      });
      
      // Set canvas background to transparent
      const originalBackground = canvas.backgroundColor;
      canvas.setBackgroundColor('transparent', () => {
        canvas.renderAll();
        
        const dataURL = canvas.toDataURL({
          format: 'png',
          quality: 1,
          withoutTransform: false,
          backgroundColor: 'transparent'
        });

        // Restore everything
        canvas.setBackgroundColor(originalBackground, () => {
          if (baseImage && originalOpacity !== undefined) {
            baseImage.set({ opacity: originalOpacity });
          }
          
          hiddenTraits.forEach(({ object, originalVisibility }) => {
            object.set({ visible: originalVisibility });
          });
          
          canvas.renderAll();
        });

        const link = document.createElement('a');
        link.download = `${traitName || 'ping-trait'}.png`;
        link.href = dataURL;
        link.click();
      });
    } else {
      // Download full character (character mode)
      const dataURL = canvas.toDataURL({
        format: 'png',
        quality: 1,
        withoutTransform: false,
        backgroundColor: 'white'
      });

      const link = document.createElement('a');
      link.download = `${traitName || 'ping-character'}.png`;
      link.href = dataURL;
      link.click();
    }
  };

  const getDownloadButtonText = () => {
    return downloadMode === 'trait' ? 'Download Trait' : 'Download Character';
  };

  const getDownloadFileName = () => {
    if (downloadMode === 'trait') {
      return traitName || 'ping-trait';
    } else {
      return traitName ? `${traitName}-character` : 'ping-character';
    }
  };
        

  const saveTrait = () => {
    if (!canvas || !traitName.trim()) return;

    // Temporarily hide base image for saving (just like download)
    const originalOpacity = baseImage?.opacity;
    if (baseImage) {
      baseImage.set({ opacity: 0 });
      canvas.renderAll();
    }

    // Also temporarily hide any loaded saved traits to only save current work
    const hiddenTraits: { object: fabric.Image; originalVisibility: boolean }[] = [];
    loadedTraits.forEach((traitObject) => {
      if (traitObject.visible) {
        hiddenTraits.push({ object: traitObject, originalVisibility: true });
        traitObject.set({ visible: false });
      }
    });
    
    // Temporarily set canvas background to transparent
    const originalBackground = canvas.backgroundColor;
    canvas.setBackgroundColor('transparent', () => {
      canvas.renderAll();
      
      const dataURL = canvas.toDataURL({
        format: 'png',
        quality: 1,
        multiplier: 2,
        withoutTransform: false,
        backgroundColor: 'transparent'
      });

      // Restore canvas background
      canvas.setBackgroundColor(originalBackground, () => {
        // Restore base image
        if (baseImage && originalOpacity !== undefined) {
          baseImage.set({ opacity: originalOpacity });
        }
        
        // Restore saved traits visibility
        hiddenTraits.forEach(({ object, originalVisibility }) => {
          object.set({ visible: originalVisibility });
        });
        
        canvas.renderAll();
      });

      // Save the trait with transparent background
      const newTrait: SavedTrait = {
        id: Date.now().toString(),
        name: traitName.trim(),
        data: dataURL,
        timestamp: Date.now(),
        isVisible: false
      };

      const updatedTraits = [...savedTraits, newTrait];
      setSavedTraits(updatedTraits);
      localStorage.setItem('pingTraits', JSON.stringify(updatedTraits));
      setTraitName('');
    });
  };


  const deleteTrait = (id: string) => {
    // Remove from canvas if loaded
    const fabricObject = loadedTraits.get(id);
    if (fabricObject && canvas) {
      canvas.remove(fabricObject);
      canvas.renderAll();
    }
    
    // Remove from loaded traits map
    const newLoadedTraits = new Map(loadedTraits);
    newLoadedTraits.delete(id);
    setLoadedTraits(newLoadedTraits);
    
    // Remove from saved traits
    const updatedTraits = savedTraits.filter(trait => trait.id !== id);
    setSavedTraits(updatedTraits);
    localStorage.setItem('pingTraits', JSON.stringify(updatedTraits));
    
    // Close the confirmation dialog
    setTraitToDelete(null);
  };

  const confirmDeleteTrait = (id: string) => {
    setTraitToDelete(id);
  };

  const downloadIndividualTrait = (trait: SavedTrait) => {
    const link = document.createElement('a');
    link.download = `${trait.name}.png`;
    link.href = trait.data;
    link.click();
  };

  const toggleTrait = (trait: SavedTrait) => {
    if (!canvas) return;
    
    const existingObject = loadedTraits.get(trait.id);
    
    if (existingObject) {
      // Toggle visibility
      const newVisibility = !trait.isVisible;
      existingObject.set({ visible: newVisibility });
      
      // Update trait visibility state
      const updatedTraits = savedTraits.map(t => 
        t.id === trait.id ? { ...t, isVisible: newVisibility } : t
      );
      setSavedTraits(updatedTraits);
      localStorage.setItem('pingTraits', JSON.stringify(updatedTraits));
      
      canvas.renderAll();
    } else {
      // Load trait for the first time
      fabric.Image.fromURL(trait.data, (img) => {
        // Calculate the scale to match the canvas size
        const canvasWidth = canvas.width!;
        const canvasHeight = canvas.height!;
        const scaleX = canvasWidth / img.width!;
        const scaleY = canvasHeight / img.height!;
        
        img.set({
          left: 0,
          top: 0,
          originX: 'left',
          originY: 'top',
          scaleX: scaleX,
          scaleY: scaleY,
          selectable: false,
          evented: false,
          name: `trait-${trait.id}`,
          visible: true
        });
        
        canvas.add(img);
        
        // Ensure proper layering: base image at back, then saved traits, then drawings
        if (baseImage) {
          canvas.sendToBack(baseImage);
        }
        
        // Move all saved traits above base image but below drawings
        loadedTraits.forEach((traitObj) => {
          canvas.bringForward(traitObj, false);
        });
        canvas.bringForward(img, false);
        
        // Ensure any drawing objects stay on top
        const allObjects = canvas.getObjects();
        allObjects.forEach(obj => {
          if (obj.name !== 'baseImage' && !obj.name?.startsWith('trait-')) {
            canvas.bringToFront(obj);
          }
        });
        
        // Store reference to the fabric object
        const newLoadedTraits = new Map(loadedTraits);
        newLoadedTraits.set(trait.id, img);
        setLoadedTraits(newLoadedTraits);
        
        // Update trait visibility state
        const updatedTraits = savedTraits.map(t => 
          t.id === trait.id ? { ...t, isVisible: true } : t
        );
        setSavedTraits(updatedTraits);
        localStorage.setItem('pingTraits', JSON.stringify(updatedTraits));
        
        canvas.renderAll();
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Create PING Traits</h1>
          <p className="text-gray-600">Design custom traits for your PING character</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Saved Traits Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Card className="h-[600px]">
              <CardHeader>
                <h3 className="text-lg font-semibold">Saved Traits</h3>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-[500px] overflow-y-auto p-4 space-y-2">
                  {savedTraits.map((trait) => (
                    <div
                      key={trait.id}
                      className={`flex items-center p-3 rounded-lg transition-colors cursor-pointer ${
                        trait.isVisible 
                          ? 'bg-blue-50 border-2 border-blue-200 hover:bg-blue-100' 
                          : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                      }`}
                    >
                      <div 
                        className="flex items-center space-x-3 flex-1 min-w-0 cursor-pointer"
                        onClick={() => toggleTrait(trait)}
                      >
                        <img
                          src={trait.data}
                          alt={trait.name}
                          className={`w-8 h-8 object-cover rounded ${
                            trait.isVisible ? 'ring-2 ring-blue-400' : ''
                          }`}
                        />
                        <div className="flex flex-col min-w-0 flex-1">
                          <span className="text-sm font-medium truncate">{trait.name}</span>
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
                          className="h-8 w-8 text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Download size={16} />
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
                              className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 size={16} />
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
                                onClick={() => deleteTrait(trait.id)}
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
                      <p className="text-sm">Create and save your first trait! Click on saved traits to toggle visibility.</p>
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
          >
            <Card className="h-[600px] overflow-hidden">
              <CardHeader>
                <h3 className="text-lg font-semibold">Tools</h3>
              </CardHeader>
              <CardContent className="space-y-3 h-[520px] overflow-y-auto">
                {/* Tool Selection */}
                <div className="grid grid-cols-3 gap-1">
                  <ToolButton
                    icon={<MousePointer size={18} />}
                    label="Select"
                    active={tool === 'select'}
                    onClick={() => setTool('select')}
                  />
                  <ToolButton
                    icon={<Palette size={18} />}
                    label="Brush"
                    active={tool === 'brush'}
                    onClick={() => setTool('brush')}
                  />
                  <ToolButton
                    icon={<Type size={18} />}
                    label="Text"
                    active={tool === 'text'}
                    onClick={() => setTool('text')}
                  />
                  <ToolButton
                    icon={<Square size={18} />}
                    label="Rectangle"
                    active={tool === 'rectangle'}
                    onClick={() => setTool('rectangle')}
                  />
                  <ToolButton
                    icon={<Circle size={18} />}
                    label="Circle"
                    active={tool === 'circle'}
                    onClick={() => setTool('circle')}
                  />
                  <ToolButton
                    icon={<Minus size={18} />}
                    label="Line"
                    active={tool === 'line'}
                    onClick={() => setTool('line')}
                  />
                </div>

                {/* Color Picker */}
                <div className="space-y-1">
                  <label className="text-sm font-medium">Color</label>
                  <div className="relative">
                    <button
                      className="w-full h-8 rounded-md border-2 border-gray-200"
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
                {tool === 'brush' && (
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Brush Size: {brushSize}px</label>
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
                    <div className="space-y-1">
                      <label className="text-sm font-medium">Text Size: {textSize}px</label>
                      <input
                        type="range"
                        min="12"
                        max="72"
                        value={textSize}
                        onChange={(e) => setTextSize(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium">Text Color</label>
                      <div className="relative">
                        <button
                          className="w-full h-8 rounded border-2 border-gray-200"
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
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-1 pt-2 border-t">
                  <Button onClick={uploadImage} variant="outline" size="sm" className="w-full">
                    <Upload size={16} className="mr-2" />
                    Upload Image
                  </Button>
                  <div className="grid grid-cols-2 gap-1">
                    <Button onClick={deleteSelected} variant="outline" size="sm">
                    <Trash2 size={16} className="mr-2" />
                    Delete
                  </Button>
                    <Button 
                      onClick={undo} 
                      variant="outline" 
                      size="sm"
                      disabled={historyIndex <= 0}
                    >
                    <Undo size={16} className="mr-2" />
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
                    <RotateCw size={16} className="mr-2" />
                    Redo
                  </Button>
                  <Button onClick={clearCanvas} variant="outline" size="sm" className="w-full">
                    <RotateCw size={16} className="mr-2" />
                    Clear All
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Canvas */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="lg:col-span-2"
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Canvas</h3>
                <Button
                  variant="outline"
                  onClick={() => setShowBaseLayer(!showBaseLayer)}
                >
                  {showBaseLayer ? <EyeOff size={16} /> : <Eye size={16} />}
                  <span className="ml-2">{showBaseLayer ? 'Hide' : 'Show'} Base</span>
                </Button>
              </div>
              
              <div className="flex justify-center">
                <canvas
                  ref={canvasRef}
                  className="border-2 border-gray-200 rounded-lg shadow-sm"
                />
              </div>

              {/* Save Controls */}
              <div className="mt-6 space-y-3">
                {/* Section 1: Trait Name Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Trait Name</label>
                  <input
                    type="text"
                    value={traitName}
                    onChange={(e) => setTraitName(e.target.value)}
                    placeholder="Enter trait name..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Section 2: Save Trait */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Save</label>
                  <Button
                    onClick={saveTrait}
                    disabled={!traitName.trim()}
                    className="w-full"
                  >
                    <Save size={16} className="mr-2" />
                    Save Trait
                  </Button>
                </div>

                {/* Section 3: Download with Toggle */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Download</label>
                  
                  {/* Download Mode Toggle */}
                  <div className="flex items-center justify-center space-x-1 p-1 bg-gray-100 rounded-lg">
                    <button
                      onClick={() => setDownloadMode('trait')}
                      className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        downloadMode === 'trait'
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Trait Only
                    </button>
                    <button
                      onClick={() => setDownloadMode('character')}
                      className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        downloadMode === 'character'
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Full Character
                    </button>
                  </div>
                  
                  <Button
                    onClick={downloadTrait}
                    variant="outline"
                    className="w-full"
                  >
                    <Download size={16} className="mr-2" />
                    {getDownloadButtonText()}
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

interface ToolButtonProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}

const ToolButton: React.FC<ToolButtonProps> = ({ icon, label, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-2 rounded-lg border-2 transition-all ${
        active
          ? 'border-blue-500 bg-blue-50 text-blue-700'
          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
      }`}
    >
      {icon}
      <span className="text-[10px] mt-0.5 font-medium leading-tight">{label}</span>
    </button>
  );
};

export default CreateTraits;