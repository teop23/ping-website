import { Check, Copy, Download } from 'lucide-react';
import React, { useState } from 'react';
import {
  CHAIN_ID,
  CHAIN_NAME,
  CHART_LINK,
  CONTRACT_ADDRESS,
  EXPLORER_LINK,
  LAUNCHPAD_NAME,
  LAUNCHPAD_URL,
  SITE_URL,
  SOCIAL_LINKS,
  TOKEN_LIVE,
  TOKEN_NAME,
  TOKEN_SUPPLY,
  TOKEN_SYMBOL,
} from '../utils/constants';
import { useChartListed } from '../utils/chartListing';

/**
 * Everything a listing form asks for, in one place: Dexscreener, a Telegram
 * buy bot, a Pons profile. Filling those forms from scattered sources is how
 * a wrong link or a Solana-era logo ends up on a listing.
 *
 * Facts come from launch.config.mjs, so this page flips to the real contract
 * the moment the rest of the site does.
 */

const DESCRIPTION =
  'PING is the notification. A penguin, a character generator with an open image API, and a memecoin on Robinhood Chain.';

type Asset = { title: string; spec: string; src: string; file: string; checker?: boolean };

const LISTING_IMAGES: Asset[] = [
  { title: 'Header', spec: '1500 x 500 PNG, 3:1', src: '/api/og/header.png', file: 'ping-header-1500x500.png' },
  { title: 'Share card', spec: '1200 x 630 PNG', src: '/api/og/banner.png', file: 'ping-card-1200x630.png' },
];

const LOGOS: Asset[] = [
  { title: 'Token icon', spec: '1024 x 1024 PNG, lime', src: '/token-image.png', file: 'ping-icon-1024.png' },
  { title: 'Icon, small', spec: '512 x 512 PNG, lime', src: '/favicon-512.png', file: 'ping-icon-512.png' },
  { title: 'Character', spec: '1024 x 1024 PNG, transparent', src: '/ping.png', file: 'ping-transparent-1024.png', checker: true },
];

const COLORS = [
  { name: 'Lime', hex: '#CCFF00', swatch: 'bg-brand' },
  { name: 'Ink', hex: '#111C16', swatch: 'bg-ink' },
  { name: 'Cream', hex: '#F3F1EA', swatch: 'bg-ground' },
];

const useCopy = () => {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied((current) => (current === key ? null : current)), 2000);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };
  return { copied, copy };
};

const CopyButton: React.FC<{ id: string; text: string; label: string; state: ReturnType<typeof useCopy> }> = ({
  id,
  text,
  label,
  state,
}) => {
  const done = state.copied === id;
  return (
    <button
      type="button"
      onClick={() => state.copy(id, text)}
      className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-hairline bg-panel px-2.5 py-1 text-micro text-ink-muted transition-colors duration-fast ease-out-quart hover:text-ink"
      aria-label={done ? `${label} copied` : `Copy ${label}`}
    >
      {done ? <Check className="size-3.5" aria-hidden="true" /> : <Copy className="size-3.5" aria-hidden="true" />}
      {done ? 'Copied' : 'Copy'}
    </button>
  );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section aria-labelledby={`brand-${title}`} className="border-t border-hairline py-10">
    <h2 id={`brand-${title}`} className="type-display text-h3 font-bold text-ink">
      {title}
    </h2>
    <div className="mt-6">{children}</div>
  </section>
);

const AssetCard: React.FC<{ asset: Asset; wide?: boolean }> = ({ asset, wide }) => (
  <figure className="overflow-hidden rounded-lg border border-hairline bg-raised">
    <div
      className={`flex items-center justify-center border-b border-hairline ${wide ? '' : 'aspect-square p-6'} ${
        asset.checker ? 'bg-[conic-gradient(#e5e2d8_25%,#fff_0_50%,#e5e2d8_0_75%,#fff_0)] bg-[length:20px_20px]' : 'bg-panel'
      }`}
    >
      <img src={asset.src} alt={`PING ${asset.title.toLowerCase()}`} loading="lazy" className="max-h-full w-full object-contain" />
    </div>
    <figcaption className="flex items-center justify-between gap-3 px-4 py-3">
      <span>
        <span className="block text-meta font-medium text-ink">{asset.title}</span>
        <span className="block text-micro text-ink-faint">{asset.spec}</span>
      </span>
      <a
        href={asset.src}
        download={asset.file}
        className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-hairline bg-panel px-2.5 py-1 text-micro text-ink-muted transition-colors duration-fast ease-out-quart hover:text-ink"
      >
        <Download className="size-3.5" aria-hidden="true" />
        Download
      </a>
    </figcaption>
  </figure>
);

