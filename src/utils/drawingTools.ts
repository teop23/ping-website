import { fabric } from 'fabric';
import { safeRenderAll } from './canvasUtils';

type ToolType = 'select' | 'brush' | 'text' | 'rectangle' | 'circle' | 'line' | 'curve' | 'fill';

// Fill tool implementation using flood fill algorithm
export const addFill = (
  x: number,
  y: number,
  canvas: fabric.Canvas,
  fillColor: string
) => {
  try {
    // Create a temporary canvas to get the current state
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;

    const canvasWidth = canvas.width!;
    const canvasHeight = canvas.height!;
    
    tempCanvas.width = canvasWidth;
    tempCanvas.height = canvasHeight;

    // Render the current canvas to the temporary canvas
    const canvasElement = canvas.getElement();
    tempCtx.drawImage(canvasElement, 0, 0);

    // Get image data from temporary canvas
    const imageData = tempCtx.getImageData(0, 0, canvasWidth, canvasHeight);
    const data = imageData.data;

    // Convert fill color to RGB
    const fillRGB = hexToRgb(fillColor);
    if (!fillRGB) return;

    // Get the color at the clicked position
    const targetColor = getPixelColor(data, x, y, canvasWidth);
    
    // Don't fill if clicking on the same color
    if (colorsEqual(targetColor, fillRGB)) return;

    // Perform flood fill
    floodFill(data, x, y, canvasWidth, canvasHeight, targetColor, fillRGB);

    // Put the modified image data back to temporary canvas
    tempCtx.putImageData(imageData, 0, 0);

    // Create a fabric image from the filled canvas and add it to the main canvas
    const dataURL = tempCanvas.toDataURL();
    fabric.Image.fromURL(dataURL, (img) => {
      // Remove any existing fill layers to avoid stacking
      const existingFillLayers = canvas.getObjects().filter(obj => obj.name === 'fillLayer');
      existingFillLayers.forEach(layer => canvas.remove(layer));

      img.set({
        left: 0,
        top: 0,
        selectable: false,
        evented: false,
        name: 'fillLayer',
        globalCompositeOperation: 'source-over'
      });

      canvas.add(img);
      
      // Ensure proper layering - keep base image at back, fill layer above it, but below other objects
      const baseImage = canvas.getObjects().find(obj => obj.name === 'baseImage');
      if (baseImage) {
        canvas.sendToBack(baseImage);
        canvas.bringForward(img, false);
      }
      
      safeRenderAll(canvas);
    });
  } catch (error) {
    console.error('Fill tool error:', error);
  }
};

// Helper function to convert hex color to RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

// Helper function to get pixel color at coordinates
function getPixelColor(data: Uint8ClampedArray, x: number, y: number, width: number): { r: number; g: number; b: number; a: number } {
  const index = (y * width + x) * 4;
  return {
    r: data[index],
    g: data[index + 1],
    b: data[index + 2],
    a: data[index + 3]
  };
}

// Helper function to set pixel color at coordinates
function setPixelColor(data: Uint8ClampedArray, x: number, y: number, width: number, color: { r: number; g: number; b: number }) {
  const index = (y * width + x) * 4;
  data[index] = color.r;
  data[index + 1] = color.g;
  data[index + 2] = color.b;
  // Keep original alpha
}

// Helper function to compare colors
function colorsEqual(color1: { r: number; g: number; b: number; a?: number }, color2: { r: number; g: number; b: number; a?: number }): boolean {
  return color1.r === color2.r && color1.g === color2.g && color1.b === color2.b;
}

