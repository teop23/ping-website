import { motion } from 'framer-motion';
import { Palette, Sparkles, Type, Plus } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import CharacterPreview from '../components/CharacterPreview';
import TextToolsModal, { TextElement } from '../components/TextToolsModal';
import TraitSelector from '../components/TraitSelector';
import { initializeTraits } from '../data/traits';
import { CategoryOption, Trait } from '../types';
import { EMPTY_TRAIT_CHANCE } from '../utils/constants';
import { Button } from './ui/button';

const Builder: React.FC = () => {
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [traits, setTraits] = useState<Trait[]>([]);
  const [selectedTraits, setSelectedTraits] = useState<Trait[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [textElements, setTextElements] = useState<TextElement[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isTextModalOpen, setIsTextModalOpen] = useState(false);

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
      <div className="flex items-center justify-center w-full h-full py-12">
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
    <div className="w-full h-full flex flex-col overflow-hidden p-1 sm:p-2 lg:p-4">
      {/* Mobile Layout - Stack vertically */}
      <div className="flex flex-col lg:flex-row gap-2 sm:gap-4 lg:gap-6 w-full flex-1 min-h-0">
        
        {/* Character Preview - Full width on mobile, half on desktop */}
        <div className="w-full lg:w-1/2 h-[40vh] sm:h-[45vh] lg:h-full order-1 lg:order-1 flex-shrink-0">
          <div className="h-full flex flex-col gap-2 bg-gradient-to-br from-background/90 to-background/70 backdrop-blur-sm border border-border/50 rounded-xl p-2 sm:p-3 lg:p-4 shadow-xl">
            <div className="flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
                <h2 className="text-base sm:text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
                  Your Character
                </h2>
              </div>
            </div>

            <div className="flex-1 min-h-0 overflow-hidden">
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

        {/* Trait Selector - Full width on mobile, half on desktop */}
        <div className="w-full lg:w-1/2 flex-1 lg:h-full order-2 lg:order-2 min-h-[50vh] lg:min-h-0">
          <div className="h-full bg-gradient-to-br from-background/90 to-background/70 backdrop-blur-sm border border-border/50 rounded-xl p-2 sm:p-3 lg:p-4 shadow-xl flex flex-col">
            <div className="flex items-center justify-between mb-2 sm:mb-3 flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                  <Palette className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
                <h2 className="text-base sm:text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
                  Choose Traits
                </h2>
              </div>
              
              {/* Text Tools Button - Right side */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsTextModalOpen(true)}
                className="flex items-center gap-1 sm:gap-2 hover:bg-primary/10 hover:border-primary/50 text-xs sm:text-sm px-2 sm:px-3"
              >
                <Type className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Text Tools</span>
                <span className="sm:hidden">Text</span>
              </Button>
            </div>

            <div className="flex-1 min-h-0">
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
      </div>

      {/* Text Tools Modal */}
      <TextToolsModal
        isOpen={isTextModalOpen}
        onClose={() => setIsTextModalOpen(false)}
        onTextElementsChange={handleTextElementsChange}
      />
    </div>
  );
};

export default Builder;