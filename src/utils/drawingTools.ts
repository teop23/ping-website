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
  tempCurveLine: fabric.Path | null,
  setTempCurveLine: (line: fabric.Path | null) => void,
  setTool: (tool: ToolType) => void
) => {
  const newPoints = [...curvePoints, { x, y }];
  setCurvePoints(newPoints);

  // Remove previous temporary line
  if (tempCurveLine) {
    canvas.remove(tempCurveLine);
    setTempCurveLine(null);
  }

  if (newPoints.length === 2) {
    // Show preview line from start to current point
    const pathString = `M ${newPoints[0].x} ${newPoints[0].y} L ${x} ${y}`;
    const previewPath = new fabric.Path(pathString, {
      stroke: color,
      strokeWidth: strokeWidth,
      fill: '',
      strokeDashArray: [5, 5],
      selectable: false,
      evented: false,
      opacity: 0.5
    });
    
    canvas.add(previewPath);
    setTempCurveLine(previewPath);
    safeRenderAll(canvas);
  } else if (newPoints.length === 3) {
    // Create the final curved line using quadratic bezier curve
    const [start, control, end] = newPoints;
    
    // Create a quadratic bezier curve path
    const pathString = `M ${start.x} ${start.y} Q ${control.x} ${control.y} ${end.x} ${end.y}`;
    
    const curvePath = new fabric.Path(pathString, {
      stroke: color,
      strokeWidth: strokeWidth,
      fill: '',
      selectable: true,
      cornerStyle: 'circle',
      cornerColor: '#4F46E5',
      cornerSize: 8,
      transparentCorners: false,
      borderColor: '#4F46E5'
    });
    
    canvas.add(curvePath);
    canvas.bringToFront(curvePath);
    canvas.setActiveObject(curvePath);
    safeRenderAll(canvas);
    
    // Reset curve state
    setCurvePoints([]);
    setTempCurveLine(null);
    setTool('select');
  } else {
    // First point - just add a small indicator
    const indicator = new fabric.Circle({
      left: x - 2,
      top: y - 2,
      radius: 2,
      fill: color,
      selectable: false,
      evented: false,
      opacity: 0.7
    });
    
    canvas.add(indicator);
    setTempCurveLine(indicator);
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