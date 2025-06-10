/* eslint-disable @typescript-eslint/no-explicit-any */
import { CategoryName } from '@/pages/Builder';
import { motion } from 'framer-motion';
import { Check, Upload } from 'lucide-react';
import React from 'react';
import { ScrollArea } from '../components/ui/scroll-area';
import { placeholderTraits } from '../data/traits';
import { CategoryOption, Trait } from '../types';
import { Card, CardContent } from './ui/card';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';

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
    head: [],
    face: [],
    body: [],
    accessory: []
  });

  // Filter traits by the selected category, including uploaded traits
  const filteredTraits = [
    ...uploadedTraits[selectedCategory as keyof typeof uploadedTraits],
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
          
          // Create images to get their actual dimensions
          const baseImg = new Image();
          const traitImg = new Image();
          
          baseImg.onload = () => {
            traitImg.onload = () => {
              // Create canvas to scale the trait image to match base image dimensions
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');
              
              if (!ctx) return;
              
              // Set canvas size to match base image dimensions
              canvas.width = baseImg.width;
              canvas.height = baseImg.height;
              
              // Calculate scale factor to fit trait image to base image size
              const scaleX = baseImg.width / traitImg.width;
              const scaleY = baseImg.height / traitImg.height;
              
              // For square images, use the same scale for both dimensions
              const scale = Math.min(scaleX, scaleY);
              
              const scaledWidth = traitImg.width * scale;
              const scaledHeight = traitImg.height * scale;
              
              // Center the scaled image on the canvas
              const offsetX = (canvas.width - scaledWidth) / 2;
              const offsetY = (canvas.height - scaledHeight) / 2;
              
              // Clear canvas with transparent background
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              
              // Draw the scaled trait image
              ctx.drawImage(traitImg, offsetX, offsetY, scaledWidth, scaledHeight);
              
              // Convert back to data URL
              const scaledImageSrc = canvas.toDataURL('image/png');
              
              const uploadedTrait: Trait = {
                id: `uploaded-${Date.now()}`,
                name: 'Uploaded Trait',
                category: category as any,
                imageSrc: scaledImageSrc
              };
              
              // Add the uploaded trait to our state
              setUploadedTraits(prev => ({
                ...prev,
                [category]: [...prev[category as keyof typeof prev], uploadedTrait]
              }));
              
              // Select the newly uploaded trait
              onTraitSelect(uploadedTrait);
            };
            
            traitImg.src = imageSrc;
          };
          
          // Load the base image from the ping image source
          baseImg.src = '/src/assets/images/ping.png';
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  return (
    <Card className="flex flex-col h-[calc(100vh-16rem)] sm:h-auto shadow-lg border-2 border-border/50 bg-gradient-to-br from-card to-card/95 max-w-[500px] mx-auto">
      {/* Category tabs */}
      <Tabs value={selectedCategory} onValueChange={() => onCategoryChange(selectedCategory as CategoryName)}>
        <TabsList className="w-full justify-start bg-gradient-to-r from-muted to-muted/80 overflow-x-auto">
          {categories.map((category) => (
            <TabsTrigger
              key={category.id}
              value={category.id}
              className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary/10 data-[state=active]:to-primary/5"
            >
              {category.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Traits grid */}
      <ScrollArea className="flex-1">
        <CardContent className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {/* Upload button */}
          <motion.button
            className="relative cursor-pointer rounded-lg overflow-hidden border-2 border-dashed border-primary/30 hover:border-primary bg-gradient-to-br from-background to-muted/50"
            onClick={() => handleUpload(selectedCategory)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            <div className="aspect-square bg-card flex flex-col items-center justify-center gap-2 text-muted-foreground">
              <Upload size={24} className="text-primary/60" />
              <span className="text-xs">Upload</span>
            </div>
          </motion.button>

          {filteredTraits.map((trait) => {
            // Get placeholder image for this trait
            const placeholderImage = placeholderTraits[trait.category as keyof typeof placeholderTraits]?.[trait.id];
            const isSelected = selectedTraits[trait.category]?.id === trait.id;

            return (
              <TraitCard
                key={trait.id}
                trait={trait}
                isSelected={isSelected}
                imageSrc={placeholderImage || trait.imageSrc}
                onClick={() => onTraitSelect(trait)}
              />
            );
          })}
        </CardContent>
      </ScrollArea>
    </Card>
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
    <motion.div
      className={`relative cursor-pointer rounded-lg overflow-hidden border ${isSelected
        ? 'border-primary'
        : 'border-border hover:border-primary/50'
        }`}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      initial={{ overflow: 'hidden' }}
    >
      <div className="aspect-square bg-card flex items-center justify-center">
        <img
          src={imageSrc}
          alt={trait.name}
          className={`w-full h-full object-contain p-2 transition-transform duration-200 ${isSelected ? 'scale-95' : ''
            }`}
        />
      </div>

      {isSelected && (
        <motion.div
          className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Check size={16} />
        </motion.div>
      )}

      <motion.div
        className="absolute inset-x-0 bottom-0 p-2 bg-secondary/90 text-secondary-foreground text-xs text-center truncate"
        initial={{ y: '100%' }}
        whileHover={{ y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {trait.name}
      </motion.div>
    </motion.div>
  );
};

export default TraitSelector;