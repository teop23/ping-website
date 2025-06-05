import React, { useState } from 'react';
import { motion } from 'framer-motion';
import CharacterPreview from '../components/CharacterPreview';
import TraitSelector from '../components/TraitSelector';
import { categories, traits } from '../data/traits';
import { Trait } from '../types';

const Builder: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState(categories[0].id);
  const [selectedTraits, setSelectedTraits] = useState<Record<string, Trait | null>>({
    head: null,
    face: null,
    body: null,
    accessory: null
  });
  
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
  
  const handleReset = () => {
    setSelectedTraits({
      head: null,
      face: null,
      body: null,
      accessory: null
    });
  };
  
  return (
    <div className="container mx-auto px-4">
      <div className="flex gap-8 items-center justify-center">
        <div className="w-[600px]">
          <CharacterPreview
            selectedTraits={selectedTraits}
            onReset={handleReset}
          />
        </div>
        
        <div className="w-[500px]">
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