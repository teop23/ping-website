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
    <div className="flex items-start justify-center max-w-[1400px] mx-auto px-2 sm:px-4 py-4">
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8 w-full">
        <div className="w-full lg:w-[500px] lg:ml-auto lg:flex-shrink-0">
          <CharacterPreview
            selectedTraits={selectedTraits}
            onReset={handleReset}
          />
        </div>
        
        <div className="w-full lg:w-[400px] lg:mr-auto lg:flex-shrink-0 pb-24 sm:pb-8">
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