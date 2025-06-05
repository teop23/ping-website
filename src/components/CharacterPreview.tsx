import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Download, Copy, RotateCcw } from 'lucide-react';
import { toPng } from 'html-to-image';
import { Trait } from '../types';
import { placeholderTraits, baseCharacterImage } from '../data/traits';
import pingImage from '../assets/images/ping.png';

interface CharacterPreviewProps {
  selectedTraits: Record<string, Trait | null>;
  onReset: () => void;
}

const CharacterPreview: React.FC<CharacterPreviewProps> = ({ selectedTraits, onReset }) => {
  const characterRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!characterRef.current) return;
    
    try {
      const dataUrl = await toPng(characterRef.current, { cacheBust: true });
      const link = document.createElement('a');
      link.download = 'my-ping-character.png';
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  const handleCopy = async () => {
    if (!characterRef.current) return;
    
    try {
      const dataUrl = await toPng(characterRef.current, { cacheBust: true });
      
      // Create a temporary image element to get blob data
      const img = document.createElement('img');
      img.src = dataUrl;
      
      // When image loads, convert to blob and copy to clipboard
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        ctx.drawImage(img, 0, 0);
        
        canvas.toBlob(async (blob) => {
          if (!blob) return;
          
          try {
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob })
            ]);
            console.log('Image copied to clipboard');
          } catch (err) {
            console.error('Failed to copy image: ', err);
          }
        });
      };
    } catch (error) {
      console.error('Error copying image:', error);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-2xl p-6 mb-6 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-indigo-50 opacity-50"></div>
        
        <div ref={characterRef} className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
          {/* Base character */}
          <img 
            src={pingImage} 
            alt="Base character" 
            className="absolute w-full h-full object-contain"
          />
          
          {/* Render selected traits in the correct order */}
          {Object.entries(selectedTraits).map(([category, trait]) => {
            if (!trait) return null;
            
            // Get placeholder image for this trait
            const placeholderImage = placeholderTraits[category as keyof typeof placeholderTraits]?.[trait.id];
            
            return (
              <img 
                key={trait.id}
                src={placeholderImage || trait.imageSrc}
                alt={trait.name}
                className="absolute w-full h-full object-contain"
              />
            );
          })}
        </div>
      </motion.div>
      
      <div className="flex space-x-4">
        <ActionButton 
          icon={<Download size={20} />} 
          label="Download" 
          onClick={handleDownload} 
          color="blue"
        />
        <ActionButton 
          icon={<Copy size={20} />} 
          label="Copy" 
          onClick={handleCopy} 
          color="purple"
        />
        <ActionButton 
          icon={<RotateCcw size={20} />} 
          label="Reset" 
          onClick={onReset} 
          color="gray"
        />
      </div>
    </div>
  );
};

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  color: 'blue' | 'purple' | 'gray';
}

const ActionButton: React.FC<ActionButtonProps> = ({ icon, label, onClick, color }) => {
  const colorClasses = {
    blue: "bg-blue-600 hover:bg-blue-700",
    purple: "bg-purple-600 hover:bg-purple-700",
    gray: "bg-gray-600 hover:bg-gray-700",
  };
  
  return (
    <motion.button
      className={`${colorClasses[color]} text-white px-4 py-2 rounded-lg flex items-center space-x-2 shadow-md`}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {icon}
      <span>{label}</span>
    </motion.button>
  );
};

export default CharacterPreview;