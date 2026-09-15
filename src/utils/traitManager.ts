import { fabric } from 'fabric';
import { safeRenderAll } from './canvasUtils';

export interface SavedTrait {
  id: string;
  name: string;
  data: string;
  timestamp: number;
  isVisible: boolean;
  fabricObject?: fabric.Image;
}

/** Writes the saved traits list. False when the browser refuses (storage full). */
const persistTraits = (traits: SavedTrait[]) => {
  try {
    localStorage.setItem('pingTraits', JSON.stringify(traits));
    return true;
  } catch {
    return false;
  }
};

export const saveTrait = (
  canvas: fabric.Canvas,
  traitName: string,
  baseImage: fabric.Image | null,
  loadedTraits: Map<string, fabric.Image>,
  savedTraits: SavedTrait[],
  setSavedTraits: (traits: SavedTrait[]) => void,
  setTraitName: (name: string) => void,
  setError: (message: string | null) => void
) => {
  if (!canvas || !traitName.trim()) return;

  const originalOpacity = baseImage?.opacity;
  if (baseImage) {
    baseImage.set({ opacity: 0 });
    safeRenderAll(canvas);
  }

  const hiddenTraits: { object: fabric.Image; originalVisibility: boolean }[] = [];
  loadedTraits.forEach((traitObject) => {
    if (traitObject.visible) {
      hiddenTraits.push({ object: traitObject, originalVisibility: true });
      traitObject.set({ visible: false });
    }
  });
  
  const originalBackground = canvas.backgroundColor;
  canvas.setBackgroundColor('transparent', () => {
    safeRenderAll(canvas);
    
    // Same 1000px as Download Trait. multiplier 2 stored 2000px PNGs, four
    // times the localStorage space, for a trait that is only ever shown at 1000.
    const dataURL = canvas.toDataURL({
      format: 'png',
      quality: 1,
      withoutTransform: false
    });

    canvas.setBackgroundColor(originalBackground ?? 'transparent', () => {
      if (baseImage && originalOpacity !== undefined) {
        baseImage.set({ opacity: originalOpacity });
      }
      
      hiddenTraits.forEach(({ object, originalVisibility }) => {
        object.set({ visible: originalVisibility });
      });
      
      safeRenderAll(canvas);
    });

    const newTrait: SavedTrait = {
      id: Date.now().toString(),
      name: traitName.trim(),
      data: dataURL,
      timestamp: Date.now(),
      isVisible: false
    };

    const updatedTraits = [...savedTraits, newTrait];
    // Storage first: a trait that only lived in React state vanished on reload.
    if (!persistTraits(updatedTraits)) {
      setError("Browser storage is full, so this trait wasn't saved. Download it, or delete some saved traits.");
      return;
    }
    setError(null);
    setSavedTraits(updatedTraits);
    setTraitName('');
  });
};

export const downloadTrait = (
  canvas: fabric.Canvas,
  traitName: string,
  downloadMode: 'trait' | 'character',
  baseImage: fabric.Image | null,
  loadedTraits: Map<string, fabric.Image>
) => {
  if (!canvas) return;

  if (downloadMode === 'trait') {
    const originalOpacity = baseImage?.opacity;
    if (baseImage) {
      baseImage.set({ opacity: 0 });
      safeRenderAll(canvas);
    }

    const hiddenTraits: { object: fabric.Image; originalVisibility: boolean }[] = [];
    loadedTraits.forEach((traitObject) => {
      if (traitObject.visible) {
        hiddenTraits.push({ object: traitObject, originalVisibility: true });
        traitObject.set({ visible: false });
      }
    });
    
    const originalBackground = canvas.backgroundColor;
    canvas.setBackgroundColor('transparent', () => {
      safeRenderAll(canvas);
      
      const dataURL = canvas.toDataURL({
        format: 'png',
        quality: 1,
        withoutTransform: false
      });

      canvas.setBackgroundColor(originalBackground ?? 'transparent', () => {
        if (baseImage && originalOpacity !== undefined) {
          baseImage.set({ opacity: originalOpacity });
        }
        
        hiddenTraits.forEach(({ object, originalVisibility }) => {
          object.set({ visible: originalVisibility });
        });
        
        safeRenderAll(canvas);
      });

      const link = document.createElement('a');
      link.download = `${traitName || 'ping-trait'}.png`;
      link.href = dataURL;
      link.click();
    });
  } else {
    const originalBackground = canvas.backgroundColor;

    canvas.setBackgroundColor('#ffffff', () => {
      safeRenderAll(canvas);

      const dataURL = canvas.toDataURL({
        format: 'png',
        quality: 1,
        withoutTransform: false,
      });

      canvas.setBackgroundColor(originalBackground ?? 'transparent', () => {
        safeRenderAll(canvas);
      });

      const link = document.createElement('a');
      link.download = `${traitName || 'ping-character'}.png`;
      link.href = dataURL;
      link.click();
    });
  }
};

