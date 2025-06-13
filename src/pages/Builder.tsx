import React, { useState, useEffect } from 'react';
import CharacterPreview from '../components/CharacterPreview';
import TraitSelector from '../components/TraitSelector';
import TextTools, { TextElement } from '../components/TextTools';
import { initializeTraits } from '../data/traits';
import { Trait, CategoryOption } from '../types';

export type CategoryName = 'aura' | 'head' | 'face' | 'mouth' | 'body' | 'right_hand' | 'left_hand' | 'accessory';

const Builder: React.FC = () => {
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [traits, setTraits] = useState<Trait[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryName>('head');
  const [selectedTraits, setSelectedTraits] = useState<Record<string, Trait | null>>({
    aura: null,
    head: null,
    face: null,
    mouth: null,
    body: null,
    right_hand: null,
    left_hand: null,
    accessory: null
  });
  const [isLoading, setIsLoading] = useState(true);
  const [textElements, setTextElements] = useState<TextElement[]>([]);
  
  // Load traits on component mount
  useEffect(() => {
    const loadTraits = async () => {
      setIsLoading(true);
      try {
        const { traits: loadedTraits, categories: loadedCategories } = await initializeTraits();
        setTraits(loadedTraits);
        setCategories(loadedCategories);
        
        // Set the first available category as selected
        if (loadedCategories.length > 0) {
          setSelectedCategory(loadedCategories[0].id as CategoryName);
        }
      } catch (error) {
        console.error('Error loading traits:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTraits();
  }, []);
  
  const handleCategoryChange = (category: CategoryName) => {
    setSelectedCategory(category);
  };
  
  const handleTraitSelect = (trait: Trait) => {
    setSelectedTraits(prev => {
      // If the trait is already selected, deselect it
      if (prev[trait.category]?.name === trait.name && prev[trait.category]?.category === trait.category) {
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
      aura: null,
      head: null,
      face: null,
      mouth: null,
      body: null,
      right_hand: null,
      left_hand: null,
      accessory: null
    });
  };

  const handleTextElementsChange = (elements: TextElement[]) => {
    setTextElements(elements);
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center max-w-[1400px] mx-auto px-2 sm:px-4 py-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading traits...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex items-start justify-center max-w-[1400px] mx-auto px-2 sm:px-4 py-4">
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8 w-full">
        <div className="w-full lg:w-[500px] lg:ml-auto lg:flex-shrink-0">
          <CharacterPreview
            selectedTraits={selectedTraits}
            textElements={textElements}
            onTextElementsChange={handleTextElementsChange}
            onReset={handleReset}
          />
        </div>
        
        <div className="w-full lg:w-[400px] lg:mr-auto lg:flex-shrink-0 pb-24 sm:pb-8 space-y-6">
          <TraitSelector
            categories={categories}
            traits={traits}
            selectedCategory={selectedCategory}
            selectedTraits={selectedTraits}
            onCategoryChange={handleCategoryChange}
            onTraitSelect={handleTraitSelect}
          />
          
          <TextTools onTextElementsChange={handleTextElementsChange} />
        </div>
      </div>
    </div>
  );
};

export default Builder;