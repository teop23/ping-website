import { Check, Copy, Download, Send, Share2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import {
  CARD_SIZE,
  MAX_MESSAGE_LENGTH,
  PING_MESSAGES,
  STICKER_SIZE,
  drawPingCard,
  loadCardFonts,
  messageProblem,
  normalizeMessage,
} from '../utils/pingCard';
import { TwitterIcon } from './Navbar';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';

export interface ShareLink {
  /** The link people paste: /p/<id>. */
  url: string;
  /** The card that link unfurls to. */
  imageUrl: string;
}

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  /**
   * Stores the current character with a message (null for the default one)
   * and resolves its link, rejecting when the card could not be stored.
   * Called again whenever the message changes.
   */
  getShareLink: (message: string | null) => Promise<ShareLink>;
  /** The current character composited into a square canvas, or null before the base art loads. */
  composeCharacter: (size: number) => HTMLCanvasElement | null;
}

export const SHARE_HASHTAGS = 'PING,RobinhoodChain,Crypto';
export const shareText = (message: string) => `${message}\nSend one back:\n`;

const ICON_SRC = '/favicon-180.png';

const toBlob = (canvas: HTMLCanvasElement) =>
  new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('toBlob failed'))), 'image/png')
  );

/** How long typing has to pause before a custom message is rendered and stored. */
const TYPING_PAUSE_MS = 700;

const slug = (message: string) =>
  message.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'ping';

/**
 * The one place a character leaves the builder. The card shown is the stored
 * render X and Telegram unfurl: the character beside a phone showing a PING
 * notification. Without "Add a message" it says the default line; with it,
 * the sender picks a suggestion or writes their own. The same message can be
 * saved as a square notification image or a sticker.
 *
 * The link is resolved before any target is clickable, so every target is a
 * plain link or a synchronous copy - nothing runs after an await inside a click.
 */
