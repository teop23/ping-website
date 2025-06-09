import { fabric } from 'fabric';

export interface CanvasState {
  objects: any[];
  timestamp: number;
}

// Safe canvas rendering with error handling
export const safeRenderAll = (canvas: fabric.Canvas) => {
  try {
    if (canvas && canvas.getContext && canvas.getContext()) {
      canvas.renderAll();
    }
  } catch (error) {
    console.warn('Canvas render error:', error);
    // Attempt to recover by re-initializing the canvas context
    try {
      canvas.calcOffset();
      canvas.renderAll();
    } catch (retryError) {
      console.error('Failed to recover canvas:', retryError);
    }
  }
};

export const calculateCanvasSize = (container?: HTMLElement | null): number => {
  if (!container) return 400;
  
  const containerWidth = container.clientWidth - 32; // Account for padding
  const containerHeight = window.innerHeight * 0.6; // Max 60% of viewport height
  const maxSize = Math.min(containerWidth, containerHeight, 600); // Cap at 600px
  return Math.max(300, maxSize); // Minimum 300px
};

export const setupBaseImage = (
  canvas: fabric.Canvas,
  imageSrc: string,
  onImageLoaded: (img: fabric.Image) => void
) => {
  // Ensure canvas is ready before proceeding
  if (!canvas || !canvas.getContext() || !canvas.width || !canvas.height) {
    console.warn('Canvas not ready for image loading');
    return;
  }

  fabric.Image.fromURL(imageSrc, (img) => {
    // Double-check canvas is still valid when image loads
    if (!canvas || !canvas.getContext()) {
      console.warn('Canvas became invalid during image loading');
      return;
    }

    const scale = Math.min(
      canvas.width! / img.width!,
      canvas.height! / img.height!
    ) * 0.7;
    
    img.set({
      left: canvas.width! / 2,
      top: canvas.height! / 2,
      originX: 'center',
      originY: 'center',
      scaleX: scale,
      scaleY: scale,
      selectable: false,
      evented: false,
      name: 'baseImage'
    });
    
    // Use requestAnimationFrame to ensure canvas is ready for operations
    requestAnimationFrame(() => {
      try {
        canvas.add(img);
        canvas.sendToBack(img);
        canvas.renderAll();
        onImageLoaded(img);
      } catch (error) {
        console.warn('Error adding base image to canvas:', error);
      }
    });
  });
};

export const updateBaseImageScale = (
  canvas: fabric.Canvas,
  baseImage: fabric.Image
) => {
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
};

export const updateLoadedTraitsScale = (
  canvas: fabric.Canvas,
  loadedTraits: Map<string, fabric.Image>
) => {
  loadedTraits.forEach((traitObject) => {
    const canvasWidth = canvas.width!;
    const canvasHeight = canvas.height!;
    
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
};

export const saveCanvasState = (
  canvas: fabric.Canvas,
  canvasHistory: CanvasState[],
  historyIndex: number,
  setCanvasHistory: (history: CanvasState[]) => void,
  setHistoryIndex: (index: number) => void,
  isUndoing: boolean,
  isRedoing: boolean
) => {
  if (!canvas || isUndoing || isRedoing) return;
  
  const objects = canvas.getObjects().filter(obj => obj.name !== 'baseImage');
  const state: CanvasState = {
    objects: objects.map(obj => obj.toObject()),
    timestamp: Date.now()
  };
  
  const newHistory = canvasHistory.slice(0, historyIndex + 1);
  newHistory.push(state);
  
  if (newHistory.length > 50) {
    newHistory.shift();
  } else {
    setHistoryIndex(prev => prev + 1);
  }
  
  setCanvasHistory(newHistory);
};

export const restoreCanvasState = (
  canvas: fabric.Canvas,
  state: CanvasState,
  setIsUndoing: (value: boolean) => void
) => {
  if (!canvas) return;
  
  setIsUndoing(true);
  
  const objects = canvas.getObjects();
  objects.forEach(obj => {
    if (obj.name !== 'baseImage') {
      canvas.remove(obj);
    }
  });
  
  state.objects.forEach(objData => {
    fabric.util.enlivenObjects([objData], (objects: fabric.Object[]) => {
      objects.forEach(obj => {
        canvas.add(obj);
      });
      safeRenderAll(canvas);
    });
  });
  
  setTimeout(() => setIsUndoing(false), 100);
};

export const ensureProperLayering = (canvas: fabric.Canvas) => {
  setTimeout(() => {
    const allObjects = canvas.getObjects();
    allObjects.forEach(obj => {
      if (obj.name !== 'baseImage' && !obj.name?.startsWith('trait-')) {
        canvas.bringToFront(obj);
      }
    });
    safeRenderAll(canvas);
  }, 50);
};