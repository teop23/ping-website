import { motion } from 'framer-motion';
import { toPng } from 'html-to-image';
import { Copy, Download, RotateCcw } from 'lucide-react';
import React, { useRef, useEffect, useState, useCallback } from 'react';
import pingImage from '../assets/images/ping.png';
import { Trait } from '../types';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { BASE_IMAGE_SCALE_MULTIPLIER } from '@/utils/canvasUtils';
import { TextElement } from './TextTools';

interface CharacterPreviewProps {
  selectedTraits: Record<string, Trait | null>;
  textElements?: TextElement[];
  onReset: () => void;
}

const CharacterPreview: React.FC<CharacterPreviewProps> = ({ selectedTraits, textElements = [], onReset }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
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
          const imageSrc = trait.imageSrc;
          
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
      const size = Math.min(rect.width, rect.height);
      canvas.width = size;
      canvas.height = size;
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

    // Draw text elements
    textElements.forEach(textElement => {
      if (textElement.text.trim()) {
        ctx.font = `${textElement.fontWeight} ${textElement.fontSize * (canvas.width / 500)}px Inter, Arial, sans-serif`;
        ctx.fillStyle = textElement.color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        const x = textElement.x * canvas.width;
        const y = textElement.y * canvas.height;
        
        // Add text shadow for better visibility
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 2;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;
        
        ctx.fillText(textElement.text, x, y);
        
        // Reset shadow
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
      }
    });
  }, [baseImage, traitImages, selectedTraits]);
  }, [baseImage, traitImages, selectedTraits, textElements]);

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

      // Draw text elements on download canvas
      textElements.forEach(textElement => {
        if (textElement.text.trim()) {
          downloadCtx.font = `${textElement.fontWeight} ${textElement.fontSize * (downloadCanvas.width / 500)}px Inter, Arial, sans-serif`;
          downloadCtx.fillStyle = textElement.color;
          downloadCtx.textAlign = 'center';
          downloadCtx.textBaseline = 'middle';
          
          const x = textElement.x * downloadCanvas.width;
          const y = textElement.y * downloadCanvas.height;
          
          // Add text shadow for better visibility
          downloadCtx.shadowColor = 'rgba(0, 0, 0, 0.3)';
          downloadCtx.shadowBlur = 4;
          downloadCtx.shadowOffsetX = 2;
          downloadCtx.shadowOffsetY = 2;
          
          downloadCtx.fillText(textElement.text, x, y);
          
          // Reset shadow
          downloadCtx.shadowColor = 'transparent';
          downloadCtx.shadowBlur = 0;
          downloadCtx.shadowOffsetX = 0;
          downloadCtx.shadowOffsetY = 0;
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
    
    setIsCopying(true);
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

      // Draw text elements on copy canvas
      textElements.forEach(textElement => {
        if (textElement.text.trim()) {
          copyCtx.font = `${textElement.fontWeight} ${textElement.fontSize * (copyCanvas.width / 500)}px Inter, Arial, sans-serif`;
          copyCtx.fillStyle = textElement.color;
          copyCtx.textAlign = 'center';
          copyCtx.textBaseline = 'middle';
          
          const x = textElement.x * copyCanvas.width;
          const y = textElement.y * copyCanvas.height;
          
          // Add text shadow for better visibility
          copyCtx.shadowColor = 'rgba(0, 0, 0, 0.3)';
          copyCtx.shadowBlur = 4;
          copyCtx.shadowOffsetX = 2;
          copyCtx.shadowOffsetY = 2;
          
          copyCtx.fillText(textElement.text, x, y);
          
          // Reset shadow
          copyCtx.shadowColor = 'transparent';
          copyCtx.shadowBlur = 0;
          copyCtx.shadowOffsetX = 0;
          copyCtx.shadowOffsetY = 0;
        }
      });

      // Convert to blob and copy to clipboard
      copyCanvas.toBlob(async (blob) => {
        if (blob) {
          try {
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob })
            ]);
            // Keep the animation visible for a moment to show success
            setTimeout(() => setIsCopying(false), 300);
          } catch (err) {
            console.error('Failed to copy image: ', err);
            setIsCopying(false);
          }
        }
      }, 'image/png');
    } catch (error) {
      console.error('Error copying image:', error);
      setIsCopying(false);
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
            isCopying={isCopying}
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
  isCopying?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({ icon, label, onClick, variant, disabled, isCopying }) => {
  return (
    <motion.div
      animate={isCopying ? {
        scale: [1, 1.1, 1],
        backgroundColor: ["hsl(var(--secondary))", "hsl(142, 76%, 36%)", "hsl(var(--secondary))"],
      } : {}}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <Button
        variant={variant}
        onClick={onClick}
        className="flex items-center gap-2"
        disabled={disabled}
      >
        <motion.div
          animate={isCopying ? {
            rotate: [0, 10, -10, 0],
            scale: [1, 1.2, 1]
          } : {}}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {icon}
        </motion.div>
        <span>{isCopying ? 'Copied!' : label}</span>
      </Button>
    </motion.div>
  );
};

export default CharacterPreview;