const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, getShareLink, composeCharacter }) => {
  const [withMessage, setWithMessage] = useState(false);
  const [draft, setDraft] = useState<string>(PING_MESSAGES[1]);
  // The draft once typing pauses: what is rendered, stored and linked.
  const [settledDraft, setSettledDraft] = useState(draft);
  const [link, setLink] = useState<ShareLink | null>(null);
  // The last card that resolved, kept on screen while the next one renders.
  const [shown, setShown] = useState<ShareLink | null>(null);
  const [failed, setFailed] = useState(false);
  // Bumped by Try again to re-run the link effect for the same message.
  const [attempt, setAttempt] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [copied, setCopied] = useState<'link' | 'image' | null>(null);
  const [icon, setIcon] = useState<HTMLImageElement | null>(null);
  const canNativeShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  const problem = withMessage ? messageProblem(draft) : null;
  const message = withMessage && !messageProblem(settledDraft) ? normalizeMessage(settledDraft) : PING_MESSAGES[0];
  const typing = withMessage && draft !== settledDraft;

  useEffect(() => {
    // Chips set the whole draft at once and settle immediately; typing waits.
    const timer = setTimeout(() => setSettledDraft(draft), TYPING_PAUSE_MS);
    return () => clearTimeout(timer);
  }, [draft]);

  const pick = (option: string) => {
    setDraft(option);
    setSettledDraft(option);
  };

  useEffect(() => {
    if (!isOpen) return;
    const img = new Image();
    img.onload = () => setIcon(img);
    img.src = ICON_SRC;
    loadCardFonts();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    setLink(null);
    setFailed(false);
    getShareLink(message === PING_MESSAGES[0] ? null : message)
      .then((resolved) => {
        if (cancelled) return;
        setLink(resolved);
        setShown(resolved);
      })
      .catch(() => { if (!cancelled) setFailed(true); });
    return () => { cancelled = true; };
    // getShareLink reads the selection at open time; reopening refreshes it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, message, attempt]);

  const flash = (what: 'link' | 'image') => {
    setCopied(what);
    setTimeout(() => setCopied(null), 1500);
  };

  const copyLink = async () => {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link.url);
      flash('link');
    } catch (error) {
      console.error('Error copying link:', error);
    }
  };

  const nativeShare = async () => {
    if (!link) return;
    try {
      await navigator.share({ url: link.url, title: message });
    } catch (error) {
      // The user closing the share sheet is not a failure.
      if ((error as { name?: string })?.name !== 'AbortError') console.error('Error sharing:', error);
    }
  };

  const renderCard = async (size: number, opaque: boolean): Promise<HTMLCanvasElement | null> => {
    const character = composeCharacter(size);
    if (!character) return null;
    await loadCardFonts();
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    drawPingCard(ctx, { size, character, icon, message, opaque });
    return canvas;
  };

  const download = async (size: number, opaque: boolean, filename: string) => {
    const canvas = await renderCard(size, opaque);
    if (!canvas) return;
    const url = URL.createObjectURL(await toBlob(canvas));
    const anchor = document.createElement('a');
    anchor.download = filename;
    anchor.href = url;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const copyImage = async () => {
    try {
      // The ClipboardItem gets the blob promise synchronously, inside the click.
      await navigator.clipboard.write([
        new ClipboardItem({
          'image/png': renderCard(CARD_SIZE, true).then((canvas) => {
            if (!canvas) throw new Error('character not ready');
            return toBlob(canvas);
          }),
        }),
      ]);
      flash('image');
    } catch (error) {
      console.error('Failed to copy PING image:', error);
    }
  };

  const xHref = link
    ? `https://twitter.com/intent/tweet?${new URLSearchParams({ text: shareText(message), hashtags: SHARE_HASHTAGS, url: link.url })}`
    : undefined;
  const telegramHref = link
    ? `https://t.me/share/url?${new URLSearchParams({ url: link.url, text: `${message} Send one back.` })}`
    : undefined;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[92svh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-h3 font-bold">Share</DialogTitle>
          <DialogDescription className="text-meta text-ink-muted">
            This card shows up wherever the link is posted.
          </DialogDescription>
        </DialogHeader>

        <div className="relative aspect-[800/420] w-full overflow-hidden rounded-md border border-hairline bg-artboard">
          {!imageLoaded && !failed && <div className="absolute inset-0 animate-pulse bg-panel" />}
          {failed && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center">
              <p className="text-meta text-ink-muted">Could not create the link.</p>
              <Button size="sm" variant="secondary" onClick={() => setAttempt((n) => n + 1)}>
                Try again
              </Button>
            </div>
          )}
          {shown && !failed && (
            <img
              src={shown.imageUrl}
              alt="Link preview card for this PING"
              onLoad={() => setImageLoaded(true)}
              className={`h-full w-full object-cover transition-opacity duration-300 ${
                !imageLoaded ? 'opacity-0' : link && !typing ? 'opacity-100' : 'opacity-50'
              }`}
            />
          )}
        </div>

        <div className="space-y-2">
          <label className="flex w-fit cursor-pointer items-center gap-2 text-meta text-ink">
            <input
              type="checkbox"
              checked={withMessage}
              onChange={(event) => setWithMessage(event.currentTarget.checked)}
              className="h-4 w-4 accent-ink"
            />
            Add a message
          </label>

          {withMessage && (
            <div className="space-y-2">
              <input
                value={draft}
                maxLength={MAX_MESSAGE_LENGTH}
                onChange={(event) => setDraft(event.currentTarget.value)}
                aria-label="Message"
                aria-invalid={Boolean(problem)}
                placeholder="Write your own"
                className="h-9 w-full rounded-md border border-hairline bg-artboard px-3 text-meta text-ink aria-[invalid=true]:border-red-600"
              />
              <p className={`text-micro ${problem ? 'text-red-700' : 'text-ink-faint'}`}>
                {problem ?? `${draft.length}/${MAX_MESSAGE_LENGTH}. Or pick one:`}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {PING_MESSAGES.map((option) => (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={draft === option}
                    onClick={() => pick(option)}
                    className={`h-8 rounded-md border px-2.5 text-micro transition-colors duration-fast ease-out-quart ${
                      draft === option
                        ? 'border-ink bg-ink text-ground'
                        : 'border-hairline text-ink-muted hover:bg-panel hover:text-ink'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <input
            readOnly
            value={link?.url ?? (failed ? '' : 'Creating link...')}
            aria-label="Share link"
            onFocus={(event) => event.currentTarget.select()}
            className="h-9 min-w-0 flex-1 rounded-md border border-hairline bg-artboard px-3 font-mono text-micro text-ink"
          />
          <Button size="sm" className="shrink-0 gap-1.5" onClick={copyLink} disabled={!link}>
            {copied === 'link' ? <Check size={16} /> : <Copy size={16} />}
            {copied === 'link' ? 'Copied' : 'Copy link'}
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          <ShareTarget href={xHref} icon={<TwitterIcon size={16} />} label="Post on X" />
          <ShareTarget href={telegramHref} icon={<Send size={16} />} label="Telegram" />
          {canNativeShare && (
            <Button size="sm" variant="secondary" className="gap-1.5" onClick={nativeShare} disabled={!link}>
              <Share2 size={16} />
              More...
            </Button>
          )}
        </div>

        <div className="space-y-2 border-t border-hairline pt-3">
          <p className="text-micro font-medium uppercase tracking-wider text-ink-faint">Save as image</p>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="secondary" className="gap-1.5" onClick={() => download(CARD_SIZE, true, `ping-${slug(message)}.png`)}>
              <Download size={16} />
              Notification
            </Button>
            <Button size="sm" variant="secondary" className="gap-1.5" onClick={copyImage}>
              {copied === 'image' ? <Check size={16} /> : <Copy size={16} />}
              {copied === 'image' ? 'Copied' : 'Copy image'}
            </Button>
            <Button size="sm" variant="secondary" className="gap-1.5" onClick={() => download(STICKER_SIZE, false, 'ping-sticker.png')}>
              <Download size={16} />
              Telegram sticker
            </Button>
          </div>
          <p className="text-micro text-ink-faint">
            Square 1024px notification. Stickers are 512px transparent PNGs for a pack via @Stickers on Telegram.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ShareTarget: React.FC<{ href?: string; icon: React.ReactNode; label: string }> = ({ href, icon, label }) =>
  href ? (
    <Button asChild size="sm" variant="secondary" className="gap-1.5">
      <a href={href} target="_blank" rel="noopener noreferrer">
        {icon}
        {label}
      </a>
    </Button>
  ) : (
    <Button size="sm" variant="secondary" className="gap-1.5" disabled>
      {icon}
      {label}
    </Button>
  );

export default ShareModal;
