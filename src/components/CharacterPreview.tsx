import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Copy, Download, RotateCcw } from 'lucide-react';
import { Trait } from '../types';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import pingImage from '../assets/images/ping.png';

interface CharacterPreviewProps {
  selectedTraits: Record<string, Trait | null>;
  onReset: () => void;
}

const CharacterPreview: React.FC<CharacterPreviewProps> = ({ selectedTraits, onReset }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [canvasSize, setCanvasSize] = useState(400);

  // Image cache to avoid reloading
  const imageCache = useRef<Map<string, HTMLImageElement>>(new Map());

  // Load image with caching
  const loadImage = useCallback((src: string): Promise<HTMLImageElement> => {
    if (imageCache.current.has(src)) {
      return Promise.resolve(imageCache.current.get(src)!);
    }

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        imageCache.current.set(src, img);
        resolve(img);
      };
      img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
      img.src = src;
    });
  }, []);

  // Calculate canvas size based on container
  const calculateCanvasSize = useCallback(() => {
    if (!containerRef.current) return 400;
    
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const size = Math.min(rect.width, rect.height, 500) * 0.95;
    return Math.max(size, 200); // Minimum size of 200px
  }, []);

  // Update canvas size
  const updateCanvasSize = useCallback(() => {
    const newSize = calculateCanvasSize();
    setCanvasSize(newSize);
    
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Set actual canvas resolution
        canvas.width = newSize;
        canvas.height = newSize;
        
        // Set display size
        canvas.style.width = `${newSize}px`;
        canvas.style.height = `${newSize}px`;
        
        // Ensure crisp rendering
        ctx.imageSmoothingEnabled = false;
      }
    }
  }, [calculateCanvasSize]);

  // Draw character on canvas
  const drawCharacter = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsLoading(true);

    try {
      // Clear canvas with white background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Load and draw base character
      const baseImg = await loadImage(pingImage);
      ctx.drawImage(baseImg, 0, 0, canvas.width, canvas.height);

      // Draw traits in correct layering order
      const layerOrder = ['body', 'face', 'head', 'accessory'] as const;
      
      for (const layer of layerOrder) {
        const trait = selectedTraits[layer];
        if (trait?.imageSrc) {
          try {
            const traitImg = await loadImage(trait.imageSrc);
            ctx.drawImage(traitImg, 0, 0, canvas.width, canvas.height);
          } catch (error) {
            console.warn(`Failed to load trait ${layer}:`, error);
          }
        }
      }
    } catch (error) {
      console.error('Error drawing character:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedTraits, loadImage]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      updateCanvasSize();
      // Redraw after a short delay to ensure canvas is resized
      setTimeout(drawCharacter, 50);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateCanvasSize, drawCharacter]);

  // Initialize canvas and draw character when traits change
  useEffect(() => {
    updateCanvasSize();
    drawCharacter();
  }, [selectedTraits, updateCanvasSize, drawCharacter]);

  // Download character as PNG
  const handleDownload = useCallback(async () => {
    try {
      // Create high-resolution canvas for download
      const downloadCanvas = document.createElement('canvas');
      const downloadCtx = downloadCanvas.getContext('2d');
      if (!downloadCtx) return;

      const downloadSize = 1024;
      downloadCanvas.width = downloadSize;
      downloadCanvas.height = downloadSize;
      downloadCtx.imageSmoothingEnabled = false;

      // White background
      downloadCtx.fillStyle = '#ffffff';
      downloadCtx.fillRect(0, 0, downloadSize, downloadSize);

      // Draw base character
      const baseImg = await loadImage(pingImage);
      downloadCtx.drawImage(baseImg, 0, 0, downloadSize, downloadSize);

      // Draw traits
      const layerOrder = ['body', 'face', 'head', 'accessory'] as const;
      for (const layer of layerOrder) {
        const trait = selectedTraits[layer];
        if (trait?.imageSrc) {
          try {
            const traitImg = await loadImage(trait.imageSrc);
            downloadCtx.drawImage(traitImg, 0, 0, downloadSize, downloadSize);
          } catch (error) {
            console.warn(`Failed to load trait ${layer} for download:`, error);
          }
        }
      }

      // Download
      downloadCanvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = 'my-ping-character.png';
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 'image/png', 1.0);
    } catch (error) {
      console.error('Error downloading character:', error);
    }
  }, [selectedTraits, loadImage]);

  // Copy character to clipboard
  const handleCopy = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
        } catch (err) {
          console.error('Failed to copy to clipboard:', err);
        }
      }, 'image/png', 1.0);
    } catch (error) {
      console.error('Error copying character:', error);
    }
  }, []);

  return (
    <div className="flex flex-col items-center w-full">
      {/* Canvas Container */}
      <div 
        ref={containerRef} 
        className="w-full aspect-square relative max-w-[500px]"
      >
        <Card className="h-full relative overflow-hidden bg-gradient-to-br from-white to-gray-50 shadow-xl">
          <CardContent className="h-full p-4 flex items-center justify-center">
            <div className="relative">
              <canvas
                ref={canvasRef}
                className="rounded-lg shadow-sm"
                style={{
                  imageRendering: 'pixelated',
                  filter: isLoading ? 'blur(1px) opacity(0.7)' : 'none',
                  transition: 'filter 0.2s ease-in-out'
                }}
              />
              
              {/* Loading Overlay */}
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/30 rounded-lg">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Action Buttons */}
      <div className="flex flex-wrap justify-center gap-3 mt-6 px-2">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="default"
            onClick={handleDownload}
            className="flex items-center gap-2"
            disabled={isLoading}
          >
            <Download size={18} />
            <span>Download</span>
          </Button>
        </motion.div>
        
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="secondary"
            onClick={handleCopy}
            className="flex items-center gap-2"
            disabled={isLoading}
          >
            <Copy size={18} />
            <span>Copy</span>
          </Button>
        </motion.div>
        
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="outline"
            onClick={onReset}
            className="flex items-center gap-2"
          >
            <RotateCcw size={18} />
            <span>Reset</span>
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default CharacterPreview;