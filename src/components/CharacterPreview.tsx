import { BASE_IMAGE_SCALE_MULTIPLIER } from '@/utils/canvasUtils';
import { motion } from 'framer-motion';
import { Check, Copy, Download, Move, RotateCcw, Shuffle, Share } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { baseCharacterImage } from '@/data/traits';
import { Trait } from '../types';
import { TextElement } from './TextTools';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { TwitterIcon } from './Navbar';
interface CharacterPreviewProps {
  selectedTraits: Record<string, Trait | null>;
  textElements?: TextElement[];
  onTextElementsChange?: (elements: TextElement[]) => void;
  onReset: () => void;
  onRandomize?: () => void;
}

const CharacterPreview: React.FC<CharacterPreviewProps> = ({ selectedTraits, textElements = [], onTextElementsChange, onReset, onRandomize }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [baseImage, setBaseImage] = useState<HTMLImageElement | null>(null);
  const [traitImages, setTraitImages] = useState<Map<string, HTMLImageElement>>(new Map());
  const [isDragging, setIsDragging] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Load base image
  useEffect(() => {
    const img = new Image();
    img.onload = () => setBaseImage(img);
    img.src = baseCharacterImage;
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
            newTraitImages.set(`${trait.name}-${trait.category}`, img);
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
    const traitOrder = ['aura', 'body', 'face', 'mouth', 'head', 'right_hand', 'left_hand', 'accessory'];
    
    traitOrder.forEach(category => {
      const trait = selectedTraits[category];
      if (trait) {
        const traitImg = traitImages.get(`${trait.name}-${trait.category}`);
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
        ctx.font = `${textElement.fontSize * (canvas.width / 500)}px Inter, Arial, sans-serif`;
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

  // Handle text dragging
  const handleMouseDown = (e: React.MouseEvent, textId: string) => {
    e.preventDefault();
    const rect = overlayRef.current?.getBoundingClientRect();
    if (!rect) return;

    const textElement = textElements.find(t => t.id === textId);
    if (!textElement) return;

    const currentX = textElement.x * rect.width;
    const currentY = textElement.y * rect.height;
    
    setDragOffset({
      x: e.clientX - currentX,
      y: e.clientY - currentY
    });
    setIsDragging(textId);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !overlayRef.current || !onTextElementsChange) return;

    const rect = overlayRef.current.getBoundingClientRect();
    const newX = Math.max(0, Math.min(1, (e.clientX - dragOffset.x) / rect.width));
    const newY = Math.max(0, Math.min(1, (e.clientY - dragOffset.y) / rect.height));

    const updatedElements = textElements.map(element =>
      element.id === isDragging
        ? { ...element, x: newX, y: newY }
        : element
    );

    onTextElementsChange(updatedElements);
  };

  const handleMouseUp = () => {
    setIsDragging(null);
    setDragOffset({ x: 0, y: 0 });
  };

  // Add global mouse event listeners for dragging
  useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseMove = (e: MouseEvent) => {
        if (!overlayRef.current || !onTextElementsChange) return;

        const rect = overlayRef.current.getBoundingClientRect();
        const newX = Math.max(0, Math.min(1, (e.clientX - dragOffset.x) / rect.width));
        const newY = Math.max(0, Math.min(1, (e.clientY - dragOffset.y) / rect.height));

        const updatedElements = textElements.map(element =>
          element.id === isDragging
            ? { ...element, x: newX, y: newY }
            : element
        );

        onTextElementsChange(updatedElements);
      };

      const handleGlobalMouseUp = () => {
        setIsDragging(null);
        setDragOffset({ x: 0, y: 0 });
      };

      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleGlobalMouseMove);
        document.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }
  }, [isDragging, dragOffset, textElements, onTextElementsChange]);

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
      const traitOrder = ['aura', 'body', 'face', 'mouth', 'head', 'right_hand', 'left_hand', 'accessory'];
      
      traitOrder.forEach(category => {
        const trait = selectedTraits[category];
        if (trait) {
          const traitImg = traitImages.get(`${trait.name}-${trait.category}`);
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
          downloadCtx.font = `${textElement.fontSize * (downloadCanvas.width / 500)}px Inter, Arial, sans-serif`;
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
      const traitOrder = ['aura', 'body', 'face', 'mouth', 'head', 'right_hand', 'left_hand', 'accessory'];
      
      traitOrder.forEach(category => {
        const trait = selectedTraits[category];
        if (trait) {
          const traitImg = traitImages.get(`${trait.name}-${trait.category}`);
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
          copyCtx.font = `${textElement.fontSize * (copyCanvas.width / 500)}px Inter, Arial, sans-serif`;
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
            // Keep the animation visible longer to show success
            setTimeout(() => setIsCopying(false), 1500);
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

  const generateApiUrl = () => {
    const baseUrl = 'https://pingonsol.com/og';
    const params = new URLSearchParams();
    
    // Add selected traits as query parameters
    Object.entries(selectedTraits).forEach(([category, trait]) => {
      if (trait) {
        params.append(category, trait.id.slice(0, trait.id.lastIndexOf('_' + category)));
      }
    });
    const paramsString = params.size > 0 ? `?${params.toString()}` : '';
    return `${baseUrl}${paramsString}`;
  };

  const handleShareOnX = () => {
    setIsSharing(true);
    
    try {
      const apiUrl = generateApiUrl();
      const tweetText = "Just created my custom $PING!\nCreate your own at:\n";
      const hashtags = "PING,Solana,Crypto";
      const url = "https://pingonsol.com";
      
      // Construct the Twitter share URL
      const twitterUrl = new URL('https://twitter.com/intent/tweet');
      twitterUrl.searchParams.set('text', tweetText);
      twitterUrl.searchParams.set('hashtags', hashtags);
      twitterUrl.searchParams.set('url', apiUrl);
      
      // Add the custom character image
      if (apiUrl.includes('?')) {
        twitterUrl.searchParams.set('image', apiUrl);
      }
      
      // Open Twitter in a new window
      window.open(twitterUrl.toString(), '_blank');
      
      // Reset sharing state after a delay
      setTimeout(() => setIsSharing(false), 2000);
    } catch (error) {
      console.error('Error sharing on X:', error);
      setIsSharing(false);
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
            
            {/* Text overlay for draggable text elements */}
            <div 
              ref={overlayRef}
              className="absolute inset-0 pointer-events-none"
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
            >
              {textElements.map((textElement) => (
                <div
                  key={textElement.id}
                  className={`absolute pointer-events-auto cursor-move select-none group ${
                    isDragging === textElement.id ? 'z-50' : 'z-10'
                  }`}
                  style={{
                    left: `${textElement.x * 100}%`,
                    top: `${textElement.y * 100}%`,
                    transform: 'translate(-50%, -50%)',
                    fontSize: `${textElement.fontSize * (containerRef.current?.clientWidth || 500) / 500}px`,
                    color: textElement.color,
                    fontFamily: 'Inter, Arial, sans-serif',
                    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)',
                    fontWeight: '500',
                  }}
                  onMouseDown={(e) => handleMouseDown(e, textElement.id)}
                >
                  {/* Drag handle - visible on hover */}
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/70 text-white px-2 py-1 rounded text-xs whitespace-nowrap pointer-events-none">
                    <Move size={12} className="inline mr-1" />
                    Drag to move
                  </div>
                  
                  {/* Text content */}
                  <span className={`${isDragging === textElement.id ? 'opacity-80' : ''}`}>
                    {textElement.text}
                  </span>
                  
                  {/* Selection indicator */}
                  {isDragging === textElement.id && (
                    <div className="absolute inset-0 border-2 border-blue-400 border-dashed rounded animate-pulse pointer-events-none" />
                  )}
                </div>
              ))}
            </div>
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
            icon={isCopying ? <Check size={20} /> : <Copy size={20} />} 
            label="Copy" 
            onClick={handleCopy} 
            variant="secondary"
            disabled={isLoading}
            isCopying={isCopying}
          />
        </motion.div>
        {onRandomize && (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <ActionButton 
              icon={<Shuffle size={20} />} 
              label="Randomize" 
              onClick={onRandomize} 
              variant="outline"
              disabled={isLoading}
            />
          </motion.div>
        )}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <ActionButton 
            icon={<TwitterIcon />} 
            label={isSharing ? "Sharing..." : "Tweet"} 
            onClick={handleShareOnX} 
            variant="outline"
            disabled={isLoading || isSharing}
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
    <Button
      variant={variant}
      onClick={onClick}
      className={`flex items-center gap-2 transition-all duration-300 ${
        isCopying 
          ? 'bg-green-600 hover:bg-green-600 text-white border-green-600' 
          : ''
      }`}
      disabled={disabled}
    >
      <motion.div
        animate={isCopying ? {
          scale: [1, 1.2, 1]
        } : {}}
        transition={{ 
          duration: 0.3, 
          ease: "easeInOut"
        }}
      >
        {icon}
      </motion.div>
      <span>{isCopying ? 'Copied!' : label}</span>
    </Button>
  );
};

export default CharacterPreview;