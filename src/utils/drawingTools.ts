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
  private curveGroup: fabric.Group | null = null;

  constructor(start: { x: number; y: number }, control: { x: number; y: number }, end: { x: number; y: number }, options: any = {}) {
    // Create the curve path first
    const pathString = `M ${start.x} ${start.y} Q ${control.x} ${control.y} ${end.x} ${end.y}`;
    const curvePath = new fabric.Path(pathString, {
      stroke: options.stroke || '#000000',
      strokeWidth: options.strokeWidth || 2,
      fill: '',
      selectable: true,
      evented: true,
      left: 0,
      top: 0,
      originX: 'left',
      originY: 'top',
      name: 'editableCurvePath'
    });

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
      name: 'curveStartPoint',
      visible: false // Initially hidden
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
      name: 'curveControlPoint',
      visible: false // Initially hidden
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
      name: 'curveEndPoint',
      visible: false // Initially hidden
    });

    // Create helper lines (dashed lines from control point to start/end)
    const helperLine1 = new fabric.Line([start.x, start.y, control.x, control.y], {
      stroke: '#9CA3AF',
      strokeWidth: 1,
      strokeDashArray: [3, 3],
      selectable: false,
      evented: false,
      opacity: 0.6,
      name: 'curveHelperLine1',
      visible: false // Initially hidden
    });

    const helperLine2 = new fabric.Line([control.x, control.y, end.x, end.y], {
      stroke: '#9CA3AF',
      strokeWidth: 1,
      strokeDashArray: [3, 3],
      selectable: false,
      evented: false,
      opacity: 0.6,
      name: 'curveHelperLine2',
      visible: false // Initially hidden
    });

    super([curvePath], {
      ...options,
      selectable: true,
      evented: true,
      name: 'editableCurve'
    });

    this.startPoint = startPoint;
    this.controlPoint = controlPoint;
    this.endPoint = endPoint;
    this.curvePath = curvePath;
    this.helperLine1 = helperLine1;
    this.helperLine2 = helperLine2;

    // Set up event handlers for the curve path and anchor points
    this.setupCurveEvents();
    this.setupAnchorEvents();
  }

  setupCurveEvents() {
    // Show anchor points when curve is selected
    this.curvePath.on('selected', () => {
      this.showAnchors();
    });

    // Hide anchor points when curve is deselected
    this.curvePath.on('deselected', () => {
      this.hideAnchors();
    });
  }

  setupAnchorEvents() {
    // Start point events
    this.startPoint.on('moving', () => {
      this.updateCurveFromAnchor();
    });

    this.startPoint.on('moved', () => {
      this.renderCanvas();
    });

    // Control point events
    this.controlPoint.on('moving', () => {
      this.updateCurveFromAnchor();
    });

    this.controlPoint.on('moved', () => {
      this.renderCanvas();
    });

    // End point events
    this.endPoint.on('moving', () => {
      this.updateCurveFromAnchor();
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

  showAnchors() {
    if (this.canvas) {
      this.startPoint.set({ visible: true });
      this.controlPoint.set({ visible: true });
      this.endPoint.set({ visible: true });
      this.helperLine1.set({ visible: true });
      this.helperLine2.set({ visible: true });
      this.renderCanvas();
    }
  }

  hideAnchors() {
    if (this.canvas) {
      this.startPoint.set({ visible: false });
      this.controlPoint.set({ visible: false });
      this.endPoint.set({ visible: false });
      this.helperLine1.set({ visible: false });
      this.helperLine2.set({ visible: false });
      this.renderCanvas();
    }
  }

  updateCurveFromAnchor() {
    const startPos = { x: this.startPoint.left!, y: this.startPoint.top! };
    const controlPos = { x: this.controlPoint.left!, y: this.controlPoint.top! };
    const endPos = { x: this.endPoint.left!, y: this.endPoint.top! };

    // Update the curve path with correct positioning
    const pathString = `M ${startPos.x} ${startPos.y} Q ${controlPos.x} ${controlPos.y} ${endPos.x} ${endPos.y}`;
    
    if (this.canvas) {
      // Remove the old path and create a new one
      this.canvas.remove(this.curvePath);
      
      this.curvePath = new fabric.Path(pathString, {
        stroke: this.curvePath.stroke,
        strokeWidth: this.curvePath.strokeWidth,
        fill: '',
        selectable: true,
        evented: true,
        left: 0,
        top: 0,
        originX: 'left',
        originY: 'top',
        name: 'editableCurvePath'
      });
      
      // Re-setup curve events
      this.setupCurveEvents();
      
      this.canvas.add(this.curvePath);
      
      // Ensure proper layering - curve above base, anchors above curve
      this.ensureProperLayering();
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

  ensureProperLayering() {
    if (!this.canvas) return;
    
    const allObjects = this.canvas.getObjects();
    
    // Send base image to back
    allObjects.forEach(obj => {
      if (obj.name === 'baseImage') {
        this.canvas!.sendToBack(obj);
      }
    });

    // Bring curve elements to front in correct order
    this.canvas.bringToFront(this.curvePath);
    this.canvas.bringToFront(this.helperLine1);
    this.canvas.bringToFront(this.helperLine2);
    this.canvas.bringToFront(this.startPoint);
    this.canvas.bringToFront(this.controlPoint);
    this.canvas.bringToFront(this.endPoint);
  }

  renderCanvas() {
    if (this.canvas) {
      safeRenderAll(this.canvas);
    }
  }

  // Method to add all components to canvas individually for proper event handling
  addToCanvas(canvas: fabric.Canvas) {
    this.setCanvas(canvas);
    
    // Add all components individually to the canvas
    canvas.add(this.curvePath);
    canvas.add(this.helperLine1);
    canvas.add(this.helperLine2);
    canvas.add(this.startPoint);
    canvas.add(this.controlPoint);
    canvas.add(this.endPoint);

    // Ensure proper layering
    this.ensureProperLayering();
    safeRenderAll(canvas);
  }

  // Method to remove all components from canvas
  removeFromCanvas(canvas: fabric.Canvas) {
    canvas.remove(this.curvePath);
    canvas.remove(this.helperLine1);
    canvas.remove(this.helperLine2);
    canvas.remove(this.startPoint);
    canvas.remove(this.controlPoint);
    canvas.remove(this.endPoint);
    safeRenderAll(canvas);
  }

  // Method to select the curve
  selectCurve(canvas: fabric.Canvas) {
    canvas.setActiveObject(this.curvePath);
    this.showAnchors();
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
    // Third point - create the final editable curve with movable anchors
    const [start, control, end] = newPoints;
    
    const editableCurve = new EditableCurve(start, control, end, {
      stroke: color,
      strokeWidth: strokeWidth
    });
    
    // Add the curve components to the canvas
    editableCurve.addToCanvas(canvas);
    
    // Select the curve to show anchors initially
    setTimeout(() => {
      editableCurve.selectCurve(canvas);
    }, 100);
    
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
      if (obj.name?.startsWith('curve') || obj.name === 'editableCurvePath') {
        // Find and remove all related curve components
        const allObjects = canvas.getObjects();
        const curveComponents = allObjects.filter(o => 
          o.name?.startsWith('curve') || o.name === 'editableCurvePath'
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