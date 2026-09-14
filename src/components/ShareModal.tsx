import { Check, Copy, Send, Share2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { TwitterIcon } from './Navbar';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';

export interface ShareLink {
  /** The link people paste: /p/<id>, or the legacy /api/og URL when storage is down. */
  url: string;
  /** The card that link unfurls to. */
  imageUrl: string;
}

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Stores the current character (or reuses the stored one) and resolves its link. */
  getShareLink: () => Promise<ShareLink>;
}

export const SHARE_TEXT = 'You have 1 new PING.\nSend one back:\n';
export const SHARE_HASHTAGS = 'PING,RobinhoodChain,Crypto';

/**
 * Everything needed to post a character: the card the link unfurls to (the
 * stored render, not a mock-up), the link, and the places people post it.
 *
 * The link is resolved when the dialog opens, so every target below is a plain
 * link or a synchronous copy. That removes the old popup-before-await and
 * ClipboardItem-promise workarounds: nothing here runs after an await inside
 * a click.
 */
const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, getShareLink }) => {
  const [link, setLink] = useState<ShareLink | null>(null);
  const [failed, setFailed] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [copied, setCopied] = useState(false);
  const canNativeShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    setLink(null);
    setFailed(false);
    setImageLoaded(false);
    getShareLink()
      .then((resolved) => { if (!cancelled) setLink(resolved); })
      .catch(() => { if (!cancelled) setFailed(true); });
    return () => { cancelled = true; };
    // getShareLink reads the selection at open time; reopening refreshes it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const copy = async () => {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      console.error('Error copying link:', error);
    }
  };

  const nativeShare = async () => {
    if (!link) return;
    try {
      await navigator.share({ url: link.url, title: 'You have 1 new PING.' });
    } catch (error) {
      // The user closing the share sheet is not a failure.
      if ((error as { name?: string })?.name !== 'AbortError') console.error('Error sharing:', error);
    }
  };

  const xHref = link
    ? `https://twitter.com/intent/tweet?${new URLSearchParams({ text: SHARE_TEXT, hashtags: SHARE_HASHTAGS, url: link.url })}`
    : undefined;
  const telegramHref = link
    ? `https://t.me/share/url?${new URLSearchParams({ url: link.url, text: 'You have 1 new PING. Send one back.' })}`
    : undefined;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[92svh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-h3 font-bold">Share</DialogTitle>
          <DialogDescription className="text-meta text-ink-muted">
            This is the card people see when the link is posted.
          </DialogDescription>
        </DialogHeader>

        <div className="relative aspect-[1200/630] w-full overflow-hidden rounded-md border border-hairline bg-artboard">
          {!imageLoaded && !failed && <div className="absolute inset-0 animate-pulse bg-panel" />}
          {failed && (
            <p className="absolute inset-0 flex items-center justify-center p-4 text-center text-meta text-ink-muted">
              Could not create the link. Close and try again.
            </p>
          )}
          {link && (
            <img
              src={link.imageUrl}
              alt="Link preview card for this PING"
              onLoad={() => setImageLoaded(true)}
              className={`h-full w-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            />
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
          <Button size="sm" variant="secondary" className="shrink-0 gap-1.5" onClick={copy} disabled={!link}>
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied' : 'Copy link'}
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
