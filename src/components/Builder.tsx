import { motion } from 'framer-motion';
import { Palette, Sparkles } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import CharacterPreview from '../components/CharacterPreview';
import TextTools, { TextElement } from '../components/TextTools';
import TraitSelector from '../components/TraitSelector';
import { initializeTraits } from '../data/traits';
import { CategoryOption, Trait } from '../types';
import { EMPTY_TRAIT_CHANCE } from '../utils/constants';

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

  const handleTextElementsChange = (elements: TextElement[]) => {
    setTextElements(elements);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleClearAll = () => {
    setSelectedTraits([]);
  };

  const handleRandomize = () => {
    const newSelectedTraits: Trait[] = [];
    
    categories.forEach(category => {
      // Check if this category should be empty based on EMPTY_TRAIT_CHANCE
      if (Math.random() >= EMPTY_TRAIT_CHANCE) {
        // Get traits for this category
        const categoryTraits = traits.filter(trait => trait.category === category.id);
        
        if (categoryTraits.length > 0) {
          // Select a random trait from this category
          const randomIndex = Math.floor(Math.random() * categoryTraits.length);
          newSelectedTraits.push(categoryTraits[randomIndex]);
        }
      }
    });
    
    setSelectedTraits(newSelectedTraits);
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center max-w-[1600px] mx-auto px-4 py-12">
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
    <div className="w-full max-w-[1600px] mx-auto px-4 py-6">
      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 h-[800px]">
        
        {/* Left Column - Character Preview */}
        <motion.div 
          className="xl:col-span-1 flex flex-col"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <div className="relative h-full">
            {/* Decorative background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-purple-600/5 to-pink-600/10 rounded-3xl blur-xl -z-10 scale-105" />
            
            <div className="bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl border border-border/50 rounded-2xl p-6 shadow-2xl h-full flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
                  Your Character
                </h2>
              </div>
              
              <div className="flex-1 flex items-center justify-center">
                <CharacterPreview
                  selectedTraits={selectedTraits}
                  textElements={textElements}
                  onTextElementsChange={handleTextElementsChange}
                  onReset={handleReset}
                  onRandomize={handleRandomize}
                />
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Right Column - Split into Trait Selector and Text Tools */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          
          {/* Trait Selector - Takes most of the space */}
          <motion.div 
            className="flex-1"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <div className="relative h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-primary/5 to-blue-600/10 rounded-3xl blur-xl -z-10 scale-105" />
              
              <div className="bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl h-full flex flex-col overflow-hidden">
                <div className="flex items-center gap-3 p-6 pb-4 flex-shrink-0">
                  <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                    <Palette className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
                    Choose Traits
                  </h2>
                </div>
                
                <div className="flex-1 px-6 pb-6 min-h-0">
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
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Text Tools - Compact bottom section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="h-48 flex-shrink-0"
          >
            <div className="relative h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-600/10 via-purple-600/5 to-indigo-600/10 rounded-3xl blur-xl -z-10 scale-105" />
              
              <div className="bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl border border-border/50 rounded-2xl p-6 shadow-2xl h-full">
                <TextTools onTextElementsChange={handleTextElementsChange} />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Builder;