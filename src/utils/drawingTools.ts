import { fabric } from 'fabric';
import { safeRenderAll } from './canvasUtils';

type ToolType = 'select' | 'brush' | 'text' | 'rectangle' | 'circle' | 'line' | 'curve';

// Custom curve class that extends fabric.Group to include control points
class EditableCurve extends fabric.Group {
  public startPoint: fabric.Circle;
  public controlPoint: fabric.Circle;
  public endPoint: fabric.Circle;
  public curvePath: fabric.Path;
  public isEditableCurve: boolean = true;

  constructor(start: { x: number; y: number }, control: { x: number; y: number }, end: { x: number; y: number }, options: any = {}) {
    // Create control points
    const startPoint = new fabric.Circle({
      left: start.x,
      top: start.y,
      radius: 4,
      fill: '#4F46E5',
      stroke: '#ffffff',
      strokeWidth: 2,
      originX: 'center',
      originY: 'center',
      selectable: false,
      evented: false,
      name: 'curveStartPoint'
    });

    const controlPoint = new fabric.Circle({
      left: control.x,
      top: control.y,
      radius: 4,
      fill: '#F59E0B',
      stroke: '#ffffff',
      strokeWidth: 2,
      originX: 'center',
      originY: 'center',
      selectable: false,
      evented: false,
      name: 'curveControlPoint'
    });

    const endPoint = new fabric.Circle({
      left: end.x,
      top: end.y,
      radius: 4,
      fill: '#EF4444',
      stroke: '#ffffff',
      strokeWidth: 2,
      originX: 'center',
      originY: 'center',
      selectable: false,
      evented: false,
      name: 'curveEndPoint'
    });

    // Create the curve path
    const pathString = `M ${start.x} ${start.y} Q ${control.x} ${control.y} ${end.x} ${end.y}`;
    const curvePath = new fabric.Path(pathString, {
      stroke: options.stroke || '#000000',
      strokeWidth: options.strokeWidth || 2,
      fill: '',
      selectable: false,
      evented: false,
      name: 'curvePath'
    });

    // Create helper lines (dashed lines from control point to start/end)
    const helperLine1 = new fabric.Line([start.x, start.y, control.x, control.y], {
      stroke: '#9CA3AF',
      strokeWidth: 1,
      strokeDashArray: [3, 3],
      selectable: false,
      evented: false,
      opacity: 0.6,
      name: 'curveHelperLine1'
    });

    const helperLine2 = new fabric.Line([control.x, control.y, end.x, end.y], {
      stroke: '#9CA3AF',
      strokeWidth: 1,
      strokeDashArray: [3, 3],
      selectable: false,
      evented: false,
      opacity: 0.6,
      name: 'curveHelperLine2'
    });

    super([helperLine1, helperLine2, curvePath, startPoint, controlPoint, endPoint], {
      ...options,
      cornerStyle: 'circle',
      cornerColor: '#4F46E5',
      cornerSize: 8,
      transparentCorners: false,
      borderColor: '#4F46E5',
      name: 'editableCurve'
    });

    this.startPoint = startPoint;
    this.controlPoint = controlPoint;
    this.endPoint = endPoint;
    this.curvePath = curvePath;

    // Add event listeners for control point dragging
    this.on('moving', this.updateCurve.bind(this));
    this.on('scaling', this.updateCurve.bind(this));
    this.on('rotating', this.updateCurve.bind(this));
  }

  updateCurve() {
    // Get the current positions of control points relative to the group
    const matrix = this.calcTransformMatrix();
    
    // Transform the original positions
    const startPos = fabric.util.transformPoint(this.startPoint.getCenterPoint(), matrix);
    const controlPos = fabric.util.transformPoint(this.controlPoint.getCenterPoint(), matrix);
    const endPos = fabric.util.transformPoint(this.endPoint.getCenterPoint(), matrix);

    // Update the path
    const pathString = `M ${startPos.x} ${startPos.y} Q ${controlPos.x} ${controlPos.y} ${endPos.x} ${endPos.y}`;
    this.curvePath.set({ path: fabric.util.parsePath(pathString) });

    // Update helper lines
    const objects = this.getObjects();
    const helperLine1 = objects.find(obj => obj.name === 'curveHelperLine1') as fabric.Line;
    const helperLine2 = objects.find(obj => obj.name === 'curveHelperLine2') as fabric.Line;

    if (helperLine1) {
      helperLine1.set({
        x1: startPos.x,
        y1: startPos.y,
        x2: controlPos.x,
        y2: controlPos.y
      });
    }

    if (helperLine2) {
      helperLine2.set({
        x1: controlPos.x,
        y1: controlPos.y,
        x2: endPos.x,
        y2: endPos.y
      });
    }
  }

  // Method to update individual control points
  updateControlPoint(pointType: 'start' | 'control' | 'end', newPos: { x: number; y: number }) {
    const objects = this.getObjects();
    
    switch (pointType) {
      case 'start':
        this.startPoint.set({ left: newPos.x, top: newPos.y });
        break;
      case 'control':
        this.controlPoint.set({ left: newPos.x, top: newPos.y });
        break;
      case 'end':
        this.endPoint.set({ left: newPos.x, top: newPos.y });
        break;
    }

    // Update the curve path
    const pathString = `M ${this.startPoint.left} ${this.startPoint.top} Q ${this.controlPoint.left} ${this.controlPoint.top} ${this.endPoint.left} ${this.endPoint.top}`;
    this.curvePath.set({ path: fabric.util.parsePath(pathString) });

    // Update helper lines
    const helperLine1 = objects.find(obj => obj.name === 'curveHelperLine1') as fabric.Line;
    const helperLine2 = objects.find(obj => obj.name === 'curveHelperLine2') as fabric.Line;

    if (helperLine1) {
      helperLine1.set({
        x1: this.startPoint.left,
        y1: this.startPoint.top,
        x2: this.controlPoint.left,
        y2: this.controlPoint.top
      });
    }

    if (helperLine2) {
      helperLine2.set({
        x1: this.controlPoint.left,
        y1: this.controlPoint.top,
        x2: this.endPoint.left,
        y2: this.endPoint.top
      });
    }
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
      radius: 4,
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
    setTempCurveLine(indicator);
    safeRenderAll(canvas);
  } else if (newPoints.length === 2) {
    // Second point - show preview line and both points
    const [start, control] = newPoints;
    
    const startIndicator = new fabric.Circle({
      left: start.x,
      top: start.y,
      radius: 4,
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
      radius: 4,
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
    setTempCurveLine(tempGroup);
    safeRenderAll(canvas);
  } else if (newPoints.length === 3) {
    // Third point - create the final editable curve
    const [start, control, end] = newPoints;
    
    const editableCurve = new EditableCurve(start, control, end, {
      stroke: color,
      strokeWidth: strokeWidth
    });
    
    canvas.add(editableCurve);
    canvas.bringToFront(editableCurve);
    canvas.setActiveObject(editableCurve);
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