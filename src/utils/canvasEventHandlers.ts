import { fabric } from 'fabric';
import { ToolType } from '../types/traits';
import { 
  addText, 
  addRectangle, 
  addCircle, 
  addLine, 
  addCurvedLine,
  addFill
} from './drawingTools';

export const setupCanvasEventHandlers = (
  canvas: fabric.Canvas,
  tool: ToolType,
  textSize: number,
  textColor: string,
  color: string,
  brushSize: number,
  curvePoints: { x: number; y: number }[],
  setCurvePoints: (points: { x: number; y: number }[]) => void,
  tempCurveLine: fabric.Object | null,
  setTempCurveLine: (line: fabric.Object | null) => void,
  setTool: (tool: ToolType) => void
) => {
  const handleCanvasClick = (e: fabric.IEvent) => {
    if (tool === 'select' || tool === 'brush') return;

    const pointer = canvas.getPointer(e.e as MouseEvent);
    
    switch (tool) {
      case 'text':
        addText(pointer.x, pointer.y, canvas, textSize, textColor, setTool);
        break;
      case 'rectangle':
        addRectangle(pointer.x, pointer.y, canvas, color, setTool);
        break;
      case 'circle':
        addCircle(pointer.x, pointer.y, canvas, color, setTool);
        break;
      case 'line':
        addLine(pointer.x, pointer.y, canvas, color, brushSize, setTool);
        break;
      case 'curve':
        addCurvedLine(pointer.x, pointer.y, canvas, color, brushSize, curvePoints, setCurvePoints, tempCurveLine, setTempCurveLine, setTool);
        break;
      case 'fill':
        addFill(Math.floor(pointer.x), Math.floor(pointer.y), canvas, color);
        break;
    }
  };

  canvas.on('mouse:down', handleCanvasClick);

  return () => {
    canvas.off('mouse:down', handleCanvasClick);
  };
};

export const setupClipboardHandlers = (canvas: fabric.Canvas, setTool?: (tool: ToolType) => void) => {
  const handlePaste = async (e: ClipboardEvent) => {
    e.preventDefault();
    
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      
      if (item.type.indexOf('image') !== -1) {
        const file = item.getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const imgSrc = event.target?.result as string;
            fabric.Image.fromURL(imgSrc, (img) => {
              // Scale the image to fit nicely in the canvas
              const maxSize = Math.min(canvas.width!, canvas.height!) * 0.4;
              const scale = Math.min(maxSize / img.width!, maxSize / img.height!);
              
              img.set({
                left: canvas.width! / 2,
                top: canvas.height! / 2,
                originX: 'center',
                originY: 'center',
                scaleX: scale,
                scaleY: scale,
                cornerStyle: 'circle',
                cornerColor: '#4F46E5',
                cornerSize: 8,
                transparentCorners: false,
                borderColor: '#4F46E5'
              });
              
              canvas.add(img);
              canvas.bringToFront(img);
              canvas.setActiveObject(img);
              canvas.renderAll();
              
              // Switch to select tool after pasting image
              if (setTool) {
                console.log('Switching to select tool after paste');
                setTool('select');
              }
            });
          };
          reader.readAsDataURL(file);
        }
        break;
      }
    }
  };

  document.addEventListener('paste', handlePaste);

  return () => {
    document.removeEventListener('paste', handlePaste);
  };
};