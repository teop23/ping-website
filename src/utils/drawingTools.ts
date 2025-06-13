import { fabric } from 'fabric';
import { safeRenderAll } from './canvasUtils';

type ToolType = 'select' | 'brush' | 'text' | 'rectangle' | 'circle' | 'line' | 'curve' | 'fill';

// FloodFill implementation based on the provided code
const FloodFill = {
  // Compare subsection of array1's values to array2's values, with an optional tolerance
  withinTolerance: function(array1: Uint8ClampedArray, offset: number, array2: number[], tolerance: number) {
    const length = array2.length;
    let start = offset + length;
    tolerance = tolerance || 0;

    // Iterate (in reverse) the items being compared in each array, checking their values are
    // within tolerance of each other
    while(start-- && length--) {
      if(Math.abs(array1[start] - array2[length]) > tolerance) {
        return false;
      }
    }

    return true;
  },

  // The actual flood fill implementation
  fill: function(imageData: Uint8ClampedArray, getPointOffsetFn: (x: number, y: number) => number, point: {x: number, y: number}, color: number[], target: number[], tolerance: number, width: number, height: number) {
    const directions = [[1, 0], [0, 1], [0, -1], [-1, 0]];
    const coords = new Uint8ClampedArray(imageData.length);
    const points = [point];
    const seen: {[key: string]: boolean} = {};
    let key: string;
    let x: number, y: number, offset: number, i: number, x2: number, y2: number;
    let minX = -1, maxX = -1, minY = -1, maxY = -1;

    // Keep going while we have points to walk
    let currentPoint;
    while (!!(currentPoint = points.pop())) {
      x = currentPoint.x;
      y = currentPoint.y;
      offset = getPointOffsetFn(x, y);

      // Move to next point if this pixel isn't within tolerance of the color being filled
      if (!FloodFill.withinTolerance(imageData, offset, target, tolerance)) {
        continue;
      }

      if (x > maxX) { maxX = x; }
      if (y > maxY) { maxY = y; }
      if (x < minX || minX == -1) { minX = x; }
      if (y < minY || minY == -1) { minY = y; }

      // Update the pixel to the fill color and add neighbours onto stack to traverse
      // the fill area
      i = directions.length;
      while (i--) {
        // Use the same loop for setting RGBA as for checking the neighbouring pixels
        if (i < 4) {
          imageData[offset + i] = color[i];
          coords[offset + i] = color[i];
        }

        // Get the new coordinate by adjusting x and y based on current step
        x2 = x + directions[i][0];
        y2 = y + directions[i][1];
        key = x2 + ',' + y2;

        // If new coordinate is out of bounds, or we've already added it, then skip to
        // trying the next neighbour without adding this one
        if (x2 < 0 || y2 < 0 || x2 >= width || y2 >= height || seen[key]) {
          continue;
        }

        // Push neighbour onto points array to be processed, and tag as seen
        points.push({ x: x2, y: y2 });
        seen[key] = true;
      }
    }

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
      coords: coords
    };
  }
};

// Helper function to convert hex color to RGBA array
function hexToRgba(hex: string, opacity: number = 1): number[] {
  opacity = Math.round(opacity * 255) || 255;
  hex = hex.replace('#', '');
  const rgb: number[] = [];
  const re = new RegExp('(.{' + hex.length/3 + '})', 'g');
  const matches = hex.match(re);
  if (matches) {
    matches.map(function(l) {
      rgb.push(parseInt(hex.length % 2 ? l+l : l, 16));
    });
  }
  return rgb.concat(opacity);
}

// Fill tool implementation using the proper flood fill algorithm
export const addFill = (
  x: number,
  y: number,
  canvas: fabric.Canvas,
  fillColor: string
) => {
  try {
    // Convert to integer coordinates
    const mouseX = Math.round(x);
    const mouseY = Math.round(y);
    
    // First, try to find and fill an existing object at the click position
    const objects = canvas.getObjects();
    let objectAtPoint = null;
    
    // Check if we clicked on a shape object
    for (let i = objects.length - 1; i >= 0; i--) {
      const obj = objects[i];
      if (obj.containsPoint({ x: mouseX, y: mouseY }) && 
          obj.name !== 'baseImage' && 
          !obj.name?.startsWith('trait-') &&
          obj.name !== 'fillLayer') {
        objectAtPoint = obj;
        break;
      }
    }
    
    if (objectAtPoint && objectAtPoint.name !== 'baseImage' && !objectAtPoint.name?.startsWith('trait-')) {
      // Direct object filling - change the fill property of the clicked object
      if (objectAtPoint.type === 'rect' || objectAtPoint.type === 'circle' || objectAtPoint.type === 'path' || objectAtPoint.type === 'polygon') {
        objectAtPoint.set({ fill: fillColor });
        canvas.renderAll();
        return;
      }
    }
    
    // If no fillable object found, perform flood fill
    performFloodFill(mouseX, mouseY, canvas, fillColor);
  } catch (error) {
    console.error('Fill tool error:', error);
  }
};

function performFloodFill(mouseX: number, mouseY: number, canvas: fabric.Canvas, fillColor: string) {
  try {
    const canvasElement = canvas.lowerCanvasEl;
    const context = canvasElement.getContext('2d');
    if (!context) return;

    const parsedColor = hexToRgba(fillColor);
    const imageData = context.getImageData(0, 0, canvasElement.width, canvasElement.height);
    
    const getPointOffset = function(x: number, y: number) {
      return 4 * (y * imageData.width + x);
    };
    
    const targetOffset = getPointOffset(mouseX, mouseY);
    const target = Array.from(imageData.data.slice(targetOffset, targetOffset + 4));

    // Check if we're trying to fill with the same color
    if (FloodFill.withinTolerance(imageData.data, targetOffset, parsedColor, 2)) {
      console.log('Ignore... same color');
      return;
    }

    // Perform flood fill
    const data = FloodFill.fill(
      new Uint8ClampedArray(Array.from(imageData.data)),
      getPointOffset,
      { x: mouseX, y: mouseY },
      parsedColor,
      target,
      2, // tolerance
      imageData.width,
      imageData.height
    );

    if (data.width === 0 || data.height === 0) {
      return;
    }

    // Create temporary canvas for the fill area
    const tmpCanvas = document.createElement('canvas');
    const tmpCtx = tmpCanvas.getContext('2d');
    if (!tmpCtx) return;

    tmpCanvas.width = canvasElement.width;
    tmpCanvas.height = canvasElement.height;

    const palette = tmpCtx.getImageData(0, 0, tmpCanvas.width, tmpCanvas.height);
    palette.data.set(new Uint8ClampedArray(data.coords));
    tmpCtx.putImageData(palette, 0, 0);
    
    // Get cropped image of just the filled area
    const imgData = tmpCtx.getImageData(data.x, data.y, data.width, data.height);

    // Create a new canvas with just the filled area
    const fillCanvas = document.createElement('canvas');
    const fillCtx = fillCanvas.getContext('2d');
    if (!fillCtx) return;

    fillCanvas.width = data.width;
    fillCanvas.height = data.height;
    fillCtx.putImageData(imgData, 0, 0);

    // Convert canvas to fabric image and add to main canvas
    const dataURL = fillCanvas.toDataURL('image/png');
    fabric.Image.fromURL(dataURL, (img) => {
      img.set({
        left: data.x,
        top: data.y,
        selectable: true,
        evented: true,
        name: 'fillArea',
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

  } catch (error) {
    console.error('Flood fill error:', error);
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