// Flood fill algorithm implementation
function floodFill(
  data: Uint8ClampedArray,
  startX: number,
  startY: number,
  width: number,
  height: number,
  targetColor: { r: number; g: number; b: number; a: number },
  fillColor: { r: number; g: number; b: number }
) {
  const stack: { x: number; y: number }[] = [{ x: startX, y: startY }];
  const visited = new Set<string>();

  while (stack.length > 0) {
    const { x, y } = stack.pop()!;
    
    // Check bounds
    if (x < 0 || x >= width || y < 0 || y >= height) continue;
    
    // Check if already visited
    const key = `${x},${y}`;
    if (visited.has(key)) continue;
    visited.add(key);
    
    // Get current pixel color
    const currentColor = getPixelColor(data, x, y, width);
    
    // Check if pixel matches target color
    if (!colorsEqual(currentColor, targetColor)) continue;
    
    // Fill the pixel
    setPixelColor(data, x, y, width, fillColor);
    
    // Add neighboring pixels to stack
    stack.push({ x: x + 1, y });
    stack.push({ x: x - 1, y });
    stack.push({ x, y: y + 1 });
    stack.push({ x, y: y - 1 });
  }
}

export const addText = (
  x: number,
  y: number,
  canvas: fabric.Canvas,
  textSize: number,
  textColor: string,
  setTool: (tool: ToolType) => void
) => {
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
  
  canvas.add(text);
  canvas.bringToFront(text);
  canvas.setActiveObject(text);
  safeRenderAll(canvas);
  
  setTimeout(() => {
    if ('enterEditing' in text && typeof text.enterEditing === 'function') {
      text.enterEditing();
      if ('selectAll' in text && typeof text.selectAll === 'function') {
        text.selectAll();
      }
    }
  }, 50);
  
  setTool('select');
};

export const addRectangle = (
  x: number,
  y: number,
  canvas: fabric.Canvas,
  color: string,
  setTool: (tool: ToolType) => void
) => {
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
  
  canvas.add(rect);
  canvas.bringToFront(rect);
  canvas.setActiveObject(rect);
  safeRenderAll(canvas);
  setTool('select');
};

export const addCircle = (
  x: number,
  y: number,
  canvas: fabric.Canvas,
  color: string,
  setTool: (tool: ToolType) => void
) => {
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
  
  canvas.add(circle);
  canvas.bringToFront(circle);
  canvas.setActiveObject(circle);
  safeRenderAll(canvas);
  setTool('select');
};

export const addLine = (
  x: number,
  y: number,
  canvas: fabric.Canvas,
  color: string,
  brushSize: number,
  setTool: (tool: ToolType) => void
) => {
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
  
  canvas.add(line);
  canvas.bringToFront(line);
  canvas.setActiveObject(line);
  safeRenderAll(canvas);
  setTool('select');
};

// Helper functions for curve creation
function makeCurveControlPoint(left: number, top: number, curvePath: fabric.Path, isControlPoint: boolean = false) {
  const circle = new fabric.Circle({
    left: left,
    top: top,
    strokeWidth: isControlPoint ? 3 : 2,
    radius: isControlPoint ? 8 : 6,
    fill: isControlPoint ? '#F59E0B' : '#4F46E5',
    stroke: '#ffffff',
    originX: 'center',
    originY: 'center',
    hasBorders: false,
    hasControls: false,
    selectable: true,
    evented: true,
    hoverCursor: 'move',
    moveCursor: 'move',
    name: isControlPoint ? 'curveControlPoint' : 'curveEndPoint',
    opacity: 0 // Initially hidden
  });

  // Store reference to the curve path
  (circle as any).curvePath = curvePath;
  
  return circle;
}

function updateCurvePath(curvePath: fabric.Path, startPoint: fabric.Circle, controlPoint: fabric.Circle, endPoint: fabric.Circle) {
  const pathString = `M ${startPoint.left} ${startPoint.top} Q ${controlPoint.left} ${controlPoint.top} ${endPoint.left} ${endPoint.top}`;
  
  // Update the path data
  (curvePath as any).path = fabric.util.parsePath(pathString);
  curvePath._setPath(pathString);
  curvePath.setCoords();
}

