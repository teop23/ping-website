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
    <Card className="p-4 sm:p-6">
      <div className="space-y-4">
        <input
          type="text"
          value={traitName}
          onChange={(e) => setTraitName(e.target.value)}
          placeholder="Enter trait name..."
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <Button
            onClick={onSaveTrait}
            disabled={!traitName.trim()}
            className="flex-1 h-10"
            size="sm"
          >
            <Save size={16} className="mr-2" />
            Save Trait
          </Button>
          <div className="flex-1 flex space-x-2">
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
            <div className="flex items-center space-x-1 p-1 bg-gray-100 rounded-lg min-w-[100px] h-10">
              <button
                onClick={() => setDownloadMode('trait')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors h-8 flex items-center justify-center ${
                  downloadMode === 'trait'
                    ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Trait
              </button>
              <button
                onClick={() => setDownloadMode('character')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors h-8 flex items-center justify-center ${
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