/* eslint-disable @typescript-eslint/no-explicit-any */
import { CategoryName } from '@/pages/Builder';
import { motion } from 'framer-motion';
import { Check, Upload } from 'lucide-react';
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

const TraitSelector: React.FC<TraitSelectorProps> = ({
  categories,
  traits,
  selectedCategory,
  selectedTraits,
  onCategoryChange,
  onTraitSelect
}) => {
  const [uploadedTraits, setUploadedTraits] = React.useState<Record<string, Trait[]>>({
    aura: [],
    head: [],
    face: [],
    mouth: [],
    body: [],
    right_hand: [],
    left_hand: [],
    accessory: []
  });

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
            const uploadedTrait: Trait = {
              id: `uploaded-${category}-${Date.now()}`,
              name: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
              category: category as any,
              imageSrc: imageSrc,
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

  return (
    <TooltipProvider>
    <Card className="flex flex-row h-[calc(100vh-16rem)] sm:h-auto shadow-lg border-2 border-border/50 bg-gradient-to-br from-card to-card/95 max-w-[500px] mx-auto">
      {/* Left Sidebar - Categories */}
      <div className="w-24 sm:w-28 flex-shrink-0 border-r border-border bg-gradient-to-b from-muted/50 to-muted/30 max-h-[300px] overflow-hidden">
        <div className="p-2 space-y-1 h-full overflow-y-auto">
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
        <ScrollArea className="flex-1 max-h-[240px]">
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
                  onClick={() => onTraitSelect(trait)}
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
  onClick: () => void;
}

const TraitCard: React.FC<TraitCardProps> = ({ trait, isSelected, imageSrc, onClick }) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
    <motion.div
      className={`relative cursor-pointer rounded-lg overflow-hidden border ${isSelected
        ? 'border-primary ring-2 ring-primary/20'
        : 'border-border hover:border-primary/50'
        }`}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      initial={{ overflow: 'hidden' }}
    >
      <div className="aspect-square bg-card flex items-center justify-center pb-6">
        <img
          src={imageSrc}
          alt={trait.name}
          className={`w-full h-full object-contain p-2 pb-0 transition-transform duration-200 ${isSelected ? 'scale-95' : ''
            }`}
          onError={(e) => {
            // Fallback to a placeholder if image fails to load
            const target = e.target as HTMLImageElement;
            target.src = `https://via.placeholder.com/100x100/9CA3AF/ffffff?text=${encodeURIComponent(trait.name)}`;
          }}
        />
      </div>

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
      </TooltipContent>
    </Tooltip>
  );
};

export default TraitSelector;