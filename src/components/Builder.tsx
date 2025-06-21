import { motion } from 'framer-motion';
import { Palette, Sparkles } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import CharacterPreview from '../components/CharacterPreview';
import TextTools, { TextElement } from '../components/TextTools';
import TraitSelector from '../components/TraitSelector';
import { initializeTraits } from '../data/traits';
import { CategoryOption, Trait } from '../types';
import { EMPTY_TRAIT_CHANCE } from '../utils/constants';

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
  const [searchQuery, setSearchQuery] = useState('');
  
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
    // Clear search when category is manually selected
    setSearchQuery('');
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

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    // Clear category selection when searching
    if (query.trim()) {
      // Don't change selectedCategory to maintain UI state, but the search will override category filtering
    }
  };
  const handleRandomize = () => {
    const newSelectedTraits: Record<string, Trait | null> = {};
    
    categories.forEach(category => {
      // Check if this category should be empty based on EMPTY_TRAIT_CHANCE
      if (Math.random() < EMPTY_TRAIT_CHANCE) {
        newSelectedTraits[category.id] = null;
      } else {
        // Get traits for this category
        const categoryTraits = traits.filter(trait => trait.category === category.id);
        
        if (categoryTraits.length > 0) {
          // Select a random trait from this category
          const randomIndex = Math.floor(Math.random() * categoryTraits.length);
          newSelectedTraits[category.id] = categoryTraits[randomIndex];
        } else {
          newSelectedTraits[category.id] = null;
        }
      }
    });
    
    setSelectedTraits(newSelectedTraits);
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center max-w-[1400px] mx-auto px-2 sm:px-4 py-12">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="relative mx-auto mb-6"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full" />
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkles className="w-6 h-6 text-primary" />
            </motion.div>
          </motion.div>
          <motion.h3 
            className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600 mb-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Loading Traits...
          </motion.h3>
          <motion.p 
            className="text-muted-foreground"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            Preparing your character customization experience
          </motion.p>
        </motion.div>
      </div>
    );
  }
  
  return (
    <div className="flex items-start justify-center max-w-[1400px] mx-auto px-1 sm:px-2 py-2">
      <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 lg:gap-12 w-full">
        {/* Character Preview Section */}
        <motion.div 
          className="w-full lg:w-[500px] lg:ml-auto lg:flex-shrink-0"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <div className="relative">
            {/* Decorative background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-purple-600/5 to-pink-600/10 rounded-2xl blur-xl -z-10 scale-105" />
            
            <div className="bg-gradient-to-br from-background/90 to-background/70 backdrop-blur-sm border border-border/50 rounded-xl p-4 shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
                  Your Character
                </h2>
              </div>
              
              <CharacterPreview
                selectedTraits={selectedTraits}
                textElements={textElements}
                onTextElementsChange={handleTextElementsChange}
                onReset={handleReset}
                onRandomize={handleRandomize}
              />
            </div>
          </div>
        </motion.div>
        
        {/* Controls Section */}
        <motion.div 
          className="w-full lg:w-[400px] lg:mr-auto lg:flex-shrink-0 pb-4 sm:pb-6 space-y-4"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          {/* Trait Selector */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-primary/5 to-blue-600/10 rounded-2xl blur-xl -z-10 scale-105" />
            
            <div className="bg-gradient-to-br from-background/90 to-background/70 backdrop-blur-sm border border-border/50 rounded-xl p-4 shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                  <Palette className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
                  Choose Traits
                </h2>
              </div>
              
              <TraitSelector
                categories={categories}
                traits={traits}
                selectedCategory={selectedCategory}
                selectedTraits={selectedTraits}
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
                onCategoryChange={handleCategoryChange}
                onTraitSelect={handleTraitSelect}
              />
            </div>
          </div>
          
          {/* Text Tools */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-pink-600/10 via-purple-600/5 to-indigo-600/10 rounded-2xl blur-xl -z-10 scale-105" />
            
            <div className="bg-gradient-to-br from-background/90 to-background/70 backdrop-blur-sm border border-border/50 rounded-xl p-4 shadow-xl">
              <TextTools onTextElementsChange={handleTextElementsChange} />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Builder;