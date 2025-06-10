import { fabric } from 'fabric';
import { CanvasState } from '../utils/canvasUtils';

export type ToolType = 'select' | 'brush' | 'text' | 'rectangle' | 'circle' | 'line' | 'curve';

export interface ToolsPanelProps {
  tool: ToolType;
  setTool: (tool: ToolType) => void;
  color: string;
  setColor: (color: string) => void;
  showColorPicker: boolean;
  setShowColorPicker: (show: boolean) => void;
  brushSize: number;
  setBrushSize: (size: number) => void;
  textSize: number;
  setTextSize: (size: number) => void;
  textColor: string;
  setTextColor: (color: string) => void;
  showTextColorPicker: boolean;
  setShowTextColorPicker: (show: boolean) => void;
  curvePoints: { x: number; y: number }[];
  canvas: fabric.Canvas | null;
  historyIndex: number;
  canvasHistory: CanvasState[];
  showBaseLayer: boolean;
  onToggleBaseLayer: () => void;
  onUploadImage: () => void;
  onDeleteSelected: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onClearCanvas: () => void;
}