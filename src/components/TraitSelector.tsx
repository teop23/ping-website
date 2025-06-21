/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from 'framer-motion';
import { Check, Upload, Search, X, Filter } from 'lucide-react';
import React from 'react';
import { ScrollArea } from '../components/ui/scroll-area';
import { CategoryOption, Trait } from '../types';
import { Card, CardContent } from './ui/card';
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

  return (
    <TooltipProvider>
      <Card className="flex flex-col h-[calc(100vh-16rem)] sm:h-auto shadow-lg border-2 border-border/50 bg-gradient-to-br from-card to-card/95 max-w-[500px] mx-auto">
        {/* Search Bar */}
        <div className="p-3 border-b border-border bg-gradient-to-r from-background to-muted/20">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
            <input
              type="text"
              placeholder="Search traits..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-10 py-2 text-sm border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2 mb-2">
            <Filter size={14} className="text-muted-foreground" />
            <select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              className="flex-1 px-2 py-1 text-xs border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-ring bg-background"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          {/* Selected Traits Counter and Clear Button */}
          {selectedTraits.length > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {selectedTraits.length} trait{selectedTraits.length !== 1 ? 's' : ''} selected
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearAll}
                className="h-6 px-2 text-xs"
              >
                Clear All
              </Button>
            </div>
          )}
        </div>

        {/* Selected Traits Display */}
        {selectedTraits.length > 0 && (
          <div className="p-3 border-b border-border bg-muted/20">
            <h4 className="text-xs font-semibold text-muted-foreground mb-2">Selected Traits</h4>
            <div className="flex flex-wrap gap-1">
              {selectedTraits.map((trait) => (
                <motion.div
                  key={`selected-${trait.id}-${trait.category}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-1 px-2 py-1 bg-primary/10 border border-primary/20 rounded-md text-xs"
                >
                  <span className="font-medium">{trait.name}</span>
                  <span className="text-muted-foreground">({trait.category})</span>
                  <button
                    onClick={() => onTraitRemove(trait)}
                    className="ml-1 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X size={12} />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-row flex-1 min-h-0">
          {/* Main Content - Traits Grid */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Header */}
            <div className="p-3 border-b border-border bg-gradient-to-r from-background to-muted/20">
              <h3 className="text-sm font-semibold text-foreground">
                {searchQuery 
                  ? `Search Results (${filteredTraits.length})` 
                  : selectedCategoryFilter === 'all'
                    ? `All Traits (${filteredTraits.length})`
                    : `${categories.find(c => c.id === selectedCategoryFilter)?.label || 'Traits'} (${filteredTraits.length})`
                }
              </h3>
              {searchQuery && (
                <p className="text-xs text-muted-foreground mt-1">Searching across all categories</p>
              )}
            </div>

            {/* Traits Grid */}
            <ScrollArea className="flex-1">
              <CardContent className="p-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
                {/* Upload button - only show when filtering by specific category */}
                {selectedCategoryFilter !== 'all' && !searchQuery && (
                  <motion.button
                    className="relative cursor-pointer rounded-lg overflow-hidden border-2 border-dashed border-primary/30 hover:border-primary bg-gradient-to-br from-background to-muted/50"
                    onClick={() => handleUpload(selectedCategoryFilter)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <div className="aspect-square bg-card flex flex-col items-center justify-center gap-2 text-muted-foreground">
                      <Upload size={20} className="text-primary/60" />
                      <span className="text-xs">Upload</span>
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
                  <div className="col-span-full text-center py-6 text-muted-foreground">
                    {searchQuery ? (
                      <p className="text-sm">No traits found matching "{searchQuery}"</p>
                    ) : selectedCategoryFilter === 'all' ? (
                      <p className="text-sm">No traits available</p>
                    ) : (
                      <>
                        <p className="text-sm">No traits available for this category</p>
                        <p className="text-xs mt-2">Upload your first trait using the upload button above!</p>
                      </>
                    )}
                  </div>
                )}
              </CardContent>
            </ScrollArea>
          </div>
        </div>
      </Card>
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
          className={`relative cursor-pointer rounded-lg overflow-hidden border ${isSelected
            ? 'border-primary ring-2 ring-primary/20 bg-primary/5'
            : 'border-border hover:border-primary/50'
            }`}
          onClick={onClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          initial={{ overflow: 'hidden' }}
        >
          <div className="aspect-square bg-card flex items-center justify-center pb-6">
            <img
              src={imageSrc}
              alt={trait.name}
              className={`w-full h-full object-contain p-2 pb-0 transition-transform duration-200 ${isSelected ? 'scale-95' : ''
                }`}
              onError={(e) => {
                // Fallback to a placeholder if image fails to load
                const target = e.target as HTMLImageElement;
                target.src = `https://via.placeholder.com/100x100/9CA3AF/ffffff?text=${encodeURIComponent(trait.name)}`;
              }}
            />
          </div>

          {isSelected && (
            <motion.div
              className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <Check size={14} />
            </motion.div>
          )}

          {/* Always visible trait name and category at bottom */}
          <div className="absolute inset-x-0 bottom-0 p-1.5 bg-background/95 backdrop-blur-sm border-t border-border/50">
            <p className="text-xs text-center text-foreground font-medium truncate leading-tight">
              {trait.name}
            </p>
            <p className="text-xs text-center text-muted-foreground truncate leading-tight">
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