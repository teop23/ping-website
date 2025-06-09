import { fabric } from 'fabric';

export interface SavedTrait {
  id: string;
  name: string;
  data: string;
  timestamp: number;
  isVisible: boolean;
  fabricObject?: fabric.Image;
}

export const saveTrait = (
  canvas: fabric.Canvas,
  traitName: string,
  baseImage: fabric.Image | null,
  loadedTraits: Map<string, fabric.Image>,
  savedTraits: SavedTrait[],
  setSavedTraits: (traits: SavedTrait[]) => void,
  setTraitName: (name: string) => void
) => {
  if (!canvas || !traitName.trim()) return;

  const originalOpacity = baseImage?.opacity;
  if (baseImage) {
    baseImage.set({ opacity: 0 });
    canvas.renderAll();
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
    canvas.renderAll();
    
    const dataURL = canvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 2,
      withoutTransform: false,
      backgroundColor: 'transparent'
    });

    canvas.setBackgroundColor(originalBackground, () => {
      if (baseImage && originalOpacity !== undefined) {
        baseImage.set({ opacity: originalOpacity });
      }
      
      hiddenTraits.forEach(({ object, originalVisibility }) => {
        object.set({ visible: originalVisibility });
      });
      
      canvas.renderAll();
    });

    const newTrait: SavedTrait = {
      id: Date.now().toString(),
      name: traitName.trim(),
      data: dataURL,
      timestamp: Date.now(),
      isVisible: false
    };

    const updatedTraits = [...savedTraits, newTrait];
    setSavedTraits(updatedTraits);
    localStorage.setItem('pingTraits', JSON.stringify(updatedTraits));
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
      canvas.renderAll();
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
      canvas.renderAll();
      
      const dataURL = canvas.toDataURL({
        format: 'png',
        quality: 1,
        withoutTransform: false,
        backgroundColor: 'transparent'
      });

      canvas.setBackgroundColor(originalBackground, () => {
        if (baseImage && originalOpacity !== undefined) {
          baseImage.set({ opacity: originalOpacity });
        }
        
        hiddenTraits.forEach(({ object, originalVisibility }) => {
          object.set({ visible: originalVisibility });
        });
        
        canvas.renderAll();
      });

      const link = document.createElement('a');
      link.download = `${traitName || 'ping-trait'}.png`;
      link.href = dataURL;
      link.click();
    });
  } else {
    const dataURL = canvas.toDataURL({
      format: 'png',
      quality: 1,
      withoutTransform: false,
      backgroundColor: 'white'
    });

    const link = document.createElement('a');
    link.download = `${traitName || 'ping-character'}.png`;
    link.href = dataURL;
    link.click();
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
    canvas.renderAll();
  }
  
  const newLoadedTraits = new Map(loadedTraits);
  newLoadedTraits.delete(id);
  setLoadedTraits(newLoadedTraits);
  
  const updatedTraits = savedTraits.filter(trait => trait.id !== id);
  setSavedTraits(updatedTraits);
  localStorage.setItem('pingTraits', JSON.stringify(updatedTraits));
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
    localStorage.setItem('pingTraits', JSON.stringify(updatedTraits));
    
    canvas.renderAll();
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
      localStorage.setItem('pingTraits', JSON.stringify(updatedTraits));
      
      canvas.renderAll();
    });
  }
};