export const addCurvedLine = (
  x: number,
  y: number,
  canvas: fabric.Canvas,
  color: string,
  strokeWidth: number,
  curvePoints: { x: number; y: number }[],
  setCurvePoints: (points: { x: number; y: number }[]) => void,
  tempCurveLine: fabric.Object | null,
  setTempCurveLine: (line: fabric.Object | null) => void,
  setTool: (tool: ToolType) => void
) => {
  const newPoints = [...curvePoints, { x, y }];
  setCurvePoints(newPoints);

  // Remove previous temporary elements
  if (tempCurveLine) {
    canvas.remove(tempCurveLine);
    setTempCurveLine(null);
  }

  if (newPoints.length === 1) {
    // First point - show start indicator
    const indicator = new fabric.Circle({
      left: x,
      top: y,
      radius: 6,
      fill: '#4F46E5',
      stroke: '#ffffff',
      strokeWidth: 2,
      originX: 'center',
      originY: 'center',
      selectable: false,
      evented: false,
      opacity: 0.8,
      name: 'tempCurvePoint'
    });
    
    canvas.add(indicator);
    canvas.bringToFront(indicator);
    setTempCurveLine(indicator);
    safeRenderAll(canvas);
  } else if (newPoints.length === 2) {
    // Second point - show preview line and both points
    const [start, control] = newPoints;
    
    const startIndicator = new fabric.Circle({
      left: start.x,
      top: start.y,
      radius: 6,
      fill: '#4F46E5',
      stroke: '#ffffff',
      strokeWidth: 2,
      originX: 'center',
      originY: 'center',
      selectable: false,
      evented: false,
      opacity: 0.8
    });

    const controlIndicator = new fabric.Circle({
      left: control.x,
      top: control.y,
      radius: 8,
      fill: '#F59E0B',
      stroke: '#ffffff',
      strokeWidth: 2,
      originX: 'center',
      originY: 'center',
      selectable: false,
      evented: false,
      opacity: 0.8
    });

    const previewLine = new fabric.Line([start.x, start.y, control.x, control.y], {
      stroke: '#9CA3AF',
      strokeWidth: 1,
      strokeDashArray: [3, 3],
      selectable: false,
      evented: false,
      opacity: 0.6
    });

    const tempGroup = new fabric.Group([previewLine, startIndicator, controlIndicator], {
      selectable: false,
      evented: false,
      name: 'tempCurveGroup'
    });
    
    canvas.add(tempGroup);
    canvas.bringToFront(tempGroup);
    setTempCurveLine(tempGroup);
    safeRenderAll(canvas);
  } else if (newPoints.length === 3) {
    // Third point - create the final editable curve
    const [start, control, end] = newPoints;
    
    // Create the curve path
    const pathString = `M ${start.x} ${start.y} Q ${control.x} ${control.y} ${end.x} ${end.y}`;
    const curvePath = new fabric.Path(pathString, {
      fill: '',
      stroke: color,
      strokeWidth: strokeWidth,
      selectable: false,
      evented: true,
      cornerStyle: 'circle',
      cornerColor: '#4F46E5',
      cornerSize: 8,
      transparentCorners: false,
      borderColor: '#4F46E5',
      name: 'editableCurvePath',
      objectCaching: false
    });

    // Create control points
    const startPoint = makeCurveControlPoint(start.x, start.y, curvePath, false);
    const controlPoint = makeCurveControlPoint(control.x, control.y, curvePath, true);
    const endPoint = makeCurveControlPoint(end.x, end.y, curvePath, false);

    // Set up the relationships
    (startPoint as any).isStartPoint = true;
    (endPoint as any).isEndPoint = true;
    (controlPoint as any).isControlPoint = true;

    // Store references to all control points in the curve path
    (curvePath as any).startPoint = startPoint;
    (curvePath as any).controlPoint = controlPoint;
    (curvePath as any).endPoint = endPoint;

    // Add all objects to canvas
    canvas.add(curvePath);
    canvas.add(startPoint);
    canvas.add(controlPoint);
    canvas.add(endPoint);

    // Set up event handlers for showing/hiding control points
    curvePath.on('selected', () => {
      startPoint.set({ opacity: 1, selectable: true });
      controlPoint.set({ opacity: 1, selectable: true });
      endPoint.set({ opacity: 1, selectable: true });
      safeRenderAll(canvas);
    });

    curvePath.on('deselected', () => {
      startPoint.set({ opacity: 0, selectable: false });
      controlPoint.set({ opacity: 0, selectable: false });
      endPoint.set({ opacity: 0, selectable: false });
      safeRenderAll(canvas);
    });

    // Make the curve path clickable but not movable
    curvePath.on('mousedown', () => {
      // Show control points when curve is clicked
      startPoint.set({ opacity: 1, selectable: true });
      controlPoint.set({ opacity: 1, selectable: true });
      endPoint.set({ opacity: 1, selectable: true });
      safeRenderAll(canvas);
    });

    // Set up event handlers for control point movement
    const setupControlPointMovement = (point: fabric.Circle) => {
      point.on('moving', () => {
        const curvePath = (point as any).curvePath;
        const startPoint = (curvePath as any).startPoint;
        const controlPoint = (curvePath as any).controlPoint;
        const endPoint = (curvePath as any).endPoint;
        
        updateCurvePath(curvePath, startPoint, controlPoint, endPoint);
        safeRenderAll(canvas);
      });

      // Hide control points when a control point is deselected
      point.on('deselected', () => {
        const curvePath = (point as any).curvePath;
        const startPoint = (curvePath as any).startPoint;
        const controlPoint = (curvePath as any).controlPoint;
        const endPoint = (curvePath as any).endPoint;
        
        // Check if any control point is still selected
        const activeObject = canvas.getActiveObject();
        if (activeObject !== startPoint && activeObject !== controlPoint && activeObject !== endPoint) {
          startPoint.set({ opacity: 0, selectable: false });
          controlPoint.set({ opacity: 0, selectable: false });
          endPoint.set({ opacity: 0, selectable: false });
          safeRenderAll(canvas);
        }
      });
    };

    setupControlPointMovement(startPoint);
    setupControlPointMovement(controlPoint);
    setupControlPointMovement(endPoint);

    // Show control points initially
    startPoint.set({ opacity: 1, selectable: true });
    controlPoint.set({ opacity: 1, selectable: true });
    endPoint.set({ opacity: 1, selectable: true });
    
    // Reset curve state
    setCurvePoints([]);
    setTempCurveLine(null);
    setTool('select');
    
    safeRenderAll(canvas);
  }
};

