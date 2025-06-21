import React, { useState, useEffect } from 'react';
import CharacterPreview from '../components/CharacterPreview';
import TraitSelector from '../components/TraitSelector';
import TextTools, { TextElement } from '../components/TextTools';
import { initializeTraits } from '../data/traits';
import { Trait, CategoryOption } from '../types';

const Builder: React.FC = () => {
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [traits, setTraits] = useState<Trait[]>([]);
  const [selectedTraits, setSelectedTraits] = useState<Trait[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [textElements, setTextElements] = useState<TextElement[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Load traits on component mount
  useEffect(() => {
    const loadTraits = async () => {
      setIsLoading(true);
      try {
        const { traits: loadedTraits, categories: loadedCategories } = await initializeTraits();
        setTraits(loadedTraits);
        setCategories(loadedCategories);
      } catch (error) {
        console.error('Error loading traits:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTraits();
  }, []);
  
  const handleTraitSelect = (trait: Trait) => {
    setSelectedTraits(prev => [...prev, trait]);
  };

  const handleTraitRemove = (trait: Trait) => {
    setSelectedTraits(prev => 
      prev.filter(selected => 
        !(selected.id === trait.id && selected.category === trait.category)
      )
    );
  };
  
  const handleReset = () => {
    setSelectedTraits([]);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleClearAll = () => {
    setSelectedTraits([]);
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
            selectedTraits={selectedTraits}
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            onTraitSelect={handleTraitSelect}
            onTraitRemove={handleTraitRemove}
            onClearAll={handleClearAll}
          />
          
          <TextTools onTextElementsChange={handleTextElementsChange} />
        </div>
      </div>
    </div>
  );
};

export default Builder;