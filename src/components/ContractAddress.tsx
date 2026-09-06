import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Check, Copy } from 'lucide-react';
import React, { useState } from 'react';
import {
  BUY_LINK,
  CHAIN_NAME,
  CONTRACT_ADDRESS,
  EXPLORER_LINK,
  LAUNCHPAD_NAME,
  TOKEN_LIVE,
} from '../utils/constants';

/**
 * The single most-scanned element on the page: a trader arriving from a Pons
 * listing wants the address and the buy link, in that order, without hunting.
 *
 * Pre-launch it says so plainly rather than showing a stale address from a
 * different chain.
 */
const ContractAddress: React.FC = () => {
  const [isCopied, setIsCopied] = useState(false);
  const reduceMotion = useReducedMotion();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(CONTRACT_ADDRESS);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy contract address:', error);
    }
  };

  const isLive = TOKEN_LIVE && CONTRACT_ADDRESS.length > 0;

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25, duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
      className="w-full max-w-2xl"
    >
      <div className="rounded-lg border border-hairline bg-raised">
        <div className="flex items-center justify-between gap-3 border-b border-hairline px-4 py-2.5">
          <span className="text-micro font-medium uppercase tracking-wider text-ink-faint">
            Contract
          </span>
          <span className="flex items-center gap-1.5 text-micro text-ink-muted">
            {/* Colour is never the only channel: the dot has a label beside it. */}
            <span
              aria-hidden="true"
              className={
                isLive
                  ? 'size-1.5 rounded-pill bg-positive motion-safe:animate-pulse-live'
                  : 'size-1.5 rounded-pill bg-ink-faint'
              }
            />
            {isLive ? 'Live' : 'Not yet deployed'}
          </span>
        </div>

        {isLive ? (
          <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
            <code className="min-w-0 flex-1 truncate font-mono text-meta text-ink" title={CONTRACT_ADDRESS}>
              {CONTRACT_ADDRESS}
            </code>
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex h-9 items-center gap-1.5 rounded-md border border-hairline px-3 text-meta text-ink-muted transition-colors duration-fast ease-out-quart hover:bg-panel hover:text-ink"
              >
                {isCopied ? <Check size={14} className="text-positive" /> : <Copy size={14} />}
                {isCopied ? 'Copied' : 'Copy'}
              </button>
              <a
                href={EXPLORER_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 items-center gap-1.5 rounded-md border border-hairline px-3 text-meta text-ink-muted transition-colors duration-fast ease-out-quart hover:bg-panel hover:text-ink"
              >
                Explorer
                <ArrowUpRight size={14} />
              </a>
              <a
                href={BUY_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 items-center gap-1.5 rounded-md bg-brand px-4 text-meta font-semibold text-ink-inverse transition-colors duration-fast ease-out-quart hover:bg-brand-hover"
              >
                BUY
                <ArrowUpRight size={14} />
              </a>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-meta text-ink-muted">
              The address appears here the moment $PING deploys on {LAUNCHPAD_NAME}, on {CHAIN_NAME}.
            </p>
            <a
              href={BUY_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-md bg-brand px-4 text-meta font-semibold text-ink-inverse transition-colors duration-fast ease-out-quart hover:bg-brand-hover"
            >
              BUY
              <ArrowUpRight size={14} />
            </a>
          </div>
        )}
      </div>

      {/* Announced politely rather than as a floating toast. */}
      <span aria-live="polite" className="sr-only">
        {isCopied ? 'Contract address copied to clipboard' : ''}
      </span>
    </motion.div>
  );
};

export default ContractAddress;
