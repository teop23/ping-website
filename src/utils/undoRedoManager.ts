import { fabric } from 'fabric';
import { safeRenderAll } from './canvasUtils';

export interface CanvasState {
  objects: any[];
  timestamp: number;
  description?: string;
}

export class UndoRedoManager {
  private history: CanvasState[] = [];
  private currentIndex: number = -1;
  private maxHistorySize: number = 50;
  private isProcessing: boolean = false;
  private saveTimeout: NodeJS.Timeout | null = null;
  private lastStateHash: string = '';

  constructor(private canvas: fabric.Canvas) {}

  // Generate a hash of the current canvas state for comparison
  private generateStateHash(objects: any[]): string {
    try {
      return JSON.stringify(objects.map(obj => ({
        type: obj.type,
        left: obj.left,
        top: obj.top,
        width: obj.width,
        height: obj.height,
        scaleX: obj.scaleX,
        scaleY: obj.scaleY,
        angle: obj.angle,
        text: obj.text,
        path: obj.path
      })));
    } catch (error) {
      return Math.random().toString();
    }
  }

  // Save the current canvas state
  saveState(description?: string): void {
    if (this.isProcessing || !this.canvas) return;

    // Clear any pending save operations
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }

    // Debounce save operations to avoid too many saves
    this.saveTimeout = setTimeout(() => {
      this.performSave(description);
    }, 100);
  }

  private performSave(description?: string): void {
    if (this.isProcessing || !this.canvas) return;

    try {
      // Get all drawable objects (exclude base image and trait overlays)
      const objects = this.canvas.getObjects().filter(obj => {
        // Include all user-created objects
        return obj.name !== 'baseImage' && 
               !obj.name?.startsWith('trait-') &&
               obj.type !== 'image' || 
               (obj.type === 'image' && !obj.name?.includes('baseImage') && !obj.name?.startsWith('trait-'));
      });
      
      // Generate hash for comparison
      const currentHash = this.generateStateHash(objects);
      
      // Don't save if state hasn't changed
      if (currentHash === this.lastStateHash) {
        return;
      }
      
      const state: CanvasState = {
        objects: objects.map(obj => {
          try {
            // Include all necessary properties for proper restoration
            const objData = obj.toObject([
              'name', 'selectable', 'evented', 'visible', 'opacity',
              'stroke', 'strokeWidth', 'fill', 'fontSize', 'fontFamily',
              'fontWeight', 'textAlign', 'charSpacing', 'lineHeight',
              'rx', 'ry', 'radius', 'x1', 'y1', 'x2', 'y2', 'path'
            ]);
            return objData;
          } catch (error) {
            console.warn('Error serializing object:', error);
            return null;
          }
        }).filter(obj => obj !== null),
        timestamp: Date.now(),
        description: description || `Action ${this.history.length + 1}`
      };

      // Remove any states after current index (when user made changes after undo)
      if (this.currentIndex < this.history.length - 1) {
        this.history = this.history.slice(0, this.currentIndex + 1);
      }
      
      // Add new state
      this.history.push(state);
      this.currentIndex = this.history.length - 1;
      this.lastStateHash = currentHash;

      // Limit history size
      if (this.history.length > this.maxHistorySize) {
        this.history.shift();
        this.currentIndex = this.history.length - 1;
      }

      console.log(`State saved: "${state.description}". History length: ${this.history.length}, Current index: ${this.currentIndex}`);
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
      console.log(`Restoring state: "${state.description}" with ${state.objects.length} objects`);

      try {
        // Remove all user-created objects (keep base image and trait overlays)
        const objectsToRemove = this.canvas.getObjects().filter(obj => {
          return obj.name !== 'baseImage' && 
                 !obj.name?.startsWith('trait-') &&
                 (obj.type !== 'image' || 
                  (obj.type === 'image' && !obj.name?.includes('baseImage') && !obj.name?.startsWith('trait-')));
        });
        
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
                    // Restore all object properties
                    this.canvas.add(obj);
                  }
                });
                
                // Update the state hash
                this.lastStateHash = this.generateStateHash(validObjects);
                
                this.canvas.renderAll();
                this.isProcessing = false;
                console.log(`State restored successfully: ${objects.length} objects added`);
                resolve();
              } catch (error) {
                console.error('Error adding objects to canvas:', error);
                this.isProcessing = false;
                resolve();
              }
            }, 'fabric');
          } else {
            this.lastStateHash = this.generateStateHash([]);
            this.canvas.renderAll();
            this.isProcessing = false;
            resolve();
          }
        } else {
          this.lastStateHash = this.generateStateHash([]);
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
      const previousState = this.history[this.currentIndex - 1];
      console.log(`Undoing from "${this.history[this.currentIndex].description}" to "${previousState.description}"`);
      this.currentIndex--;
      await this.restoreState(previousState);
      console.log(`Undo complete. New index: ${this.currentIndex}, Can redo: ${this.canRedo()}`);
      return true;
    }
    return false;
  }

  // Redo the next action
  async redo(): Promise<boolean> {
    if (this.isProcessing) return false;
    
    if (this.currentIndex < this.history.length - 1 && this.history[this.currentIndex + 1]) {
      const nextState = this.history[this.currentIndex + 1];
      console.log(`Redoing from "${this.history[this.currentIndex].description}" to "${nextState.description}"`);
      this.currentIndex++;
      await this.restoreState(nextState);
      console.log(`Redo complete. New index: ${this.currentIndex}, Can redo: ${this.canRedo()}`);
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
      timestamp: Date.now(),
      description: 'Initial state'
    };
    this.history = [initialState];
    this.currentIndex = 0;
    this.isProcessing = false;
    this.lastStateHash = this.generateStateHash([]);
    console.log('UndoRedoManager initialized with initial state');
  }

  // Clear all history
  clear(): void {
    this.history = [];
    this.currentIndex = -1;
    this.isProcessing = false;
    this.lastStateHash = '';
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
      this.saveTimeout = null;
    }
  }

  // Get current state info for debugging
  getStateInfo(): { historyLength: number; currentIndex: number; canUndo: boolean; canRedo: boolean; currentDescription?: string } {
    return {
      historyLength: this.history.length,
      currentIndex: this.currentIndex,
      canUndo: this.canUndo(),
      canRedo: this.canRedo(),
      currentDescription: this.history[this.currentIndex]?.description
    };
  }

  // Get history for debugging
  getHistory(): CanvasState[] {
    return this.history.map(state => ({
      ...state,
      objects: `${state.objects.length} objects`
    })) as any;
  }
}