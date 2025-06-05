import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '../components/ui/card';
import { ScrollArea } from '../components/ui/scroll-area';
import { Image, X } from 'lucide-react';
import CharacterPreview from '../components/CharacterPreview';
import TraitSelector from '../components/TraitSelector';
import { categories, traits } from '../data/traits';
import { Trait } from '../types';

interface SavedTrait {
  name: string;
  data: string;
  timestamp: number;
}

const Builder: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState(categories[0].id);
  const [selectedTraits, setSelectedTraits] = useState<Record<string, Trait | null>>({
    head: null,
    face: null,
    body: null,
    accessory: null
  });
  
  const [savedTraits, setSavedTraits] = React.useState<SavedTrait[]>([]);
  const [selectedSavedTraits, setSelectedSavedTraits] = React.useState<SavedTrait[]>([]);
  
  // Load saved traits on mount
  React.useEffect(() => {
    const savedTraitsData = localStorage.getItem('savedTraits');
    if (savedTraitsData) {
      setSavedTraits(JSON.parse(savedTraitsData));
    }
  }, []);
  
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };
  
  const handleTraitSelect = (trait: Trait) => {
    setSelectedTraits(prev => {
      // If the trait is already selected, deselect it
      if (prev[trait.category]?.id === trait.id) {
        return {
          ...prev,
          [trait.category]: null
        };
      }
      
      // Otherwise, select the new trait
      return {
        ...prev,
        [trait.category]: trait
      };
    });
  };
  
  const handleSavedTraitSelect = (trait: SavedTrait) => {
    setSelectedSavedTraits(prev => {
      const isSelected = prev.some(t => t.timestamp === trait.timestamp);
      if (isSelected) {
        return prev.filter(t => t.timestamp !== trait.timestamp);
      } else {
        return [...prev, trait];
      }
    });
  };
  
  const handleReset = () => {
    setSelectedTraits({
      head: null,
      face: null,
      body: null,
      accessory: null
    });
    setSelectedSavedTraits([]);
  };
  
  return (
    <div className="h-full flex items-center justify-center px-4 overflow-hidden">
      <div className="flex gap-8 items-start">
        {/* Saved Traits Panel */}
        <Card className="w-64 flex flex-col">
          <div className="p-4 border-b">
            <h3 className="font-semibold">Saved Traits</h3>
          </div>
          <ScrollArea className="flex-grow h-[350px]">
            <CardContent className="p-4 space-y-2">
              {savedTraits.map((trait) => (
                <motion.div
                  key={trait.timestamp}
                  className={`relative group rounded-lg border p-2 cursor-pointer ${
                    selectedSavedTraits.some(t => t.timestamp === trait.timestamp)
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => handleSavedTraitSelect(trait)}
                >
                  <div className="flex items-center gap-2">
                    <Image size={16} className="text-muted-foreground" />
                    <span className="text-sm truncate flex-grow">{trait.name}</span>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </ScrollArea>
        </Card>
        
        <div className="w-[500px]">
          <CharacterPreview
            selectedTraits={selectedTraits}
            selectedSavedTraits={selectedSavedTraits}
            onReset={handleReset}
          />
        </div>
        
        <div className="w-[400px]">
          <TraitSelector
            categories={categories}
            traits={traits}
            selectedCategory={selectedCategory}
            selectedTraits={selectedTraits}
            onCategoryChange={handleCategoryChange}
            onTraitSelect={handleTraitSelect}
          />
        </div>
      </div>
    </div>
  );
};

export default Builder;