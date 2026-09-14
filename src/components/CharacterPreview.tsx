import { baseCharacterImage } from '@/data/traits';
import { splitAtBase } from '@/data/traitOrder';
import { BASE_IMAGE_SCALE_MULTIPLIER } from '@/utils/canvasConstants';
import { motion } from 'framer-motion';
import { Check, Copy, Download, Move, Share2, Shuffle } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Trait } from '../types';
import ShareModal, { type ShareLink } from './ShareModal';
import { TextElement } from './TextTools';
import { Button } from './ui/button';

interface CharacterPreviewProps {
  selectedTraits: Trait[];
  textElements?: TextElement[];
  onTextElementsChange?: (elements: TextElement[]) => void;
  onRandomize?: () => void;
}

const CharacterPreview: React.FC<CharacterPreviewProps> = ({ selectedTraits, textElements = [], onTextElementsChange, onRandomize }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const shareLinkCacheRef = useRef<Map<string, ShareLink>>(new Map());

  // A "Send one back" CTA on the showcase page (src/pages/Showcase.tsx) links
  // here with ?sendPing=1 to open the Share dialog directly, on the visitor's
  // own (usually blank/random) character - not the sender's, so it isn't
  // paired with a trait query the way Remix is.
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('sendPing') === '1') {
      setIsShareOpen(true);
    }
  }, []);
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

      for (const trait of selectedTraits) {
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

  /**
   * The character alone - auras, base, traits - in a square canvas of `size`.
   * Download, Copy and Share's saved images all start from this, so the exports
   * cannot register traits differently.
   */
  const composeCharacter = useCallback(
    (size: number): HTMLCanvasElement | null => {
      // A hidden or collapsed container measures 0, and drawImage throws on a
      // 0-size canvas source, which blanked the whole app.
      if (!baseImage || size < 1) return null;
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      const scale = Math.min(size / baseImage.width, size / baseImage.height) * BASE_IMAGE_SCALE_MULTIPLIER;
      const scaledWidth = baseImage.width * scale;
      const scaledHeight = baseImage.height * scale;

      // Auras glow behind the penguin; everything else sits on it. The base art
      // is painted between the two halves - see UNDER_BASE_CATEGORIES.
      const { under, over } = splitAtBase(selectedTraits);
      const paint = (trait: Trait) => {
        const traitImg = traitImages.get(`${trait.name}-${trait.category}`);
        if (traitImg) ctx.drawImage(traitImg, 0, 0, size, size);
      };

      under.forEach(paint);
      ctx.drawImage(baseImage, (size - scaledWidth) / 2, (size - scaledHeight) / 2, scaledWidth, scaledHeight);
      over.forEach(paint);
      return canvas;
    },
    [baseImage, traitImages, selectedTraits]
  );

  // Render canvas when images are loaded
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    // Set canvas size to match container
    const container = containerRef.current;
    if (container) {
      const rect = container.getBoundingClientRect();
      const size = Math.floor(Math.min(rect.width, rect.height));
      canvas.width = size;
      canvas.height = size;
    }

    const character = composeCharacter(canvas.width);
    if (!character) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(character, 0, 0);
  }, [composeCharacter]);

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

  /** composeCharacter at 1024 plus the draggable text labels, for Download and Copy. */
  const composeExport = (): HTMLCanvasElement | null => {
    const canvas = composeCharacter(1024);
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return null;

    textElements.forEach((textElement) => {
      if (!textElement.text.trim()) return;
      ctx.font = `${textElement.fontSize * (canvas.width / 500)}px Inter, Arial, sans-serif`;
      ctx.fillStyle = textElement.color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      // Add text shadow for better visibility
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      ctx.fillText(textElement.text, textElement.x * canvas.width, textElement.y * canvas.height);
    });
    return canvas;
  };

  const handleDownload = async () => {
    setIsLoading(true);
    try {
      const downloadCanvas = composeExport();
      if (!downloadCanvas) return;

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
    setIsCopying(true);
    setIsLoading(true);
    try {
      const copyCanvas = composeExport();
      if (!copyCanvas) {
        setIsCopying(false);
        return;
      }

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

  /** The trait selection as the share and image endpoints expect it. */
  const traitSelection = (): Record<string, string> =>
    Object.fromEntries(
      selectedTraits
        .filter(Boolean)
        .map((trait) => [
          trait.category,
          trait.id.slice(0, trait.id.lastIndexOf('_' + trait.category)),
        ])
    );

  /**
   * Stores the character (plus an optional preset message) server-side and
   * returns its short share URL.
   *
   * This is what makes the card appear in the composer without a wait: the
   * render happens now, in this request, and the scraper that follows gets a
   * stored PNG. Returns null if storage is unavailable or the render failed.
   */
  const createShareUrl = async (message: string | null): Promise<string | null> => {
    // A heavy character's render occasionally runs out of CPU on the first
    // try; a second request a moment later almost always lands. Only after
    // that does the caller fall back to the long legacy URL.
    for (let attempt = 0; attempt < 2; attempt++) {
      if (attempt > 0) await new Promise((resolve) => setTimeout(resolve, 1200));
      try {
        const response = await fetch('/api/share', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(message ? { ...traitSelection(), message } : traitSelection()),
        });
        // A 400 is the request itself (a message the server refuses); retrying cannot fix it.
        if (response.status === 400) return null;
        if (!response.ok) continue;
        const { url } = (await response.json()) as { url?: string };
        if (url) return url;
      } catch {
        // Network blip: try again.
      }
    }
    return null;
  };

  /**
   * Resolves the share link for the current selection and message, reusing a
   * stored one instead of re-POSTing when the pair hasn't changed - flipping
   * between message chips costs one request per distinct card.
   */
  const getShareLink = async (message: string | null): Promise<ShareLink> => {
    const key = JSON.stringify({ traits: traitSelection(), message });
    const cached = shareLinkCacheRef.current.get(key);
    if (cached) return cached;

    const storedUrl = await createShareUrl(message);
    if (storedUrl) {
      const id = storedUrl.slice(storedUrl.lastIndexOf('/') + 1);
      const link = { url: storedUrl, imageUrl: `/api/image/p/${id}.png` };
      shareLinkCacheRef.current.set(key, link);
      return link;
    }

    // No silent fallback to the long /api/og URL: it drops the message and
    // renders on the scraper's request, the exact failure storing avoids. The
    // dialog says it failed and offers a retry; nothing is cached, so the
    // retry POSTs again.
    throw new Error('Could not create the share link');
  };

  return (
    <>
      <div className="w-full h-full flex flex-col overflow-hidden" ref={containerRef}>
        {/* Canvas Container - Takes most of the space */}
        <div className="flex-1 min-h-0 flex items-center justify-center p-2 sm:p-4">
          <div className="flex h-full max-h-full w-full max-w-full items-center justify-center rounded-md border border-hairline bg-artboard">
            <canvas
              ref={canvasRef}
              className="block max-w-full max-h-full"
              style={{ imageRendering: 'crisp-edges' }}
            />
          </div>
        </div>

        {/* Text overlay for draggable text elements */}
        <div
          ref={overlayRef}
          className="absolute inset-0 pointer-events-none z-20"
        >
          {textElements.filter(element => element.text.trim()).map((textElement) => (
            <div
              key={textElement.id}
              className={`absolute pointer-events-auto cursor-move select-none group ${isDragging === textElement.id ? 'z-50' : 'z-10'}`}
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
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-ground/80 text-ink px-2 py-1 rounded text-micro whitespace-nowrap pointer-events-none">
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

        {/* Action Buttons - Fixed at bottom */}
        <div className="flex flex-wrap justify-center gap-1 sm:gap-2 p-1 sm:p-2 flex-shrink-0">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <ActionButton
              icon={<Download size={16} />}
              label="Download"
              onClick={handleDownload}
              variant="secondary"
              disabled={isLoading}
            />
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <ActionButton
              icon={isCopying ? <Check size={16} /> : <Copy size={16} />}
              label="Copy"
              onClick={handleCopy}
              variant="secondary"
              disabled={isLoading}
              isCopying={isCopying}
            />
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <ActionButton
              icon={<Share2 size={16} />}
              label="Share"
              onClick={() => setIsShareOpen(true)}
              variant="default"
              disabled={isLoading || !baseImage}
            />
          </motion.div>
          {onRandomize && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <ActionButton
                icon={<Shuffle size={16} />}
                label="Randomize"
                onClick={onRandomize}
                variant="secondary"
                disabled={isLoading}
              />
            </motion.div>
          )}
        </div>
      </div>

      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        getShareLink={getShareLink}
        composeCharacter={composeCharacter}
      />
    </>
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
      size="sm"
      className="flex items-center gap-1 sm:gap-2 transition-all duration-300 text-micro sm:text-meta px-2 sm:px-3"
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
      <span className="hidden sm:inline">{isCopying ? 'Copied!' : label}</span>
      <span className="sm:hidden">{isCopying ? 'OK' : label.split(' ')[0]}</span>
    </Button>
  );
};

export default CharacterPreview;