export const deleteTrait = (
  id: string,
  canvas: fabric.Canvas | null,
  loadedTraits: Map<string, fabric.Image>,
  setLoadedTraits: (traits: Map<string, fabric.Image>) => void,
  savedTraits: SavedTrait[],
  setSavedTraits: (traits: SavedTrait[]) => void
) => {
  const fabricObject = loadedTraits.get(id);
  if (fabricObject && canvas) {
    canvas.remove(fabricObject);
    safeRenderAll(canvas);
  }
  
  const newLoadedTraits = new Map(loadedTraits);
  newLoadedTraits.delete(id);
  setLoadedTraits(newLoadedTraits);
  
  const updatedTraits = savedTraits.filter(trait => trait.id !== id);
  setSavedTraits(updatedTraits);
  persistTraits(updatedTraits);
};

export const downloadIndividualTrait = (trait: SavedTrait) => {
  const link = document.createElement('a');
  link.download = `${trait.name}.png`;
  link.href = trait.data;
  link.click();
};

export const toggleTrait = (
  trait: SavedTrait,
  canvas: fabric.Canvas,
  loadedTraits: Map<string, fabric.Image>,
  setLoadedTraits: (traits: Map<string, fabric.Image>) => void,
  savedTraits: SavedTrait[],
  setSavedTraits: (traits: SavedTrait[]) => void,
  baseImage: fabric.Image | null
) => {
  const existingObject = loadedTraits.get(trait.id);
  
  if (existingObject) {
    const newVisibility = !trait.isVisible;
    existingObject.set({ visible: newVisibility });
    
    const updatedTraits = savedTraits.map(t => 
      t.id === trait.id ? { ...t, isVisible: newVisibility } : t
    );
    setSavedTraits(updatedTraits);
    persistTraits(updatedTraits);

    safeRenderAll(canvas);
  } else {
    fabric.Image.fromURL(trait.data, (img) => {
      const canvasWidth = canvas.width!;
      const canvasHeight = canvas.height!;
      const scaleX = canvasWidth / img.width!;
      const scaleY = canvasHeight / img.height!;
      
      img.set({
        left: 0,
        top: 0,
        originX: 'left',
        originY: 'top',
        scaleX: scaleX,
        scaleY: scaleY,
        selectable: false,
        evented: false,
        name: `trait-${trait.id}`,
        visible: true
      });
      
      canvas.add(img);
      
      if (baseImage) {
        canvas.sendToBack(baseImage);
      }
      
      loadedTraits.forEach((traitObj) => {
        canvas.bringForward(traitObj, false);
      });
      canvas.bringForward(img, false);
      
      const allObjects = canvas.getObjects();
      allObjects.forEach(obj => {
        if (obj.name !== 'baseImage' && !obj.name?.startsWith('trait-')) {
          canvas.bringToFront(obj);
        }
      });
      
      const newLoadedTraits = new Map(loadedTraits);
      newLoadedTraits.set(trait.id, img);
      setLoadedTraits(newLoadedTraits);
      
      const updatedTraits = savedTraits.map(t => 
        t.id === trait.id ? { ...t, isVisible: true } : t
      );
      setSavedTraits(updatedTraits);
      persistTraits(updatedTraits);

      safeRenderAll(canvas);
    });
  }
};