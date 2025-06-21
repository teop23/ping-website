/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from 'framer-motion';
import { Check, Upload, Search, X } from 'lucide-react';
import React from 'react';
import { ScrollArea } from '../components/ui/scroll-area';
import { CategoryOption, Trait } from '../types';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface TraitSelectorProps {
  categories: CategoryOption[];
  traits: Trait[];
  selectedTraits: Trait[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onTraitSelect: (trait: Trait) => void;
  onTraitRemove: (trait: Trait) => void;
  onClearAll: () => void;
}

const TraitSelector: React.FC<TraitSelectorProps> = ({
  categories,
  traits,
  selectedTraits,
  searchQuery,
  onSearchChange,
  onTraitSelect,
  onTraitRemove,
  onClearAll
}) => {
  const [uploadedTraits, setUploadedTraits] = React.useState<Record<string, Trait[]>>({
    aura: [],
    head: [],
    face: [],
    mouth: [],
    body: [],
    right_hand: [],
    left_hand: [],
    accessory: []
  });

  const [selectedCategoryFilter, setSelectedCategoryFilter] = React.useState<string>('all');

  // Filter traits based on search query and category filter
  const filteredTraits = React.useMemo(() => {
    let allTraits = [
      ...Object.values(uploadedTraits).flat(),
      ...traits
    ];

    // Apply search filter
    if (searchQuery.trim()) {
      allTraits = allTraits.filter(trait => 
        trait.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trait.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategoryFilter !== 'all') {
      allTraits = allTraits.filter(trait => trait.category === selectedCategoryFilter);
    }

    return allTraits;
  }, [searchQuery, selectedCategoryFilter, uploadedTraits, traits]);

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
          const traitImg = new Image();
          traitImg.onload = () => {
            const uploadedTrait: Trait = {
              id: `uploaded-${category}-${Date.now()}`,
              name: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
              category: category as any,
              imageSrc: imageSrc,
            };

            // Add the uploaded trait to our state
            setUploadedTraits(prev => ({
              ...prev,
              [category]: [...(prev[category as keyof typeof prev] || []), uploadedTrait]
            }));

            // Select the newly uploaded trait
            onTraitSelect(uploadedTrait);
          };

          traitImg.src = imageSrc;
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const clearSearch = () => {
    onSearchChange('');
  };

  const isTraitSelected = (trait: Trait) => {
    return selectedTraits.some(selected => 
      selected.id === trait.id && selected.category === trait.category
    );
  };

  const handleTraitClick = (trait: Trait) => {
    if (isTraitSelected(trait)) {
      onTraitRemove(trait);
    } else {
      onTraitSelect(trait);
    }
  };

  const handleCategoryFilterClick = (categoryId: string) => {
    setSelectedCategoryFilter(categoryId);
    // Clear search when selecting a category filter
    if (categoryId !== 'all' && searchQuery) {
      onSearchChange('');
    }
  };

  return (
    <TooltipProvider>
      <div className="flex flex-col h-full bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-sm border border-border/30 rounded-lg">
        
        {/* Search Section */}
        <div className="p-2 bg-gradient-to-r from-background/80 to-muted/40 border-b border-border/50 flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={14} />
            <input
              type="text"
              placeholder="Search traits..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-7 pr-7 py-1.5 text-xs sm:text-sm border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background/90 backdrop-blur-sm"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Category Filters */}
        <div className="p-2 bg-gradient-to-r from-background/60 to-muted/30 border-b border-border/50 flex-shrink-0">
          <div className="flex flex-wrap gap-1 sm:gap-2">
            <button
              onClick={() => handleCategoryFilterClick('all')}
              className={`px-1.5 sm:px-2 py-1 text-xs font-medium rounded-md transition-all duration-200 ${
                selectedCategoryFilter === 'all'
                  ? 'bg-primary text-primary-foreground shadow-md scale-105'
                  : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground hover:scale-105'
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryFilterClick(category.id)}
                className={`px-1.5 sm:px-2 py-1 text-xs font-medium rounded-md transition-all duration-200 ${
                  selectedCategoryFilter === category.id
                    ? 'bg-primary text-primary-foreground shadow-md scale-105'
                    : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground hover:scale-105'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Traits Section - Always visible but compact */}
        <div className="p-2 bg-gradient-to-r from-primary/5 to-purple-600/5 border-b border-border/50 flex-shrink-0">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs sm:text-sm font-semibold text-foreground">
              Selected ({selectedTraits.length})
            </h4>
            {selectedTraits.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearAll}
                className="h-5 px-2 text-xs hover:bg-destructive/10 hover:text-destructive"
              >
                Clear All
              </Button>
            )}
          </div>
          
          {selectedTraits.length > 0 ? (
            <div className="max-h-20 overflow-y-auto">
              <div className="flex flex-wrap gap-1">
                {selectedTraits.map((trait) => (
                  <motion.div
                    key={`selected-${trait.id}-${trait.category}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center gap-1 px-1 sm:px-1.5 py-0.5 bg-primary/15 border border-primary/30 rounded text-xs group hover:bg-primary/20 transition-colors"
                  >
                    <span className="font-medium text-primary text-xs">{trait.name}</span>
                    <button
                      onClick={() => onTraitRemove(trait)}
                      className="text-primary/70 hover:text-primary transition-colors group-hover:scale-110"
                    >
                      <X size={10} />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">No traits selected</p>
          )}
        </div>

        {/* Traits Grid Header */}
        <div className="p-2 bg-gradient-to-r from-background/60 to-muted/30 border-b border-border/50 flex-shrink-0">
          <h3 className="text-xs sm:text-sm font-semibold text-foreground">
            {searchQuery 
              ? `Search Results (${filteredTraits.length})` 
              : selectedCategoryFilter === 'all'
                ? `All Traits (${filteredTraits.length})`
                : `${categories.find(c => c.id === selectedCategoryFilter)?.label || 'Traits'} (${filteredTraits.length})`
            }
          </h3>
        </div>

        {/* Scrollable Traits Grid */}
        <div className="flex-1 min-h-0">
          <ScrollArea className="h-full">
            <div className="p-2">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-1.5 sm:gap-2">
                {/* Upload button - only show when filtering by specific category */}
                {selectedCategoryFilter !== 'all' && !searchQuery && (
                  <motion.button
                    className="relative cursor-pointer rounded-md overflow-hidden border-2 border-dashed border-primary/30 hover:border-primary bg-gradient-to-br from-background/80 to-muted/40 transition-all duration-200 group"
                    onClick={() => handleUpload(selectedCategoryFilter)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="aspect-square bg-card/50 flex flex-col items-center justify-center gap-1 text-muted-foreground group-hover:text-primary transition-colors">
                      <Upload size={14} className="text-primary/60 group-hover:text-primary transition-colors" />
                      <span className="text-xs font-medium">Upload</span>
                    </div>
                  </motion.button>
                )}

                {filteredTraits.map((trait) => {
                  const isSelected = isTraitSelected(trait);

                  return (
                    <TraitCard
                      key={`${trait.id}-${trait.category}`}
                      trait={trait}
                      isSelected={isSelected}
                      imageSrc={trait.imageSrc}
                      onClick={() => handleTraitClick(trait)}
                    />
                  );
                })}

                {/* Show message if no traits available */}
                {filteredTraits.length === 0 && (
                  <div className="col-span-full text-center py-8 text-muted-foreground">
                    {searchQuery ? (
                      <div>
                        <p className="text-sm font-medium">No traits found</p>
                        <p className="text-xs mt-1">Try different search terms</p>
                      </div>
                    ) : selectedCategoryFilter === 'all' ? (
                      <div>
                        <p className="text-sm font-medium">No traits available</p>
                        <p className="text-xs mt-1">Upload some traits to get started</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm font-medium">No traits in this category</p>
                        <p className="text-xs mt-1">Upload your first trait!</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    </TooltipProvider>
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
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.div
          className={`relative cursor-pointer rounded-md overflow-hidden border transition-all duration-200 group ${isSelected
            ? 'border-primary ring-2 ring-primary/20 bg-primary/5 shadow-lg'
            : 'border-border/50 hover:border-primary/50 hover:shadow-md bg-card/50'
            }`}
          onClick={onClick}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <div className="aspect-square bg-gradient-to-br from-card/80 to-card/60 flex items-center justify-center relative">
            <img
              src={imageSrc}
              alt={trait.name}
              className={`w-full h-full object-contain p-1 transition-transform duration-200 ${isSelected ? 'scale-95' : 'group-hover:scale-105'
                }`}
              onError={(e) => {
                // Fallback to a placeholder if image fails to load
                const target = e.target as HTMLImageElement;
                target.src = `https://via.placeholder.com/100x100/9CA3AF/ffffff?text=${encodeURIComponent(trait.name)}`;
              }}
            />
            
            {/* Selection indicator */}
            {isSelected && (
              <motion.div
                className="absolute top-0.5 right-0.5 bg-primary text-primary-foreground rounded-full p-0.5 shadow-lg"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.2 }}
              >
                <Check size={10} />
              </motion.div>
            )}
          </div>

          {/* Trait info at bottom */}
          <div className="absolute inset-x-0 bottom-0 p-1 bg-background/95 backdrop-blur-sm border-t border-border/50">
            <p className="text-xs text-center text-foreground font-medium truncate leading-none">
              {trait.name}
            </p>
            <p className="text-xs text-center text-muted-foreground truncate leading-none">
              {trait.category}
            </p>
          </div>
        </motion.div>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs">
        <p className="text-sm font-medium">{trait.name}</p>
        <p className="text-xs text-muted-foreground">Category: {trait.category}</p>
        <p className="text-xs text-muted-foreground">
          {isSelected ? 'Click to remove' : 'Click to add'}
        </p>
      </TooltipContent>
    </Tooltip>
  );
};

export default TraitSelector;