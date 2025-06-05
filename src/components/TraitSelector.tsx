import React from 'react';
import { motion } from 'framer-motion';
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
  // Filter traits by the selected category
  const filteredTraits = traits.filter(trait => trait.category === selectedCategory);

  return (
    <div className="flex flex-col bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Category tabs */}
      <div className="flex overflow-x-auto bg-gray-100 border-b border-gray-200 p-1">
        {categories.map((category) => (
          <CategoryTab
            key={category.id}
            category={category}
            isSelected={selectedCategory === category.id}
            onClick={() => onCategoryChange(category.id)}
          />
        ))}
      </div>
      
      {/* Traits grid */}
      <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 overflow-y-auto max-h-96">
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
      </div>
    </div>
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
      className={`relative cursor-pointer rounded-lg overflow-hidden ${
        isSelected
          ? 'ring-4 ring-indigo-500 ring-opacity-75'
          : 'hover:ring-2 hover:ring-indigo-300'
      }`}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
    >
      <div className="aspect-square bg-gray-50 flex items-center justify-center">
        <img
          src={imageSrc}
          alt={trait.name}
          className="w-full h-full object-contain p-2"
        />
      </div>
      
      {isSelected && (
        <div className="absolute top-2 right-2 bg-indigo-600 text-white rounded-full w-6 h-6 flex items-center justify-center">
          ✓
        </div>
      )}
      
      <div className="p-2 bg-gray-800 bg-opacity-80 text-white text-xs text-center truncate">
        {trait.name}
      </div>
    </motion.div>
  );
};

export default TraitSelector;