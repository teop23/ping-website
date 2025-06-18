/* eslint-disable @typescript-eslint/no-explicit-any */
import { CategoryName } from '@/pages/Builder';
import { motion } from 'framer-motion';
import { Check, Upload, Move, RotateCw, ZoomIn, ZoomOut } from 'lucide-react';
import React from 'react';
import { ScrollArea } from '../components/ui/scroll-area';
import { CategoryOption, Trait } from '../types';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface TraitSelectorProps {
  categories: CategoryOption[];
  traits: Trait[];
  selectedCategory: string;
  selectedTraits: Record<string, Trait | null>;
  onCategoryChange: (category: CategoryName) => void;
  onTraitSelect: (trait: Trait) => void;
}

interface UploadedTraitExtended extends Trait {
  scale?: number;
  rotation?: number;
  offsetX?: number;
  offsetY?: number;
}
const TraitSelector: React.FC<TraitSelectorProps> = ({
  categories,
  traits,
  selectedCategory,
  selectedTraits,
  onCategoryChange,
  onTraitSelect
}) => {
  const [uploadedTraits, setUploadedTraits] = React.useState<Record<string, UploadedTraitExtended[]>>({
    aura: [],
    head: [],
    face: [],
    mouth: [],
    body: [],
    right_hand: [],
    left_hand: [],
    accessory: []
  });
  const [editingTrait, setEditingTrait] = React.useState<string | null>(null);

  // Filter traits by the selected category, including uploaded traits
  const filteredTraits = [
    ...uploadedTraits[selectedCategory as keyof typeof uploadedTraits] || [],
    ...traits.filter(trait => trait.category === selectedCategory)
  ];

  const handleUpload = (category: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageSrc = e.target?.result as string;
          const traitImg = new Image();
          traitImg.onload = () => {
            const uploadedTrait: UploadedTraitExtended = {
              id: `uploaded-${category}-${Date.now()}`,
              name: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
              category: category as any,
              imageSrc: imageSrc,
              scale: 1,
              rotation: 0,
              offsetX: 0,
              offsetY: 0,
            };

            // Add the uploaded trait to our state
            setUploadedTraits(prev => ({
              ...prev,
              [category]: [...(prev[category as keyof typeof prev] || []), uploadedTrait]
            }));

            // Select the newly uploaded trait
            onTraitSelect(uploadedTrait);
          };

          traitImg.src = imageSrc;
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const updateUploadedTrait = (traitId: string, updates: Partial<UploadedTraitExtended>) => {
    setUploadedTraits(prev => {
      const newTraits = { ...prev };
      for (const category in newTraits) {
        newTraits[category as keyof typeof newTraits] = newTraits[category as keyof typeof newTraits].map(trait => 
          trait.id === traitId ? { ...trait, ...updates } : trait
        );
      }
      return newTraits;
    });

    // Update selected trait if it's currently selected
    const currentlySelected = Object.values(selectedTraits).find(trait => trait?.id === traitId);
    if (currentlySelected) {
      onTraitSelect({ ...currentlySelected, ...updates } as Trait);
    }
  };

  const handleScaleChange = (traitId: string, delta: number) => {
    const trait = Object.values(uploadedTraits).flat().find(t => t.id === traitId) as UploadedTraitExtended;
    if (trait) {
      const newScale = Math.max(0.1, Math.min(3, (trait.scale || 1) + delta));
      updateUploadedTrait(traitId, { scale: newScale });
    }
  };

  const handleRotationChange = (traitId: string) => {
    const trait = Object.values(uploadedTraits).flat().find(t => t.id === traitId) as UploadedTraitExtended;
    if (trait) {
      const newRotation = ((trait.rotation || 0) + 90) % 360;
      updateUploadedTrait(traitId, { rotation: newRotation });
    }
  };

  const handleOffsetChange = (traitId: string, deltaX: number, deltaY: number) => {
    const trait = Object.values(uploadedTraits).flat().find(t => t.id === traitId) as UploadedTraitExtended;
    if (trait) {
      const newOffsetX = Math.max(-100, Math.min(100, (trait.offsetX || 0) + deltaX));
      const newOffsetY = Math.max(-100, Math.min(100, (trait.offsetY || 0) + deltaY));
      updateUploadedTrait(traitId, { 
        offsetX: newOffsetX, 
        offsetY: newOffsetY 
      });
    }
  };

  return (
    <TooltipProvider>
    <Card className="flex flex-row h-[calc(100vh-16rem)] sm:h-auto shadow-lg border-2 border-border/50 bg-gradient-to-br from-card to-card/95 max-w-[500px] mx-auto">
      {/* Left Sidebar - Categories */}
      <div className="w-24 sm:w-28 flex-shrink-0 border-r border-border bg-gradient-to-b from-muted/50 to-muted/30">
        <div className="p-2 space-y-1">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "ghost"}
              size="sm"
              onClick={() => onCategoryChange(category.id as CategoryName)}
              className={`w-full h-auto py-3 px-2 flex flex-col items-center justify-center text-xs font-medium transition-all ${
                selectedCategory === category.id
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'hover:bg-muted/80 text-muted-foreground hover:text-foreground'
              }`}
            >
              <span className="text-center leading-tight">{category.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Right Content - Traits Grid */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="p-3 border-b border-border bg-gradient-to-r from-background to-muted/20">
          <h3 className="text-sm font-semibold text-foreground">
            {categories.find(c => c.id === selectedCategory)?.label || 'Traits'}
          </h3>
        </div>

        {/* Traits Grid */}
        <ScrollArea className="flex-1">
          <CardContent className="p-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {/* Upload button */}
            <motion.button
              className="relative cursor-pointer rounded-lg overflow-hidden border-2 border-dashed border-primary/30 hover:border-primary bg-gradient-to-br from-background to-muted/50"
              onClick={() => handleUpload(selectedCategory)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              <div className="aspect-square bg-card flex flex-col items-center justify-center gap-2 text-muted-foreground">
                <Upload size={20} className="text-primary/60" />
                <span className="text-xs">Upload</span>
              </div>
            </motion.button>

            {filteredTraits.map((trait) => {
              const isSelected = selectedTraits[trait.category]?.name === trait.name && 
                                selectedTraits[trait.category]?.category === trait.category;

              return (
                <TraitCard
                  key={`${trait.name}-${trait.category}`}
                  trait={trait}
                  isSelected={isSelected}
                  imageSrc={trait.imageSrc}
                  isUploaded={trait.id.startsWith('uploaded-')}
                  onClick={() => onTraitSelect(trait)}
                  onEdit={trait.id.startsWith('uploaded-') ? () => setEditingTrait(editingTrait === trait.id ? null : trait.id) : undefined}
                  isEditing={editingTrait === trait.id}
                  onScaleChange={trait.id.startsWith('uploaded-') ? (delta) => handleScaleChange(trait.id, delta) : undefined}
                  onRotationChange={trait.id.startsWith('uploaded-') ? () => handleRotationChange(trait.id) : undefined}
                  onOffsetChange={trait.id.startsWith('uploaded-') ? (deltaX, deltaY) => handleOffsetChange(trait.id, deltaX, deltaY) : undefined}
                  scale={(trait as UploadedTraitExtended).scale}
                  rotation={(trait as UploadedTraitExtended).rotation}
                />
              );
            })}

            {/* Show message if no traits available */}
            {filteredTraits.length === 0 && (
              <div className="col-span-full text-center py-6 text-muted-foreground">
                <p className="text-sm">No traits available for this category</p>
                <p className="text-xs mt-2">Upload your first trait using the upload button above!</p>
              </div>
            )}
          </CardContent>
        </ScrollArea>
      </div>
    </Card>
    </TooltipProvider>
  );
};

interface TraitCardProps {
  trait: Trait;
  isSelected: boolean;
  imageSrc: string;
  isUploaded?: boolean;
  onClick: () => void;
  onEdit?: () => void;
  isEditing?: boolean;
  onScaleChange?: (delta: number) => void;
  onRotationChange?: () => void;
  onOffsetChange?: (deltaX: number, deltaY: number) => void;
  scale?: number;
  rotation?: number;
}

const TraitCard: React.FC<TraitCardProps> = ({ 
  trait, isSelected, imageSrc, isUploaded, onClick, onEdit, isEditing, 
  onScaleChange, onRotationChange, onOffsetChange, scale = 1, rotation = 0 
}) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
    <motion.div
      className={`relative cursor-pointer rounded-lg overflow-hidden border ${isSelected
        ? 'border-primary ring-2 ring-primary/20'
        : 'border-border hover:border-primary/50'
        } group`}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      style={{ position: 'relative', overflow: 'visible' }}
    >
      <div className="aspect-square bg-card flex items-center justify-center pb-6">
        <img
          src={imageSrc}
          alt={trait.name}
          className={`w-full h-full object-contain p-2 pb-0 transition-transform duration-200 ${isSelected ? 'scale-95' : ''
            }`}
          style={{
            transform: `scale(${scale}) rotate(${rotation}deg)`
          }}
          onError={(e) => {
            // Fallback to a placeholder if image fails to load
            const target = e.target as HTMLImageElement;
            target.src = `https://via.placeholder.com/100x100/9CA3AF/ffffff?text=${encodeURIComponent(trait.name)}`;
          }}
        />
      </div>

      {/* Edit button for uploaded images */}
      {isUploaded && (
        <button
          onClick={(e) => { e.stopPropagation(); onEdit && onEdit(); }}
          className="absolute top-2 left-2 bg-blue-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Move size={12} />
        </button>
      )}

      {isSelected && (
        <motion.div
          className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
        >
          <Check size={14} />
        </motion.div>
      )}

      {/* Edit controls for uploaded images */}
      {isUploaded && isEditing && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute left-0 right-0 top-full mt-2 bg-background/95 backdrop-blur-sm border border-border/50 rounded-lg p-3 shadow-lg z-50 min-w-[200px]"
          style={{ zIndex: 1000 }}
        >
          {/* Scale controls */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium">Scale:</span>
            <div className="flex items-center gap-1">
              <button
                onClick={(e) => { e.stopPropagation(); onScaleChange && onScaleChange(-0.1); }}
                className="bg-muted hover:bg-muted/80 rounded p-1 transition-colors"
              >
                <ZoomOut size={12} />
              </button>
              <span className="text-xs min-w-[4ch] text-center font-mono">{Math.round(scale * 100)}%</span>
              <button
                onClick={(e) => { e.stopPropagation(); onScaleChange && onScaleChange(0.1); }}
                className="bg-muted hover:bg-muted/80 rounded p-1 transition-colors"
              >
                <ZoomIn size={12} />
              </button>
            </div>
          </div>

          {/* Rotation control */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium">Rotate:</span>
            <div className="flex items-center gap-1">
              <button
                onClick={(e) => { e.stopPropagation(); onRotationChange && onRotationChange(); }}
                className="bg-muted hover:bg-muted/80 rounded p-1 transition-colors"
              >
                <RotateCw size={12} />
              </button>
              <span className="text-xs min-w-[4ch] text-center font-mono">{rotation}°</span>
            </div>
          </div>

          {/* Position controls */}
          <div>
            <div className="text-xs font-medium mb-2">Position:</div>
            <div className="grid grid-cols-3 gap-1">
              <button onClick={(e) => { e.stopPropagation(); onOffsetChange && onOffsetChange(-5, -5); }} className="bg-muted hover:bg-muted/80 rounded p-2 text-xs transition-colors">↖</button>
              <button onClick={(e) => { e.stopPropagation(); onOffsetChange && onOffsetChange(0, -5); }} className="bg-muted hover:bg-muted/80 rounded p-2 text-xs transition-colors">↑</button>
              <button onClick={(e) => { e.stopPropagation(); onOffsetChange && onOffsetChange(5, -5); }} className="bg-muted hover:bg-muted/80 rounded p-2 text-xs transition-colors">↗</button>
              <button onClick={(e) => { e.stopPropagation(); onOffsetChange && onOffsetChange(-5, 0); }} className="bg-muted hover:bg-muted/80 rounded p-2 text-xs transition-colors">←</button>
              <button onClick={(e) => { e.stopPropagation(); onOffsetChange && onOffsetChange(0, 0); }} className="bg-muted hover:bg-muted/80 rounded p-2 text-xs transition-colors bg-primary/20">⌂</button>
              <button onClick={(e) => { e.stopPropagation(); onOffsetChange && onOffsetChange(5, 0); }} className="bg-muted hover:bg-muted/80 rounded p-2 text-xs transition-colors">→</button>
              <button onClick={(e) => { e.stopPropagation(); onOffsetChange && onOffsetChange(-5, 5); }} className="bg-muted hover:bg-muted/80 rounded p-2 text-xs transition-colors">↙</button>
              <button onClick={(e) => { e.stopPropagation(); onOffsetChange && onOffsetChange(0, 5); }} className="bg-muted hover:bg-muted/80 rounded p-2 text-xs transition-colors">↓</button>
              <button onClick={(e) => { e.stopPropagation(); onOffsetChange && onOffsetChange(5, 5); }} className="bg-muted hover:bg-muted/80 rounded p-2 text-xs transition-colors">↘</button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Always visible trait name at bottom */}
      <div className="absolute inset-x-0 bottom-0 p-1.5 bg-background/95 backdrop-blur-sm border-t border-border/50">
        <p className="text-xs text-center text-foreground font-medium truncate leading-tight">
          {trait.name}
        </p>
      </div>
    </motion.div>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs">
        <p className="text-sm font-medium">{trait.name}</p>
        {isUploaded && <p className="text-xs text-muted-foreground">Click edit button to resize/move</p>}
      </TooltipContent>
    </Tooltip>
  );
};

export default TraitSelector;