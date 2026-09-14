import { Check, Copy, Download, Link as LinkIcon } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import {
  CARD_SIZE,
  MAX_MESSAGE_LENGTH,
  PING_MESSAGES,
  STICKER_SIZE,
  drawPingCard,
  loadCardFonts,
  normalizeMessage,
} from '../utils/pingCard';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import type { ShareLink } from './ShareModal';

interface SendPingModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** The current character composited into a square canvas, or null before the base art loads. */
  composeCharacter: (size: number) => HTMLCanvasElement | null;
  /**
   * Stores this PING server-side (character + the given preset message, or
   * no message for "No banner") and resolves its /p link. `message` is null
   * when the box has custom, non-preset text - presets-only, so the caller
   * should keep the link action disabled in that case.
   */
  getShareLink: (message: string | null) => Promise<ShareLink>;
}

const ICON_SRC = '/favicon-180.png';

const toBlob = (canvas: HTMLCanvasElement) =>
  new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('toBlob failed'))), 'image/png')
  );

const slug = (message: string) =>
  message.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'ping';

const SendPingModal: React.FC<SendPingModalProps> = ({ isOpen, onClose, composeCharacter, getShareLink }) => {
  const previewRef = useRef<HTMLCanvasElement>(null);
  const [icon, setIcon] = useState<HTMLImageElement | null>(null);
  const [fontsReady, setFontsReady] = useState(false);
  const [preset, setPreset] = useState<string | null>(PING_MESSAGES[0]);
  const [custom, setCustom] = useState('');
  const [copied, setCopied] = useState(false);
  const [link, setLink] = useState<ShareLink | null>(null);
  const [linkStatus, setLinkStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [linkCopied, setLinkCopied] = useState(false);

  // preset '' is the No banner choice: the character alone.
  const message = preset === '' ? '' : normalizeMessage(preset ?? custom) || PING_MESSAGES[0];

  // A preset chosen (including '' for No banner) is shareable; custom typed
  // text is not - presets-only, see docs/proposals/send-a-ping-link.md.
  const shareableMessage = preset === '' ? null : preset;
  const canShare = preset !== null;

  // The link is tied to a specific message; switching presets invalidates it
  // rather than showing a stale link for the wrong card.
  useEffect(() => {
    setLink(null);
    setLinkStatus('idle');
  }, [preset]);

  const getLink = async () => {
    if (!canShare) return;
    setLinkStatus('loading');
    try {
      setLink(await getShareLink(shareableMessage));
      setLinkStatus('idle');
    } catch {
      setLinkStatus('error');
    }
  };

  const copyLink = async () => {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link.url);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 1500);
    } catch (error) {
      console.error('Failed to copy PING link:', error);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    const img = new Image();
    img.onload = () => setIcon(img);
    img.src = ICON_SRC;
    loadCardFonts().then(() => setFontsReady(true));
    setLink(null);
    setLinkStatus('idle');
  }, [isOpen]);

  const render = (size: number, opaque: boolean): HTMLCanvasElement | null => {
    const character = composeCharacter(size);
    if (!character) return null;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    drawPingCard(ctx, { size, character, icon, message, opaque });
    return canvas;
  };

  // The dialog mounts its content lazily, so the preview canvas only exists
  // once it is open; a rAF waits for that commit.
  useEffect(() => {
    if (!isOpen) return;
    const frame = requestAnimationFrame(() => {
      const target = previewRef.current;
      const card = render(STICKER_SIZE, true);
      const ctx = target?.getContext('2d');
      if (!target || !card || !ctx) return;
      ctx.clearRect(0, 0, target.width, target.height);
      ctx.drawImage(card, 0, 0, target.width, target.height);
    });
    return () => cancelAnimationFrame(frame);
    // render reads composeCharacter/icon/message; those are the real inputs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, icon, fontsReady, message, composeCharacter]);

  const download = async (size: number, opaque: boolean, filename: string) => {
    const canvas = render(size, opaque);
    if (!canvas) return;
    const url = URL.createObjectURL(await toBlob(canvas));
    const link = document.createElement('a');
    link.download = filename;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const copy = async () => {
    const canvas = render(CARD_SIZE, true);
    if (!canvas) return;
    try {
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': await toBlob(canvas) })]);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      console.error('Failed to copy PING:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[92svh] max-w-md overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-h3 font-bold">Send a PING</DialogTitle>
          <DialogDescription className="text-meta text-ink-muted">
            Your character, delivered as a notification.
          </DialogDescription>
        </DialogHeader>

        <canvas
          ref={previewRef}
          width={STICKER_SIZE}
          height={STICKER_SIZE}
          role="img"
          aria-label={message ? `PING notification card: ${message}` : 'PING character, no banner'}
          className="mx-auto aspect-square w-full max-w-[20rem] rounded-md border border-hairline"
        />

        <fieldset className="space-y-2">
          <legend className="text-micro font-medium uppercase tracking-wider text-ink-faint">Message</legend>
          <div className="flex flex-wrap gap-1.5">
            {PING_MESSAGES.map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={preset === option}
                onClick={() => setPreset(option)}
                className={`h-8 rounded-md border px-2.5 text-micro transition-colors duration-fast ease-out-quart ${
                  preset === option
                    ? 'border-ink bg-ink text-ground'
                    : 'border-hairline text-ink-muted hover:bg-panel hover:text-ink'
                }`}
              >
                {option}
              </button>
            ))}
            <button
              type="button"
              aria-pressed={preset === ''}
              onClick={() => setPreset('')}
              className={`h-8 rounded-md border px-2.5 text-micro transition-colors duration-fast ease-out-quart ${
                preset === ''
                  ? 'border-ink bg-ink text-ground'
                  : 'border-dashed border-hairline text-ink-muted hover:bg-panel hover:text-ink'
              }`}
            >
              No banner
            </button>
          </div>
          <label className="block">
            <span className="sr-only">Custom message</span>
            <input
              type="text"
              value={custom}
              maxLength={MAX_MESSAGE_LENGTH}
              placeholder="Or write your own"
              onFocus={() => custom && setPreset(null)}
              onChange={(event) => {
                setCustom(event.target.value);
                setPreset(event.target.value.trim() ? null : PING_MESSAGES[0]);
              }}
              className="h-9 w-full rounded-md border border-hairline bg-artboard px-3 text-meta text-ink placeholder:text-ink-faint"
            />
          </label>
        </fieldset>

        <div className="flex items-center gap-2">
          {link ? (
            <>
              <input
                readOnly
                value={link.url}
                aria-label="PING link"
                onFocus={(event) => event.currentTarget.select()}
                className="h-9 min-w-0 flex-1 rounded-md border border-hairline bg-artboard px-3 font-mono text-micro text-ink"
              />
              <Button size="sm" variant="secondary" className="shrink-0 gap-1.5" onClick={copyLink}>
                {linkCopied ? <Check size={16} /> : <Copy size={16} />}
                {linkCopied ? 'Copied' : 'Copy'}
              </Button>
            </>
          ) : (
            <Button
              size="sm"
              variant="secondary"
              className="gap-1.5"
              onClick={getLink}
              disabled={!canShare || linkStatus === 'loading'}
              title={canShare ? undefined : 'Pick a preset message to get a link - custom text can\'t be shared yet'}
            >
              <LinkIcon size={16} />
              {linkStatus === 'loading' ? 'Creating link...' : 'Get link'}
            </Button>
          )}
        </div>
        {linkStatus === 'error' && (
          <p className="text-micro text-negative">Could not create the link. Try again.</p>
        )}

        <div className="flex flex-wrap gap-2">
          <Button size="sm" className="gap-1.5" onClick={() => download(CARD_SIZE, true, message ? `ping-${slug(message)}.png` : 'ping.png')}>
            <Download size={16} />
            Download image
          </Button>
          <Button size="sm" variant="secondary" className="gap-1.5" onClick={() => download(STICKER_SIZE, false, 'ping-sticker.png')}>
            <Download size={16} />
            Telegram sticker
          </Button>
          <Button size="sm" variant="secondary" className="gap-1.5" onClick={copy}>
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied' : 'Copy image'}
          </Button>
        </div>
        <p className="text-micro text-ink-faint">
          Stickers are 512px transparent PNGs. Add them to a pack with @Stickers on Telegram.
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default SendPingModal;
