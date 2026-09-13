import { baseCharacterImage } from '@/data/traits';
import { splitAtBase } from '@/data/traitOrder';
import { BASE_IMAGE_SCALE_MULTIPLIER } from '@/utils/canvasConstants';
import { motion } from 'framer-motion';
import { BellRing, Check, Copy, Download, Link2, Move, Share2, Shuffle } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Trait } from '../types';
import { TwitterIcon } from './Navbar';
import SendPingModal from './SendPingModal';
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
  const [isSharing, setIsSharing] = useState(false);
  const [isCopyingLink, setIsCopyingLink] = useState(false);
  const [isNativeSharing, setIsNativeSharing] = useState(false);
  const [isSendPingOpen, setIsSendPingOpen] = useState(false);
  const [linkCopyAnnouncement, setLinkCopyAnnouncement] = useState('');
  const shareUrlCacheRef = useRef<{ key: string; url: string } | null>(null);
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
   * Download, Copy and Send a PING all start from this, so the three exports
   * cannot register traits differently.
   */
  const composeCharacter = useCallback(
    (size: number): HTMLCanvasElement | null => {
      if (!baseImage) return null;
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
      const size = Math.min(rect.width, rect.height);
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

  const generateApiUrl = () => {
    // Share links have to point at whatever host is serving the page.
    const baseUrl = `${window.location.origin}/api/og`;
    const params = new URLSearchParams();

    // Add selected traits as query parameters
    selectedTraits.forEach((trait) => {
      if (trait) {
        params.append(trait.category, trait.id.slice(0, trait.id.lastIndexOf('_' + trait.category)));
      }
    });
    const paramsString = params.size > 0 ? `?${params.toString()}` : '';
    return `${baseUrl}${paramsString}`;
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
   * Stores the character server-side and returns its short share URL.
   *
   * This is what makes the card appear in the composer without a wait: the
   * render happens now, in this request, and the scraper that follows gets a
   * stored PNG. Returns null if storage is unavailable (no binding, render
   * failure), and the caller falls back to the legacy query-param URL, which
   * still works and still unfurls - just by rendering on the bot's request.
   */
  const createShareUrl = async (): Promise<string | null> => {
    try {
      const response = await fetch('/api/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(traitSelection()),
      });
      if (!response.ok) return null;
      const { url } = (await response.json()) as { url?: string };
      return url ?? null;
    } catch {
      return null;
    }
  };

  /**
   * Resolves the share URL for the current trait selection, reusing a
   * previously stored URL instead of re-POSTing to /api/share when the
   * selection hasn't changed since the last successful call.
   */
  const getShareUrl = async (): Promise<string> => {
    const key = JSON.stringify(traitSelection());
    if (shareUrlCacheRef.current?.key === key) {
      return shareUrlCacheRef.current.url;
    }

    const storedUrl = await createShareUrl();
    if (storedUrl) {
      shareUrlCacheRef.current = { key, url: storedUrl };
      return storedUrl;
    }

    // Storage failed - fall back without caching, so a later retry can
    // still succeed once storage is available again.
    return generateApiUrl();
  };

  const handleCopyLink = async () => {
    setIsCopyingLink(true);
    try {
      // Safari drops the click's user activation across the /api/share await
      // and rejects a late writeText; handing ClipboardItem the pending value
      // claims the clipboard synchronously inside the click.
      if (typeof ClipboardItem !== 'undefined' && navigator.clipboard.write) {
        const blob = getShareUrl().then((url) => new Blob([url], { type: 'text/plain' }));
        await navigator.clipboard.write([new ClipboardItem({ 'text/plain': blob })]);
      } else {
        await navigator.clipboard.writeText(await getShareUrl());
      }
      setLinkCopyAnnouncement('Link copied to clipboard');
      // Keep the animation visible longer to show success
      setTimeout(() => {
        setIsCopyingLink(false);
        setLinkCopyAnnouncement('');
      }, 1500);
    } catch (error) {
      console.error('Error copying link:', error);
      setIsCopyingLink(false);
    }
  };

  const handleNativeShare = async () => {
    setIsNativeSharing(true);
    try {
      const shareUrl = await getShareUrl();
      await navigator.share({ url: shareUrl, title: 'You have 1 new PING.' });
    } catch (error) {
      // The user closing the share sheet is not a failure.
      if ((error as { name?: string })?.name !== 'AbortError') {
        console.error('Error sharing:', error);
      }
    } finally {
      setIsNativeSharing(false);
    }
  };

  const handleShareOnX = async () => {
    setIsSharing(true);

    // Opened before the await: a popup opened from inside an async
    // continuation has lost the user gesture and browsers block it. It gets
    // pointed at the real URL once there is one.
    const composer = window.open('', '_blank');

    try {
      const shareUrl = await getShareUrl();
      const tweetText = "You have 1 new PING.\nSend one back:\n";
      const hashtags = "PING,RobinhoodChain,Crypto";

      const twitterUrl = new URL('https://twitter.com/intent/tweet');
      twitterUrl.searchParams.set('text', tweetText);
      twitterUrl.searchParams.set('hashtags', hashtags);
      // The card comes from this URL unfurling. The intent has no parameter
      // for attaching an image - one used to be set here and had never done
      // anything - so the unfurl is the picture.
      twitterUrl.searchParams.set('url', shareUrl);

      if (composer) composer.location.href = twitterUrl.toString();
      else window.open(twitterUrl.toString(), '_blank');

      setTimeout(() => setIsSharing(false), 2000);
    } catch (error) {
      console.error('Error sharing on X:', error);
      composer?.close();
      setIsSharing(false);
    }
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
              icon={<BellRing size={16} />}
              label="Send a PING"
              onClick={() => setIsSendPingOpen(true)}
              variant="secondary"
              disabled={isLoading || !baseImage}
            />
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <ActionButton
              icon={<Download size={16} />}
              label="Download"
              onClick={handleDownload}
              variant="default"
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
              icon={isCopyingLink ? <Check size={16} /> : <Link2 size={16} />}
              label="Copy link"
              onClick={handleCopyLink}
              variant="secondary"
              disabled={isLoading || isCopyingLink}
              isCopying={isCopyingLink}
            />
          </motion.div>
          {typeof navigator !== 'undefined' && !!navigator.share && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <ActionButton
                icon={<Share2 size={16} />}
                label={isNativeSharing ? "Sharing..." : "Share"}
                onClick={handleNativeShare}
                variant="secondary"
                disabled={isLoading || isNativeSharing}
              />
            </motion.div>
          )}
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
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <ActionButton
              icon={<TwitterIcon />}
              label={isSharing ? "Sharing..." : "Tweet"}
              onClick={handleShareOnX}
              variant="secondary"
              disabled={isLoading || isSharing}
            />
          </motion.div>
        </div>
        <span aria-live="polite" className="sr-only">{linkCopyAnnouncement}</span>
      </div>

      <SendPingModal
        isOpen={isSendPingOpen}
        onClose={() => setIsSendPingOpen(false)}
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
      className={`flex items-center gap-1 sm:gap-2 transition-all duration-300 text-micro sm:text-meta px-2 sm:px-3 ${isCopying
        ? 'border-positive bg-positive text-ink-inverse hover:bg-positive'
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
      <span className="hidden sm:inline">{isCopying ? 'Copied!' : label}</span>
      <span className="sm:hidden">{isCopying ? 'OK' : label.split(' ')[0]}</span>
    </Button>
  );
};

export default CharacterPreview;