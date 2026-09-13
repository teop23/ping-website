import { Check, Copy, Download } from 'lucide-react';
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

interface SendPingModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** The current character composited into a square canvas, or null before the base art loads. */
  composeCharacter: (size: number) => HTMLCanvasElement | null;
}

const ICON_SRC = '/favicon-180.png';

const toBlob = (canvas: HTMLCanvasElement) =>
  new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('toBlob failed'))), 'image/png')
  );

const slug = (message: string) =>
  message.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'ping';

const SendPingModal: React.FC<SendPingModalProps> = ({ isOpen, onClose, composeCharacter }) => {
  const previewRef = useRef<HTMLCanvasElement>(null);
  const [icon, setIcon] = useState<HTMLImageElement | null>(null);
  const [fontsReady, setFontsReady] = useState(false);
  const [preset, setPreset] = useState<string | null>(PING_MESSAGES[0]);
  const [custom, setCustom] = useState('');
  const [copied, setCopied] = useState(false);

  // preset '' is the No banner choice: the character alone.
  const message = preset === '' ? '' : normalizeMessage(preset ?? custom) || PING_MESSAGES[0];

  useEffect(() => {
    if (!isOpen) return;
    const img = new Image();
    img.onload = () => setIcon(img);
    img.src = ICON_SRC;
    loadCardFonts().then(() => setFontsReady(true));
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
