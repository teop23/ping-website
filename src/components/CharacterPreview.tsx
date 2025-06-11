import { motion } from 'framer-motion';
import { toPng } from 'html-to-image';
import { Copy, Download, RotateCcw } from 'lucide-react';
import React, { useRef, useEffect, useState, useCallback } from 'react';
import pingImage from '../assets/images/ping.png';
import { placeholderTraits } from '../data/traits';
import { Trait } from '../types';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { BASE_IMAGE_SCALE_MULTIPLIER } from '@/utils/canvasUtils';

interface CharacterPreviewProps {
  selectedTraits: Record<string, Trait | null>;
  onReset: () => void;
}

const CharacterPreview: React.FC<CharacterPreviewProps> = ({ selectedTraits, onReset }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [baseImage, setBaseImage] = useState<HTMLImageElement | null>(null);
  const [traitImages, setTraitImages] = useState<Map<string, HTMLImageElement>>(new Map());

  // Load base image
  useEffect(() => {
    const img = new Image();
    img.onload = () => setBaseImage(img);
    img.src = pingImage;
  }, []);

  // Load trait images when selectedTraits change
  useEffect(() => {
    const loadTraitImages = async () => {
      const newTraitImages = new Map<string, HTMLImageElement>();
      
      for (const [category, trait] of Object.entries(selectedTraits)) {
        if (trait) {
          const placeholderImage = placeholderTraits[trait.category as keyof typeof placeholderTraits]?.[trait.id];
          const imageSrc = placeholderImage || trait.imageSrc;
          
          try {
            const img = new Image();
            await new Promise((resolve, reject) => {
              img.onload = resolve;
              img.onerror = reject;
              img.src = imageSrc;
            });
            newTraitImages.set(trait.id, img);
          } catch (error) {
            console.warn(`Failed to load trait image for ${trait.name}:`, error);
          }
        }
      }
      
      setTraitImages(newTraitImages);
    };

    loadTraitImages();
  }, [selectedTraits]);

  // Render canvas when images are loaded
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !baseImage) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match container
    const container = containerRef.current;
    if (container) {
      const rect = container.getBoundingClientRect();
      console.log('Container size:', rect);
      const size = Math.min(rect.width, rect.height);
      canvas.width = size;
      canvas.height = size;
      console.log('Canvas size set to:', size);
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate scale to fit base image
    const scale = Math.min(canvas.width / baseImage.width, canvas.height / baseImage.height) * BASE_IMAGE_SCALE_MULTIPLIER;
    const scaledWidth = baseImage.width * scale;
    const scaledHeight = baseImage.height * scale;
    const x = (canvas.width - scaledWidth) / 2;
    const y = (canvas.height - scaledHeight) / 2;

    // Draw base image
    ctx.drawImage(baseImage, x, y, scaledWidth, scaledHeight);

    // Draw traits in the same order as CreateTraits: body → face → head → accessory
    const traitOrder = ['body', 'face', 'head', 'right_hand', 'left_hand', 'accessory'];
    
    traitOrder.forEach(category => {
      const trait = selectedTraits[category];
      if (trait) {
        const traitImg = traitImages.get(trait.id);
        if (traitImg) {
          // Scale trait image to match canvas dimensions (same as CreateTraits)
          const traitScaleX = canvas.width / traitImg.width;
          const traitScaleY = canvas.height / traitImg.height;
          
          ctx.drawImage(
            traitImg,
            0, 0, // Source position
            canvas.width, canvas.height // Destination size (full canvas)
          );
        }
      }
    });
  }, [baseImage, traitImages, selectedTraits]);

  // Render canvas when dependencies change
  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      renderCanvas();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [renderCanvas]);

  const handleDownload = async () => {
    if (!baseImage) return;
    
    setIsLoading(true);
    try {
      // Create a high-resolution canvas for download
      const downloadCanvas = document.createElement('canvas');
      const downloadCtx = downloadCanvas.getContext('2d');
      if (!downloadCtx) return;

      // Set high resolution (1024x1024)
      downloadCanvas.width = 1024;
      downloadCanvas.height = 1024;

      // Calculate scale for base image
      const scale = Math.min(downloadCanvas.width / baseImage.width, downloadCanvas.height / baseImage.height) * BASE_IMAGE_SCALE_MULTIPLIER;
      const scaledWidth = baseImage.width * scale;
      const scaledHeight = baseImage.height * scale;
      const x = (downloadCanvas.width - scaledWidth) / 2;
      const y = (downloadCanvas.height - scaledHeight) / 2;

      // Draw base image
      downloadCtx.drawImage(baseImage, x, y, scaledWidth, scaledHeight);

      // Draw traits in order
      const traitOrder = ['body', 'face', 'head', 'right_hand', 'left_hand', 'accessory'];
      
      traitOrder.forEach(category => {
        const trait = selectedTraits[category];
        if (trait) {
          const traitImg = traitImages.get(trait.id);
          if (traitImg) {
            // Scale trait to full canvas size
            downloadCtx.drawImage(
              traitImg,
              0, 0,
              downloadCanvas.width, downloadCanvas.height
            );
          }
        }
      });

      // Convert to blob and download
      downloadCanvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.download = 'my-ping-character.png';
          link.href = url;
          link.click();
          URL.revokeObjectURL(url);
        }
      }, 'image/png');
    } catch (error) {
      console.error('Error downloading image:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!baseImage) return;
    
    setIsLoading(true);
    try {
      // Create a high-resolution canvas for copying
      const copyCanvas = document.createElement('canvas');
      const copyCtx = copyCanvas.getContext('2d');
      if (!copyCtx) return;

      // Set high resolution
      copyCanvas.width = 1024;
      copyCanvas.height = 1024;

      // Calculate scale for base image
      const scale = Math.min(copyCanvas.width / baseImage.width, copyCanvas.height / baseImage.height) * BASE_IMAGE_SCALE_MULTIPLIER;
      const scaledWidth = baseImage.width * scale;
      const scaledHeight = baseImage.height * scale;
      const x = (copyCanvas.width - scaledWidth) / 2;
      const y = (copyCanvas.height - scaledHeight) / 2;

      // Draw base image
      copyCtx.drawImage(baseImage, x, y, scaledWidth, scaledHeight);

      // Draw traits in order
      const traitOrder = ['body', 'face', 'head', 'right_hand', 'left_hand', 'accessory'];
      
      traitOrder.forEach(category => {
        const trait = selectedTraits[category];
        if (trait) {
          const traitImg = traitImages.get(trait.id);
          if (traitImg) {
            // Scale trait to full canvas size
            copyCtx.drawImage(
              traitImg,
              0, 0,
              copyCanvas.width, copyCanvas.height
            );
          }
        }
      });

      // Convert to blob and copy to clipboard
      copyCanvas.toBlob(async (blob) => {
        if (blob) {
          try {
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob })
            ]);
            console.log('Image copied to clipboard');
          } catch (err) {
            console.error('Failed to copy image: ', err);
          }
        }
      }, 'image/png');
    } catch (error) {
      console.error('Error copying image:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-full aspect-square relative max-w-[500px]" ref={containerRef}>
        <Card className="h-full relative overflow-hidden bg-gradient-to-br from-white to-gray-50 shadow-xl">
          <CardContent className="h-full p-0 flex items-center justify-center">
            <canvas 
              ref={canvasRef}
              className="w-full h-full object-contain"
              style={{ imageRendering: 'crisp-edges' }}
            />
          </CardContent>
        </Card>
      </div>
      
      <div className="flex flex-wrap justify-center gap-4 mt-6 px-2">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <ActionButton 
            icon={<Download size={20} />} 
            label="Download" 
            onClick={handleDownload} 
            variant="default"
            disabled={isLoading}
          />
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <ActionButton 
            icon={<Copy size={20} />} 
            label="Copy" 
            onClick={handleCopy} 
            variant="secondary"
            disabled={isLoading}
          />
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <ActionButton 
            icon={<RotateCcw size={20} />} 
            label="Reset" 
            onClick={onReset} 
            variant="outline"
            disabled={isLoading}
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
  disabled?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({ icon, label, onClick, variant, disabled }) => {
  return (
    <Button
      variant={variant}
      onClick={onClick}
      className="flex items-center gap-2"
      disabled={disabled}
    >
      {icon}
      <span>{label}</span>
    </Button>
  );
};

export default CharacterPreview;