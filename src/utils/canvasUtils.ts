import { fabric } from 'fabric';

export interface CanvasState {
  objects: unknown[];
  timestamp: number;
}

export const BASE_IMAGE_SCALE_MULTIPLIER = 1.4;

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
  if (!container) {
    // Fallback based on window size - ensure square canvas
    const width = window.innerWidth;
    const height = window.innerHeight;
    const availableSize = Math.min(width, height);
    
    if (width < 768) {
      // On mobile, use most of the available space but ensure it's square
      return Math.min(availableSize * 0.8, 400);
    } else if (width < 1024) {
      return Math.min(availableSize * 0.7, 600);
    } else {
      return Math.min(availableSize * 0.6, 800);
    }
  }
  
  // Calculate based on available container space
  const containerWidth = container.clientWidth - 64; // Account for padding
  const containerHeight = container.clientHeight - 64;
  
  // For mobile layout (single column), we need to account for the fact that
  // the canvas container shares vertical space with other elements
  const isMobile = window.innerWidth < 1024; // lg breakpoint
  
  let availableSize;
  if (isMobile) {
    // On mobile, prioritize fitting within the viewport width
    // and limit height to ensure it doesn't overflow
    const maxHeight = Math.min(containerHeight, window.innerHeight * 0.4);
    availableSize = Math.min(containerWidth, maxHeight);
  } else {
    // On desktop, use the smaller of width/height as before
    availableSize = Math.min(containerWidth, containerHeight);
  }
  
  // Set reasonable min/max bounds
  const minSize = isMobile ? 300 : 500;
  const maxSize = isMobile ? 500 : 1200;
  
  return Math.max(minSize, Math.min(maxSize, availableSize));
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
    ) * BASE_IMAGE_SCALE_MULTIPLIER;
    
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
  ) * BASE_IMAGE_SCALE_MULTIPLIER;
  
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
  setHistoryIndex: (callback: (prev: number) => number) => void,
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
  
  if (state.objects.length > 0) {
    fabric.util.enlivenObjects(state.objects, (objects: fabric.Object[]) => {
      objects.forEach(obj => {
        canvas.add(obj);
      });
      safeRenderAll(canvas);
    }, 'fabric');
  }
  
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