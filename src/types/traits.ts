import { fabric } from 'fabric';
import { UndoRedoManager } from '../utils/undoRedoManager';

export type ToolType = 'select' | 'brush' | 'eraser' | 'text' | 'rectangle' | 'circle' | 'line' | 'curve' | 'fill';

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
  undoRedoManager: UndoRedoManager | null;
  showBaseLayer: boolean;
  canvas: fabric.Canvas | null;
  onToggleBaseLayer: () => void;
  onUploadImage: () => void;
  onDeleteSelected: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onClearCanvas: () => void;
}