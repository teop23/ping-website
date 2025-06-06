import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Download, Copy, RotateCcw } from 'lucide-react';
import { toPng } from 'html-to-image';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
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
        className="w-full aspect-square relative max-w-[500px]"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="h-full relative overflow-hidden bg-gradient-to-br from-white to-gray-50 shadow-xl">
          <CardContent className="h-full p-6 flex items-center justify-center">
            <div ref={characterRef} className="relative w-4/5 h-4/5 flex items-center justify-center">
              {/* Base character */}
              <img 
                src={pingImage} 
                alt="Base character" 
                className="absolute w-full h-full object-contain z-[1] transition-transform duration-300 hover:scale-105"
              />
          
              {/* Render traits in specific order with proper z-index */}
              {/* Body layer */}
              {selectedTraits.body && (
                <img 
                  src={placeholderTraits.body?.[selectedTraits.body.id] || selectedTraits.body.imageSrc}
                  alt={selectedTraits.body.name}
                  className="absolute w-full h-full object-contain z-[2]"
                />
              )}
              
              {/* Face layer */}
              {selectedTraits.face && (
                <img 
                  src={placeholderTraits.face?.[selectedTraits.face.id] || selectedTraits.face.imageSrc}
                  alt={selectedTraits.face.name}
                  className="absolute w-full h-full object-contain z-[3]"
                />
              )}
              
              {/* Head layer */}
              {selectedTraits.head && (
                <img 
                  src={placeholderTraits.head?.[selectedTraits.head.id] || selectedTraits.head.imageSrc}
                  alt={selectedTraits.head.name}
                  className="absolute w-full h-full object-contain z-[4]"
                />
              )}
              
              {/* Accessory layer (top-most) */}
              {selectedTraits.accessory && (
                <img 
                  src={placeholderTraits.accessory?.[selectedTraits.accessory.id] || selectedTraits.accessory.imageSrc}
                  alt={selectedTraits.accessory.name}
                  className="absolute w-full h-full object-contain z-[5]"
                />
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      <div className="flex flex-wrap justify-center gap-4 mt-6 px-2">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <ActionButton 
            icon={<Download size={20} />} 
            label="Download" 
            onClick={handleDownload} 
            variant="default"
          />
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <ActionButton 
            icon={<Copy size={20} />} 
            label="Copy" 
            onClick={handleCopy} 
            variant="secondary"
          />
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <ActionButton 
            icon={<RotateCcw size={20} />} 
            label="Reset" 
            onClick={onReset} 
            variant="outline"
          />
        </motion.div>
      </div>
    </div>
  );
};

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  variant: 'default' | 'secondary' | 'outline';
}

const ActionButton: React.FC<ActionButtonProps> = ({ icon, label, onClick, variant }) => {
  return (
    <Button
      variant={variant}
      onClick={onClick}
      className="flex items-center gap-2"
    >
      {icon}
      <span>{label}</span>
    </Button>
  );
};

export default CharacterPreview;