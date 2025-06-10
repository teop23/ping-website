import { fabric } from 'fabric';
import { safeRenderAll } from './canvasUtils';

type ToolType = 'select' | 'brush' | 'text' | 'rectangle' | 'circle' | 'line' | 'curve';

// Custom curve class with individually movable anchor points
class EditableCurve extends fabric.Group {
  public startPoint: fabric.Circle;
  public controlPoint: fabric.Circle;
  public endPoint: fabric.Circle;
  public curvePath: fabric.Path;
  public helperLine1: fabric.Line;
  public helperLine2: fabric.Line;
  public isEditableCurve: boolean = true;
  private canvas: fabric.Canvas | null = null;

  constructor(start: { x: number; y: number }, control: { x: number; y: number }, end: { x: number; y: number }, options: any = {}) {
    // Create control points as individually selectable and movable
    const startPoint = new fabric.Circle({
      left: start.x,
      top: start.y,
      radius: 6,
      fill: '#4F46E5',
      stroke: '#ffffff',
      strokeWidth: 2,
      originX: 'center',
      originY: 'center',
      selectable: true,
      evented: true,
      hasControls: false,
      hasBorders: false,
      hoverCursor: 'move',
      moveCursor: 'move',
      name: 'curveStartPoint'
    });

    const controlPoint = new fabric.Circle({
      left: control.x,
      top: control.y,
      radius: 6,
      fill: '#F59E0B',
      stroke: '#ffffff',
      strokeWidth: 2,
      originX: 'center',
      originY: 'center',
      selectable: true,
      evented: true,
      hasControls: false,
      hasBorders: false,
      hoverCursor: 'move',
      moveCursor: 'move',
      name: 'curveControlPoint'
    });

    const endPoint = new fabric.Circle({
      left: end.x,
      top: end.y,
      radius: 6,
      fill: '#EF4444',
      stroke: '#ffffff',
      strokeWidth: 2,
      originX: 'center',
      originY: 'center',
      selectable: true,
      evented: true,
      hasControls: false,
      hasBorders: false,
      hoverCursor: 'move',
      moveCursor: 'move',
      name: 'curveEndPoint'
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

    // Create the curve path with proper positioning
    const pathString = `M ${start.x} ${start.y} Q ${control.x} ${control.y} ${end.x} ${end.y}`;
    const curvePath = new fabric.Path(pathString, {
      stroke: options.stroke || '#000000',
      strokeWidth: options.strokeWidth || 2,
      fill: '',
      selectable: false,
      evented: false,
      left: 0,
      top: 0,
      originX: 'left',
      originY: 'top',
      name: 'curvePath'
    });

    super([helperLine1, helperLine2, curvePath, startPoint, controlPoint, endPoint], {
      ...options,
      selectable: false,
      evented: false,
      name: 'editableCurve'
    });

    this.startPoint = startPoint;
    this.controlPoint = controlPoint;
    this.endPoint = endPoint;
    this.curvePath = curvePath;
    this.helperLine1 = helperLine1;
    this.helperLine2 = helperLine2;

    // Set up event handlers for individual anchor points
    this.setupAnchorEvents();
  }

  setupAnchorEvents() {
    // Start point events
    this.startPoint.on('moving', (e) => {
      this.updateCurveFromAnchor('start', e.target as fabric.Circle);
    });

    this.startPoint.on('moved', () => {
      this.renderCanvas();
    });

    // Control point events
    this.controlPoint.on('moving', (e) => {
      this.updateCurveFromAnchor('control', e.target as fabric.Circle);
    });

    this.controlPoint.on('moved', () => {
      this.renderCanvas();
    });

    // End point events
    this.endPoint.on('moving', (e) => {
      this.updateCurveFromAnchor('end', e.target as fabric.Circle);
    });

    this.endPoint.on('moved', () => {
      this.renderCanvas();
    });

    // Add visual feedback on hover
    [this.startPoint, this.controlPoint, this.endPoint].forEach(point => {
      point.on('mouseover', () => {
        point.set({ radius: 8 });
        this.renderCanvas();
      });

      point.on('mouseout', () => {
        point.set({ radius: 6 });
        this.renderCanvas();
      });
    });
  }

  updateCurveFromAnchor(anchorType: 'start' | 'control' | 'end', anchor: fabric.Circle) {
    const startPos = { x: this.startPoint.left!, y: this.startPoint.top! };
    const controlPos = { x: this.controlPoint.left!, y: this.controlPoint.top! };
    const endPos = { x: this.endPoint.left!, y: this.endPoint.top! };

    // Update the curve path with proper positioning
    const pathString = `M ${startPos.x} ${startPos.y} Q ${controlPos.x} ${controlPos.y} ${endPos.x} ${endPos.y}`;
    
    // Remove the old path and create a new one to ensure proper positioning
    if (this.canvas) {
      this.canvas.remove(this.curvePath);
      
      this.curvePath = new fabric.Path(pathString, {
        stroke: this.curvePath.stroke,
        strokeWidth: this.curvePath.strokeWidth,
        fill: '',
        selectable: false,
        evented: false,
        left: 0,
        top: 0,
        originX: 'left',
        originY: 'top',
        name: 'curvePath'
      });
      
      this.canvas.add(this.curvePath);
      this.canvas.sendToBack(this.curvePath);
      
      // Ensure anchor points are on top
      this.canvas.bringToFront(this.startPoint);
      this.canvas.bringToFront(this.controlPoint);
      this.canvas.bringToFront(this.endPoint);
    }

    // Update helper lines
    this.helperLine1.set({
      x1: startPos.x,
      y1: startPos.y,
      x2: controlPos.x,
      y2: controlPos.y
    });

    this.helperLine2.set({
      x1: controlPos.x,
      y1: controlPos.y,
      x2: endPos.x,
      y2: endPos.y
    });

    this.renderCanvas();
  }

  setCanvas(canvas: fabric.Canvas) {
    this.canvas = canvas;
  }

  renderCanvas() {
    if (this.canvas) {
      safeRenderAll(this.canvas);
    }
  }

  // Override the group's selection behavior to allow individual anchor selection
  shouldCache() {
    return false;
  }

  // Method to add all components to canvas individually for proper event handling
  addToCanvas(canvas: fabric.Canvas) {
    this.setCanvas(canvas);
    
    // Add all components individually to the canvas
    canvas.add(this.helperLine1);
    canvas.add(this.helperLine2);
    canvas.add(this.curvePath);
    canvas.add(this.startPoint);
    canvas.add(this.controlPoint);
    canvas.add(this.endPoint);

    // Ensure proper layering
    canvas.bringToFront(this.startPoint);
    canvas.bringToFront(this.controlPoint);
    canvas.bringToFront(this.endPoint);

    safeRenderAll(canvas);
  }

  // Method to remove all components from canvas
  removeFromCanvas(canvas: fabric.Canvas) {
    canvas.remove(this.helperLine1);
    canvas.remove(this.helperLine2);
    canvas.remove(this.curvePath);
    canvas.remove(this.startPoint);
    canvas.remove(this.controlPoint);
    canvas.remove(this.endPoint);
    safeRenderAll(canvas);
  }

  // Method to select/highlight the entire curve
  selectCurve(canvas: fabric.Canvas) {
    // Create a temporary selection group for visual feedback
    const selection = new fabric.ActiveSelection([
      this.startPoint, 
      this.controlPoint, 
      this.endPoint
    ], {
      canvas: canvas
    });
    canvas.setActiveObject(selection);
    safeRenderAll(canvas);
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
    setTempCurveLine(tempGroup);
    safeRenderAll(canvas);
  } else if (newPoints.length === 3) {
    // Third point - create the final editable curve with movable anchors
    const [start, control, end] = newPoints;
    
    const editableCurve = new EditableCurve(start, control, end, {
      stroke: color,
      strokeWidth: strokeWidth
    });
    
    // Add the curve components to the canvas
    editableCurve.addToCanvas(canvas);
    
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
      // Check if it's part of an editable curve and remove all related components
      if (obj.name?.startsWith('curve')) {
        // Find and remove all related curve components
        const allObjects = canvas.getObjects();
        const curveComponents = allObjects.filter(o => 
          o.name?.startsWith('curve') && 
          (o.name.includes('Point') || o.name.includes('Path') || o.name.includes('Helper'))
        );
        curveComponents.forEach(component => canvas.remove(component));
      } else {
        canvas.remove(obj);
      }
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