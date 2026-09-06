import React from 'react';
import { Download, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { SavedTrait } from '../../utils/traitManager';

interface SavedTraitsPanelProps {
  savedTraits: SavedTrait[];
  traitToDelete: string | null;
  setTraitToDelete: (id: string | null) => void;
  onToggleTrait: (trait: SavedTrait) => void;
  onDownloadTrait: (trait: SavedTrait) => void;
  onDeleteTrait: (id: string) => void;
}

const SavedTraitsPanel: React.FC<SavedTraitsPanelProps> = ({
  savedTraits,
  traitToDelete,
  setTraitToDelete,
  onToggleTrait,
  onDownloadTrait,
  onDeleteTrait
}) => {
  const confirmDeleteTrait = (id: string) => {
    setTraitToDelete(id);
  };

  const handleDeleteTrait = (id: string) => {
    onDeleteTrait(id);
    setTraitToDelete(null);
  };

  return (
    <Card className="flex-1 overflow-hidden flex flex-col max-h-[400px]">
      <CardHeader className="p-2 flex-shrink-0">
        <h3 className="text-body sm:text-lead font-semibold">Saved Traits</h3>
      </CardHeader>
      <CardContent className="p-0 flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto">
          <div className="pt-1 px-1 pb-2 space-y-2">
            {savedTraits.map((trait) => (
              <div
                key={trait.id}
                className={`flex flex-row items-center p-2 sm:p-3 rounded-lg transition-colors cursor-pointer w-full ${
                  trait.isVisible 
                    ? 'bg-brand-wash border border-brand hover:bg-blue-100' 
                    : 'bg-panel border border-transparent hover:bg-panel'
                }`}
              >
                <div 
                  className="flex items-center space-x-3 cursor-pointer flex-1 min-w-0"
                  onClick={() => onToggleTrait(trait)}
                >
                  <img
                    src={trait.data}
                    alt={trait.name}
                    className={`w-12 h-12 sm:w-16 sm:h-16 object-cover rounded flex-shrink-0 ${
                      trait.isVisible ? 'ring-2 ring-brand' : ''
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-micro sm:text-meta font-medium block truncate">{trait.name}</span>
                    <span className={`text-micro ${trait.isVisible ? 'text-accent-ink' : 'text-ink-faint'}`}>
                      {trait.isVisible ? 'Visible' : 'Hidden'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-1 ml-2 flex-shrink-0">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${trait.isVisible ? 'bg-green-400' : 'bg-gray-300'}`} />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDownloadTrait(trait);
                    }}
                    className="h-7 w-7 sm:h-8 sm:w-8 text-accent-ink hover:text-ink-muted hover:bg-panel flex-shrink-0"
                  >
                    <Download size={12} className="sm:w-4 sm:h-4" />
                  </Button>
                  <Dialog open={traitToDelete === trait.id} onOpenChange={(open) => !open && setTraitToDelete(null)}>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          confirmDeleteTrait(trait.id);
                        }}
                        className="h-7 w-7 sm:h-8 sm:w-8 text-red-500 hover:text-red-700 hover:bg-red-50 flex-shrink-0"
                      >
                        <Trash2 size={12} className="sm:w-4 sm:h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Delete Trait</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to delete "{trait.name}"? This action cannot be undone.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setTraitToDelete(null)}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleDeleteTrait(trait.id)}
                        >
                          Delete
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ))}
            {savedTraits.length === 0 && (
              <div className="text-center text-ink-faint py-8">
                <p className="text-meta">No saved traits yet</p>
                <p className="text-micro mt-2">Create and save your first trait! Click on saved traits to toggle visibility.</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SavedTraitsPanel;