export const uploadImage = (canvas: fabric.Canvas) => {
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
          canvas.bringToFront(img);
          canvas.setActiveObject(img);
          safeRenderAll(canvas);
        });
      };
      reader.readAsDataURL(file);
    }
  };
  input.click();
};

export const deleteSelected = (canvas: fabric.Canvas) => {
  const activeObjects = canvas.getActiveObjects();
  activeObjects.forEach(obj => {
    if (obj.name !== 'baseImage') {
      // Check if it's a curve path and remove all related components
      if (obj.name === 'editableCurvePath') {
        const curvePath = obj as any;
        if (curvePath.startPoint) canvas.remove(curvePath.startPoint);
        if (curvePath.controlPoint) canvas.remove(curvePath.controlPoint);
        if (curvePath.endPoint) canvas.remove(curvePath.endPoint);
      }
      // Check if it's a control point and remove the entire curve
      else if (obj.name?.includes('curveControlPoint') || obj.name?.includes('curveEndPoint')) {
        const controlPoint = obj as any;
        const curvePath = controlPoint.curvePath;
        if (curvePath) {
          canvas.remove(curvePath);
          if ((curvePath as any).startPoint) canvas.remove((curvePath as any).startPoint);
          if ((curvePath as any).controlPoint) canvas.remove((curvePath as any).controlPoint);
          if ((curvePath as any).endPoint) canvas.remove((curvePath as any).endPoint);
        }
      }
      canvas.remove(obj);
    }
  });
  canvas.discardActiveObject();
  safeRenderAll(canvas);
};

export const clearCanvas = (canvas: fabric.Canvas) => {
  const objectsToRemove = canvas.getObjects().filter(obj => 
    obj.name !== 'baseImage' && !obj.name?.startsWith('trait-')
  );
  
  objectsToRemove.forEach(obj => {
    canvas.remove(obj);
  });
  
  canvas.discardActiveObject();
  safeRenderAll(canvas);
};