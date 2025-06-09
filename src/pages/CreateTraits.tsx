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

    // Calculate canvas size based on container
    const calculateCanvasSize = () => {
      const container = canvasRef.current?.parentElement;
      if (!container) return 400;
      
      const containerWidth = container.clientWidth - 32; // Account for padding
      const containerHeight = window.innerHeight * 0.6; // Max 60% of viewport height
      const maxSize = Math.min(containerWidth, containerHeight, 600); // Cap at 600px
      return Math.max(300, maxSize); // Minimum 300px
    };

    const canvasSize = calculateCanvasSize();

    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width: canvasSize,
      height: canvasSize,
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
    // Handle text editing events
    fabricCanvas.on('text:editing:entered', () => {
      // Disable canvas selection while editing text
      fabricCanvas.selection = false;
    });
    
    fabricCanvas.on('text:editing:exited', () => {
      // Re-enable canvas selection after editing text
      fabricCanvas.selection = tool === 'select';
      saveCanvasState();
    });
    
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

  // Separate useEffect to handle canvas click events with current tool state
  useEffect(() => {
    if (!canvas) return;

    const handleCanvasClick = (e: fabric.IEvent) => {
      // Only handle clicks for drawing tools (not select or brush)
      if (tool === 'select' || tool === 'brush') return;

      // Get the pointer position relative to the canvas
      const pointer = canvas.getPointer(e.e as MouseEvent);
      
      switch (tool) {
        case 'text':
          addText(pointer.x, pointer.y, canvas);
          break;
        case 'rectangle':
          addRectangle(pointer.x, pointer.y, canvas);
          break;
        case 'circle':
          addCircle(pointer.x, pointer.y, canvas);
          break;
        case 'line':
          addLine(pointer.x, pointer.y, canvas);
          break;
      }
    };

    // Attach click handler
    canvas.on('mouse:down', handleCanvasClick);

    // Cleanup function to remove the event listener
    return () => {
      canvas.off('mouse:down', handleCanvasClick);
    };
  }, [canvas, tool]); // Re-run when canvas or tool changes

  // Separate useEffect for handling window resize with proper dependencies
  useEffect(() => {
    if (!canvas) return;

    const calculateCanvasSize = () => {
      const container = canvasRef.current?.parentElement;
      if (!container) return 400;
      
      const containerWidth = container.clientWidth - 32; // Account for padding
      const containerHeight = window.innerHeight * 0.6; // Max 60% of viewport height
      const maxSize = Math.min(containerWidth, containerHeight, 600); // Cap at 600px
      return Math.max(300, maxSize); // Minimum 300px
    };

    const handleResize = () => {
      const newSize = calculateCanvasSize();
      canvas.setDimensions({ width: newSize, height: newSize });
      
      // Update base image scaling when canvas resizes
      if (baseImage) {
        // Get the original image dimensions (not the current scaled dimensions)
        const originalWidth = baseImage.getOriginalSize().width;
        const originalHeight = baseImage.getOriginalSize().height;
        
        const scale = Math.min(
          canvas.width! / originalWidth,
          canvas.height! / originalHeight
        ) * 0.7;
        
        baseImage.set({
          left: canvas.width! / 2,
          top: canvas.height! / 2,
          scaleX: scale,
          scaleY: scale
        });
      }
      
      // Update any loaded saved traits scaling
      loadedTraits.forEach((traitObject) => {
        const canvasWidth = canvas.width!;
        const canvasHeight = canvas.height!;
        
        // Get the original image dimensions for saved traits
        const originalWidth = traitObject.getOriginalSize().width;
        const originalHeight = traitObject.getOriginalSize().height;
        const scaleX = canvasWidth / originalWidth;
        const scaleY = canvasHeight / originalHeight;
        
        traitObject.set({
          left: 0,
          top: 0,
          scaleX: scaleX,
          scaleY: scaleY
        });
      });
      
      canvas.renderAll();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [canvas, baseImage, loadedTraits]);
  // Update canvas when tool changes
  useEffect(() => {
    if (!canvas) return;

    canvas.selection = tool === 'select';
    canvas.isDrawingMode = tool === 'brush';
    
    if (tool === 'brush') {
      canvas.freeDrawingBrush.width = brushSize;
      canvas.freeDrawingBrush.color = color;
    }

    // Set appropriate cursor for each tool
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
      default:
        canvas.defaultCursor = 'crosshair';
    }
  }, [tool, canvas, brushSize, color]);

  // Update base image visibility
  useEffect(() => {
    if (!baseImage || !canvas) return;
    baseImage.set({ opacity: showBaseLayer ? 1 : 0.2 });
    canvas.renderAll();
  }, [showBaseLayer, baseImage, canvas]);

  const handleCanvasClick = (e: fabric.IEvent, fabricCanvas: fabric.Canvas) => {
    if (!fabricCanvas) return;
    
    // Only handle clicks for drawing tools (not select or brush)
    if (tool === 'select' || tool === 'brush') return;

    // Get the pointer position relative to the canvas
    const pointer = fabricCanvas.getPointer(e.e as MouseEvent);
    
    switch (tool) {
      case 'text':
        addText(pointer.x, pointer.y, fabricCanvas);
        break;
      case 'rectangle':
        addRectangle(pointer.x, pointer.y, fabricCanvas);
        break;
      case 'circle':
        addCircle(pointer.x, pointer.y, fabricCanvas);
        break;
      case 'line':
        addLine(pointer.x, pointer.y, fabricCanvas);
        break;
    }
  };

  const addText = (x: number, y: number, fabricCanvas: fabric.Canvas) => {
    
    const text = new fabric.IText('Double click to edit', {
      left: x,
      top: y,
      fontSize: textSize,
      fill: textColor,
      fontFamily: 'Inter, Arial, sans-serif',
      editable: true,
      cornerStyle: 'circle',
      cornerColor: '#4F46E5',
      cornerSize: 8,
      transparentCorners: false,
      borderColor: '#4F46E5',
      editingBorderColor: '#4F46E5',
      originX: 'left',
      originY: 'top'
    });
    
    fabricCanvas.add(text);
    
    // Ensure new objects are above saved traits
    fabricCanvas.bringToFront(text);
    
    fabricCanvas.setActiveObject(text);
    fabricCanvas.renderAll();
    
    // Enter editing mode immediately
    setTimeout(() => {
      if ('enterEditing' in text && typeof text.enterEditing === 'function') {
        text.enterEditing();
        if ('selectAll' in text && typeof text.selectAll === 'function') {
          text.selectAll();
        }
      }
    }, 50);
    
    // Switch back to select tool after adding text
    setTool('select');
  };

  const addRectangle = (x: number, y: number, fabricCanvas: fabric.Canvas) => {
    
    const rect = new fabric.Rect({
      left: x - 50,
      top: y - 25,
      width: 100,
      height: 50,
      fill: color,
      stroke: '#333',
      strokeWidth: 1,
      cornerStyle: 'circle',
      cornerColor: '#4F46E5',
      cornerSize: 8,
      transparentCorners: false,
      borderColor: '#4F46E5'
    });
    
    fabricCanvas.add(rect);
    
    // Ensure new objects are above saved traits
    fabricCanvas.bringToFront(rect);
    
    fabricCanvas.setActiveObject(rect);
    fabricCanvas.renderAll();
    setTool('select');
  };

  const addCircle = (x: number, y: number, fabricCanvas: fabric.Canvas) => {
    
    const circle = new fabric.Circle({
      left: x - 25,
      top: y - 25,
      radius: 25,
      fill: color,
      stroke: '#333',
      strokeWidth: 1,
      cornerStyle: 'circle',
      cornerColor: '#4F46E5',
      cornerSize: 8,
      transparentCorners: false,
      borderColor: '#4F46E5'
    });
    
    fabricCanvas.add(circle);
    
    // Ensure new objects are above saved traits
    fabricCanvas.bringToFront(circle);
    
    fabricCanvas.setActiveObject(circle);
    fabricCanvas.renderAll();
    setTool('select');
  };

  const addLine = (x: number, y: number, fabricCanvas: fabric.Canvas) => {
    
    const line = new fabric.Line([x, y, x + 100, y], {
      stroke: color,
      strokeWidth: brushSize,
      selectable: true,
      cornerStyle: 'circle',
      cornerColor: '#4F46E5',
      cornerSize: 8,
      transparentCorners: false,
      borderColor: '#4F46E5'
    });
    
    fabricCanvas.add(line);
    
    // Ensure new objects are above saved traits
    fabricCanvas.bringToFront(line);
    
    fabricCanvas.setActiveObject(line);
    fabricCanvas.renderAll();
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
    
    // Get all objects except base image and saved traits
    const objectsToRemove = canvas.getObjects().filter(obj => 
      obj.name !== 'baseImage' && !obj.name?.startsWith('trait-')
    );
    
    objectsToRemove.forEach(obj => {
        canvas.remove(obj);
    });
    
    canvas.discardActiveObject();
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
                        onClick={() => toggleTrait(trait)}
                      >
                        <img
                          src={trait.data}
                          alt={trait.name}
                          className={`w-8 h-8 object-cover rounded ${
                