import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { ScrollArea } from '../components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { Upload, Check } from 'lucide-react';
import { Trait, CategoryOption } from '../types';
import { placeholderTraits } from '../data/traits';

interface TraitSelectorProps {
  categories: CategoryOption[];
  traits: Trait[];
  selectedCategory: string;
  selectedTraits: Record<string, Trait | null>;
  onCategoryChange: (category: string) => void;
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
          const uploadedTrait: Trait = {
            id: `uploaded-${Date.now()}`,
            name: 'Uploaded Trait',
            category: category as any,
            imageSrc
          };
          // Add the uploaded trait to our state
          setUploadedTraits(prev => ({
            ...prev,
            [category]: [...prev[category as keyof typeof prev], uploadedTrait]
          }));
          // Select the newly uploaded trait
          onTraitSelect(uploadedTrait);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  return (
    <Card className="flex flex-col overflow-hidden shadow-lg border-2 border-border/50 bg-gradient-to-br from-card to-card/95 max-w-[500px] mx-auto">
      {/* Category tabs */}
      <Tabs value={selectedCategory} onValueChange={onCategoryChange}>
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
      <ScrollArea className="h-[350px]">
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

interface CategoryTabProps {
  category: CategoryOption;
  isSelected: boolean;
  onClick: () => void;
}

const CategoryTab: React.FC<CategoryTabProps> = ({ category, isSelected, onClick }) => {
  return (
    <motion.button
      className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
        isSelected
          ? 'bg-indigo-600 text-white'
          : 'bg-transparent text-gray-600 hover:bg-gray-200'
      }`}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {category.label}
    </motion.button>
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
      className={`relative cursor-pointer rounded-lg overflow-hidden border ${
        isSelected
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
          className={`w-full h-full object-contain p-2 transition-transform duration-200 ${
            isSelected ? 'scale-95' : ''
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