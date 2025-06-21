import { fabric } from 'fabric';

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
      return Math.min(availableSize * 0.8, 350);
    } else if (width < 1024) {
      return Math.min(availableSize * 0.6, 450);
    } else {
      return Math.min(availableSize * 0.5, 500);
    }
  }
  
  // Calculate based on available container space with proper padding
  const containerWidth = container.clientWidth - 32; // Account for card padding
  const containerHeight = container.clientHeight - 32;
  
  // Use the smaller dimension to ensure square canvas fits
  const availableSize = Math.min(containerWidth, containerHeight);
  
  // Set reasonable min/max bounds based on screen size
  const minSize = window.innerWidth < 768 ? 250 : 300;
  const maxSize = window.innerWidth < 768 ? 350 : 500;
  
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