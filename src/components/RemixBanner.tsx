import { X } from 'lucide-react';
import React from 'react';

interface RemixBannerProps {
  onDismiss: () => void;
}

/** Shown above the preview when the builder loaded a shared PING's traits. */
const RemixBanner: React.FC<RemixBannerProps> = ({ onDismiss }) => (
  <div
    role="status"
    className="flex shrink-0 items-center justify-between gap-3 rounded-md border border-brand bg-brand-wash px-3 py-2 text-micro text-accent-ink"
  >
    <span>You're remixing a shared PING. Change anything and share your own.</span>
    <button
      type="button"
      onClick={onDismiss}
      aria-label="Dismiss remix notice"
      className="shrink-0 rounded-md p-1 text-accent-ink transition-colors duration-fast ease-out-quart hover:bg-brand/20"
    >
      <X size={13} />
    </button>
  </div>
);

export default RemixBanner;