const Brand: React.FC = () => {
  const copyState = useCopy();
  const isLive = TOKEN_LIVE && CONTRACT_ADDRESS.length > 0;
  const chartListed = useChartListed();

  const facts: { label: string; value: string; copy?: boolean; href?: string }[] = [
    { label: 'Name', value: TOKEN_NAME },
    { label: 'Ticker', value: `$${TOKEN_SYMBOL}`, copy: true },
    { label: 'Chain', value: `${CHAIN_NAME} (chain ID ${CHAIN_ID})` },
    { label: 'Launchpad', value: LAUNCHPAD_NAME, href: LAUNCHPAD_URL },
    { label: 'Supply', value: `${TOKEN_SUPPLY.toLocaleString('en-US')} fixed` },
    isLive
      ? { label: 'Contract', value: CONTRACT_ADDRESS, copy: true, href: EXPLORER_LINK }
      : { label: 'Contract', value: 'Not yet deployed' },
  ];

  const links: { label: string; href: string }[] = [
    { label: 'Website', href: SITE_URL },
    { label: 'X', href: SOCIAL_LINKS.TWITTER },
    { label: 'Telegram', href: SOCIAL_LINKS.TELEGRAM },
    ...(chartListed ? [{ label: 'Chart', href: CHART_LINK }] : []),
  ];

  return (
    <main className="container max-w-5xl py-12">
      <h1 className="type-display text-h2 font-bold text-ink sm:text-h1">Brand kit</h1>
      <p className="type-prose mt-3 max-w-2xl text-lead text-ink-muted">
        Logos, token facts and listing images. Free to use for anything about PING.
      </p>

      <Section title="Token">
        <dl className="divide-y divide-hairline rounded-lg border border-hairline bg-raised">
          {facts.map((fact) => (
            <div key={fact.label} className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:gap-6">
              <dt className="w-28 shrink-0 text-micro font-medium uppercase tracking-wider text-ink-faint">
                {fact.label}
              </dt>
              <dd className="flex min-w-0 flex-1 items-center justify-between gap-3 text-meta text-ink">
                {fact.href ? (
                  <a href={fact.href} target="_blank" rel="noopener noreferrer" className="break-all underline-offset-4 hover:underline">
                    {fact.value}
                  </a>
                ) : (
                  <span className="break-all" data-numeric={fact.label === 'Supply' || undefined}>
                    {fact.value}
                  </span>
                )}
                {fact.copy && <CopyButton id={fact.label} text={fact.value} label={fact.label} state={copyState} />}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-6 rounded-lg border border-hairline bg-raised px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <span className="text-micro font-medium uppercase tracking-wider text-ink-faint">Description</span>
            <CopyButton id="description" text={DESCRIPTION} label="description" state={copyState} />
          </div>
          <p className="mt-2 text-meta text-ink">{DESCRIPTION}</p>
        </div>
      </Section>

      <Section title="Links">
        <ul className="divide-y divide-hairline rounded-lg border border-hairline bg-raised">
          {links.map((link) => (
            <li key={link.label} className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:gap-6">
              <span className="w-28 shrink-0 text-micro font-medium uppercase tracking-wider text-ink-faint">
                {link.label}
              </span>
              <span className="flex min-w-0 flex-1 items-center justify-between gap-3 text-meta text-ink">
                <a href={link.href} target="_blank" rel="noopener noreferrer" className="break-all underline-offset-4 hover:underline">
                  {link.href}
                </a>
                <CopyButton id={link.label} text={link.href} label={`${link.label} link`} state={copyState} />
              </span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Listing images">
        <div className="grid items-start gap-6 md:grid-cols-2">
          {LISTING_IMAGES.map((asset) => (
            <AssetCard key={asset.src} asset={asset} wide />
          ))}
        </div>
      </Section>

      <Section title="Logos">
        <div className="grid gap-6 sm:grid-cols-3">
          {LOGOS.map((asset) => (
            <AssetCard key={asset.src} asset={asset} />
          ))}
        </div>
      </Section>

      <Section title="Colors">
        <ul className="grid gap-4 sm:grid-cols-3">
          {COLORS.map((color) => (
            <li key={color.hex} className="flex items-center gap-3 rounded-lg border border-hairline bg-raised p-3">
              <span aria-hidden="true" className={`size-10 shrink-0 rounded-md border border-hairline ${color.swatch}`} />
              <span className="flex-1">
                <span className="block text-meta font-medium text-ink">{color.name}</span>
                <span className="block text-micro text-ink-faint" data-numeric>
                  {color.hex}
                </span>
              </span>
              <CopyButton id={color.hex} text={color.hex} label={`${color.name} hex`} state={copyState} />
            </li>
          ))}
        </ul>
      </Section>
    </main>
  );
};

export default Brand;
