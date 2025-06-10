import { fabric } from 'fabric';
import { safeRenderAll } from './canvasUtils';

type ToolType = 'select' | 'brush' | 'text' | 'rectangle' | 'circle' | 'line' | 'curve';

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
      radius: 6,
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
    // Third point - create the final bezier curve using Path
    const [start, control, end] = newPoints;
    
    // Create SVG path string for quadratic bezier curve
    const pathString = `M ${start.x} ${start.y} Q ${control.x} ${control.y} ${end.x} ${end.y}`;
    
    // Create the curve path
    const curvePath = new fabric.Path(pathString, {
      stroke: color,
      strokeWidth: strokeWidth,
      fill: '',
      selectable: true,
      evented: true,
      cornerStyle: 'circle',
      cornerColor: '#4F46E5',
      cornerSize: 8,
      transparentCorners: false,
      borderColor: '#4F46E5',
      name: 'bezierCurve'
    });
    
    // Add the curve to canvas
    canvas.add(curvePath);
    
    // Ensure proper layering - curve above base image
    const allObjects = canvas.getObjects();
    allObjects.forEach(obj => {
      if (obj.name === 'baseImage') {
        canvas.sendToBack(obj);
      }
    });
    canvas.bringToFront(curvePath);
    
    // Select the curve
    canvas.setActiveObject(curvePath);
    safeRenderAll(canvas);
    
    // Reset curve state
    setCurvePoints([]);
    setTempCurveLine(null);
    setTool('select');
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