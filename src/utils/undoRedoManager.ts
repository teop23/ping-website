import { fabric } from 'fabric';
import { safeRenderAll } from './canvasUtils';

export interface CanvasState {
  objects: unknown[];
  timestamp: number;
}

export class UndoRedoManager {
  private history: CanvasState[] = [];
  private currentIndex: number = -1;
  private maxHistorySize: number = 50;
  private isProcessing: boolean = false;

  constructor(private canvas: fabric.Canvas) {}

  // Save the current canvas state
  saveState(): void {
    if (this.isProcessing || !this.canvas) return;

    try {
      const objects = this.canvas.getObjects().filter(obj => obj.name !== 'baseImage');
      const state: CanvasState = {
        objects: objects.map(obj => obj.toObject()),
        timestamp: Date.now()
      };

      // Remove any states after current index (when user made changes after undo)
      this.history = this.history.slice(0, this.currentIndex + 1);
      
      // Add new state
      this.history.push(state);
      this.currentIndex = this.history.length - 1;

      // Limit history size
      if (this.history.length > this.maxHistorySize) {
        this.history.shift();
        this.currentIndex = this.history.length - 1;
      }
    } catch (error) {
      console.error('Error saving canvas state:', error);
    }
  }

  // Restore a specific state
  private restoreState(state: CanvasState): Promise<void> {
    return new Promise((resolve) => {
      if (!this.canvas || !state || !Array.isArray(state.objects)) {
        resolve();
        return;
      }

      this.isProcessing = true;

      try {
        // Remove all objects except base image
        const objects = this.canvas.getObjects();
        objects.forEach(obj => {
          if (obj.name !== 'baseImage') {
            this.canvas.remove(obj);
          }
        });

        // Add objects from state
        if (state.objects.length > 0) {
          fabric.util.enlivenObjects(state.objects, (objects: fabric.Object[]) => {
            objects.forEach(obj => {
              this.canvas.add(obj);
            });
            safeRenderAll(this.canvas);
            this.isProcessing = false;
            resolve();
          }, 'fabric');
        } else {
          safeRenderAll(this.canvas);
          this.isProcessing = false;
          resolve();
        }
      } catch (error) {
        console.error('Error restoring canvas state:', error);
        this.isProcessing = false;
        resolve();
      }
    });
  }

  // Undo the last action
  async undo(): Promise<boolean> {
    if (this.currentIndex > 0 && this.history[this.currentIndex - 1]) {
      this.currentIndex--;
      await this.restoreState(this.history[this.currentIndex]);
      return true;
    }
    return false;
  }

  // Redo the next action
  async redo(): Promise<boolean> {
    if (this.currentIndex < this.history.length - 1 && this.history[this.currentIndex + 1]) {
      this.currentIndex++;
      await this.restoreState(this.history[this.currentIndex]);
      return true;
    }
    return false;
  }

  // Check if undo is available
  canUndo(): boolean {
    return this.currentIndex > 0 && this.history[this.currentIndex - 1] !== undefined;
  }

  // Check if redo is available
  canRedo(): boolean {
    return this.currentIndex < this.history.length - 1 && this.history[this.currentIndex + 1] !== undefined;
  }

  // Initialize with empty state
  initialize(): void {
    const initialState: CanvasState = {
      objects: [],
      timestamp: Date.now()
    };
    this.history = [initialState];
    this.currentIndex = 0;
  }

  // Clear all history
  clear(): void {
    this.history = [];
    this.currentIndex = -1;
    this.isProcessing = false;
  }

  // Get current state info for debugging
  getStateInfo(): { historyLength: number; currentIndex: number; canUndo: boolean; canRedo: boolean } {
    return {
      historyLength: this.history.length,
      currentIndex: this.currentIndex,
      canUndo: this.canUndo(),
      canRedo: this.canRedo()
    };
  }
}