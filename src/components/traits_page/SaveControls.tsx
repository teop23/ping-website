import React from 'react';
import { Save, Download } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

interface SaveControlsProps {
  traitName: string;
  setTraitName: (name: string) => void;
  downloadMode: 'trait' | 'character';
  setDownloadMode: (mode: 'trait' | 'character') => void;
  onSaveTrait: () => void;
  onDownloadTrait: () => void;
}

const SaveControls: React.FC<SaveControlsProps> = ({
  traitName,
  setTraitName,
  downloadMode,
  setDownloadMode,
  onSaveTrait,
  onDownloadTrait
}) => {
  const getDownloadButtonText = () => {
    return downloadMode === 'trait' ? 'Download Trait' : 'Download Character';
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <h3 className="text-base font-semibold">Save & Export</h3>
        <input
          type="text"
          value={traitName}
          onChange={(e) => setTraitName(e.target.value)}
          placeholder="Enter trait name..."
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <div className="flex flex-col space-y-2">
          <Button
            onClick={onSaveTrait}
            disabled={!traitName.trim()}
            className="w-full h-10"
            size="sm"
          >
            <Save size={16} className="mr-2" />
            Save Trait
          </Button>
          <div className="flex space-x-2">
            <Button
              onClick={onDownloadTrait}
              variant="outline"
              className="flex-1 h-10"
              size="sm"
            >
              <Download size={16} className="mr-2" />
              {getDownloadButtonText()}
            </Button>
            {/* Download Mode Toggle */}
            <div className="flex items-center space-x-1 p-1 bg-gray-100 rounded-lg w-20 h-10">
              <button
                onClick={() => setDownloadMode('trait')}
                className={`px-2 py-1.5 text-xs font-medium rounded-md transition-colors h-8 flex items-center justify-center flex-1 ${
                  downloadMode === 'trait'
                    ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Trait
              </button>
              <button
                onClick={() => setDownloadMode('character')}
                className={`px-2 py-1.5 text-xs font-medium rounded-md transition-colors h-8 flex items-center justify-center flex-1 ${
                  downloadMode === 'character'
                    ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Full
              </button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SaveControls;