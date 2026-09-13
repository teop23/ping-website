import { Type } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import CharacterPreview from '../components/CharacterPreview';
import TextToolsModal, { TextElement } from '../components/TextToolsModal';
import TraitSelector from '../components/TraitSelector';
import { rollRandomTraits } from '../data/randomCharacter';
import { traitsFromSearch } from '../data/shareSelection';
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
  const [isTextModalOpen, setIsTextModalOpen] = useState(false);

  useEffect(() => {
    const loadTraits = async () => {
      setIsLoading(true);
      try {
        const { traits: loadedTraits, categories: loadedCategories } = await initializeTraits();
        setTraits(loadedTraits);
        setCategories(loadedCategories);
        setSelectedTraits(traitsFromSearch(window.location.search, loadedTraits));
      } catch (error) {
        console.error('Error loading traits:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTraits();
  }, []);

  const handleTraitSelect = (trait: Trait) => {
    setSelectedTraits((prev) => [...prev, trait]);
  };

  const handleTraitRemove = (trait: Trait) => {
    setSelectedTraits((prev) =>
      prev.filter((selected) => !(selected.id === trait.id && selected.category === trait.category))
    );
  };

  const handleClearAll = () => setSelectedTraits([]);
  const handleTextElementsChange = (elements: TextElement[]) => setTextElements(elements);
  const handleSearchChange = (query: string) => setSearchQuery(query);

  const handleRandomize = () => {
    const pools = categories.map((category) =>
      traits.filter((trait) => trait.category === category.id)
    );
    setSelectedTraits(rollRandomTraits(pools, EMPTY_TRAIT_CHANCE));
  };

  if (isLoading) {
    // Quiet and honest. A spinner plus "Preparing your character customization
    // experience" was doing neither.
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex h-full min-h-[500px] w-full items-center justify-center"
      >
        <div className="flex items-center gap-3 text-meta text-ink-muted">
          <span
            aria-hidden="true"
            className="size-1.5 rounded-pill bg-brand motion-safe:animate-pulse-live"
          />
          Loading traits
        </div>
      </div>
    );
  }

  return (
    <>
      {/*
        One frame, split by a rule. The page already wraps this in a panel, so
        giving each half its own card would be a card inside a card.
      */}
      <div className="flex h-full w-full flex-col divide-y divide-hairline lg:flex-row lg:divide-x lg:divide-y-0">
        <section
          aria-label="Character preview"
          className="flex h-1/2 min-h-0 w-full flex-col gap-3 pb-5 lg:h-full lg:w-1/2 lg:pb-0 lg:pr-5"
        >
          <h2 className="shrink-0 font-display text-meta font-semibold text-ink">Your character</h2>

          <div className="min-h-0 flex-1">
            <CharacterPreview
              selectedTraits={selectedTraits}
              textElements={textElements}
              onTextElementsChange={handleTextElementsChange}
              onRandomize={handleRandomize}
            />
          </div>
        </section>

        <section
          aria-label="Trait picker"
          className="flex h-1/2 min-h-0 w-full flex-col pt-5 lg:h-full lg:w-1/2 lg:pl-5 lg:pt-0"
        >
          <div className="mb-3 flex shrink-0 items-center justify-between gap-3">
            <h2 className="font-display text-meta font-semibold text-ink">Traits</h2>

            <button
              type="button"
              onClick={() => setIsTextModalOpen(true)}
              className="inline-flex h-8 items-center gap-1.5 rounded-md border border-hairline px-2.5 text-micro text-ink-muted transition-colors duration-fast ease-out-quart hover:bg-panel hover:text-ink"
            >
              <Type size={13} />
              Text
            </button>
          </div>

          <div className="min-h-0 flex-grow overflow-hidden">
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
        </section>
      </div>

      <TextToolsModal
        isOpen={isTextModalOpen}
        onClose={() => setIsTextModalOpen(false)}
        onTextElementsChange={handleTextElementsChange}
      />
    </>
  );
};

export default Builder;
