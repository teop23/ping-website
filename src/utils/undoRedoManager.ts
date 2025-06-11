import { fabric } from 'fabric';
import { safeRenderAll } from './canvasUtils';

export interface CanvasState {
  objects: any[];
  timestamp: number;
}

export class UndoRedoManager {
  private history: CanvasState[] = [];
  private currentIndex: number = -1;
  private maxHistorySize: number = 50;
  private isProcessing: boolean = false;
  private saveTimeout: NodeJS.Timeout | null = null;

  constructor(private canvas: fabric.Canvas) {}

  // Save the current canvas state
  saveState(): void {
    if (this.isProcessing || !this.canvas) return;

    // Clear any pending save operations
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }

    // Debounce save operations to avoid too many saves
    this.saveTimeout = setTimeout(() => {
      this.performSave();
    }, 50);
  }

  private performSave(): void {
    if (this.isProcessing || !this.canvas) return;

    try {
      // Get all objects except base image and trait images
      const objects = this.canvas.getObjects().filter(obj => 
        obj.name !== 'baseImage' && !obj.name?.startsWith('trait-')
      );
      
      const state: CanvasState = {
        objects: objects.map(obj => {
          try {
            return obj.toObject(['name', 'selectable', 'evented']);
          } catch (error) {
            console.warn('Error serializing object:', error);
            return null;
          }
        }).filter(obj => obj !== null),
        timestamp: Date.now()
      };

      // Only save if the state is actually different from the current one
      if (this.currentIndex >= 0 && this.history[this.currentIndex]) {
        const currentState = this.history[this.currentIndex];
        if (JSON.stringify(currentState.objects) === JSON.stringify(state.objects)) {
          return; // No changes, don't save
        }
      }

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

      console.log('State saved. History length:', this.history.length, 'Current index:', this.currentIndex);
    } catch (error) {
      console.error('Error saving canvas state:', error);
    }
  }

  // Restore a specific state
  private async restoreState(state: CanvasState): Promise<void> {
    return new Promise((resolve) => {
      if (!this.canvas || !state || !Array.isArray(state.objects)) {
        resolve();
        return;
      }

      this.isProcessing = true;

      try {
        // Remove all objects except base image and trait images
        const objectsToRemove = this.canvas.getObjects().filter(obj => 
          obj.name !== 'baseImage' && !obj.name?.startsWith('trait-')
        );
        
        objectsToRemove.forEach(obj => {
          this.canvas.remove(obj);
        });

        // Add objects from state
        if (state.objects.length > 0) {
          const validObjects = state.objects.filter(obj => obj && typeof obj === 'object');
          
          if (validObjects.length > 0) {
            fabric.util.enlivenObjects(validObjects, (objects: fabric.Object[]) => {
              try {
                objects.forEach(obj => {
                  if (obj) {
                    this.canvas.add(obj);
                  }
                });
                this.canvas.renderAll();
                this.isProcessing = false;
                resolve();
              } catch (error) {
                console.error('Error adding objects to canvas:', error);
                this.isProcessing = false;
                resolve();
              }
            }, 'fabric');
          } else {
            this.canvas.renderAll();
            this.isProcessing = false;
            resolve();
          }
        } else {
          this.canvas.renderAll();
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
    if (this.isProcessing) return false;
    
    if (this.currentIndex > 0 && this.history[this.currentIndex - 1]) {
      console.log('Undoing. Current index:', this.currentIndex, 'Moving to:', this.currentIndex - 1);
      this.currentIndex--;
      await this.restoreState(this.history[this.currentIndex]);
      console.log('Undo complete. New index:', this.currentIndex, 'Can redo:', this.canRedo());
      return true;
    }
    return false;
  }

  // Redo the next action
  async redo(): Promise<boolean> {
    if (this.isProcessing) return false;
    
    if (this.currentIndex < this.history.length - 1 && this.history[this.currentIndex + 1]) {
      console.log('Redoing. Current index:', this.currentIndex, 'Moving to:', this.currentIndex + 1);
      this.currentIndex++;
      await this.restoreState(this.history[this.currentIndex]);
      console.log('Redo complete. New index:', this.currentIndex, 'Can redo:', this.canRedo());
      return true;
    }
    return false;
  }

  // Check if undo is available
  canUndo(): boolean {
    const result = !this.isProcessing && this.currentIndex > 0 && this.history[this.currentIndex - 1] !== undefined;
    return result;
  }

  // Check if redo is available
  canRedo(): boolean {
    const result = !this.isProcessing && this.currentIndex < this.history.length - 1 && this.history[this.currentIndex + 1] !== undefined;
    return result;
  }

  // Initialize with empty state
  initialize(): void {
    const initialState: CanvasState = {
      objects: [],
      timestamp: Date.now()
    };
    this.history = [initialState];
    this.currentIndex = 0;
    this.isProcessing = false;
    console.log('UndoRedoManager initialized');
  }

  // Clear all history
  clear(): void {
    this.history = [];
    this.currentIndex = -1;
    this.isProcessing = false;
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
      this.saveTimeout = null;
    }
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