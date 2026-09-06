import React from 'react';
import { Link } from 'react-router-dom';
import {
  CHAIN_ID,
  CHAIN_NAME,
  LAUNCHPAD_NAME,
  LAUNCHPAD_URL,
  SOCIAL_LINKS,
} from '../utils/constants';

/**
 * Every link here goes somewhere real.
 *
 * The previous footer linked to a whitepaper, tokenomics, an FAQ, a Discord and
 * a GitHub, all with href="#". On a site whose entire job is looking credible,
 * a dead "Whitepaper" link costs more than having no link at all.
 */
const NAV_LINKS = [
  { label: 'Generator', to: '/#builder' },
  { label: 'Roadmap', to: '/#roadmap' },
  { label: 'Community', to: '/community' },
  { label: 'Trait editor', to: '/create-traits' },
  { label: 'Watermark tool', to: '/watermark' },
  { label: 'API docs', to: '/docs' },
];

const Footer: React.FC = () => (
  <footer className="border-t border-hairline">
    <div className="container py-12">
      <div className="flex flex-col gap-10 md:flex-row md:justify-between">
        <div className="max-w-sm">
          <span className="type-display font-display text-h3 font-extrabold text-ink">PING</span>
          <p className="mt-3 text-meta text-ink-muted">
            A character generator, an open image API, and a token on {CHAIN_NAME}.
          </p>
        </div>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-12 gap-y-2.5 sm:gap-x-16">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="text-meta text-ink-muted transition-colors duration-fast ease-out-quart hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="mt-10 flex flex-col gap-4 border-t border-hairline pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-micro text-ink-faint">
          &copy; {new Date().getFullYear()} PING. Built on {CHAIN_NAME} (chain ID{' '}
          <span data-numeric>{CHAIN_ID}</span>).
        </p>

        <div className="flex items-center gap-5">
          <a
            href={SOCIAL_LINKS.TWITTER}
            target="_blank"
            rel="noopener noreferrer"
            className="text-micro text-ink-faint transition-colors duration-fast ease-out-quart hover:text-ink"
          >
            X
          </a>
          <a
            href={SOCIAL_LINKS.TELEGRAM}
            target="_blank"
            rel="noopener noreferrer"
            className="text-micro text-ink-faint transition-colors duration-fast ease-out-quart hover:text-ink"
          >
            Telegram
          </a>
          <a
            href={LAUNCHPAD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-micro text-ink-faint transition-colors duration-fast ease-out-quart hover:text-ink"
          >
            {LAUNCHPAD_NAME}
          </a>
        </div>
      </div>

      {/*
        Stated plainly rather than buried. Pons is built by Pons-Labs and is not
        an official Robinhood product; neither is this, and implying otherwise
        would be a real problem rather than a stylistic one.
      */}
      <p className="type-prose mt-6 text-micro text-ink-faint">
        $PING is a memecoin with no intrinsic value and no expectation of financial return. It is
        not affiliated with, endorsed by, or connected to Robinhood Markets, Inc. or Pons-Labs, LLC.
        Tokens can lose all value. Nothing here is financial advice.
      </p>
    </div>
  </footer>
);

export default Footer;
