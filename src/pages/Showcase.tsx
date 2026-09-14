import { Check, Link as LinkIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '../components/ui/button';

/**
 * Where a share link lands a person: buildaping.com/p/<id>.
 *
 * The card they saw on X, full width, with what it is wearing and a way into
 * the builder. Bots never reach this page; functions/p/[id].ts gives them the
 * Open Graph markup instead.
 */

interface Card {
  id: string;
  title: string;
  traits: string;
  image: string;
}

type State = { status: 'loading' } | { status: 'ready'; card: Card } | { status: 'missing' };

const SLOT_LABELS: Record<string, string> = {
  aura: 'Aura',
  body: 'Body',
  face: 'Face',
  mouth: 'Mouth',
  head: 'Head',
  right_hand: 'Right hand',
  left_hand: 'Left hand',
  accessory: 'Accessory',
};

const traitName = (value: string) => value.replace(/-/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());

const Showcase: React.FC = () => {
  const { id = '' } = useParams();
  const [state, setState] = useState<State>({ status: 'loading' });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let live = true;
    setState({ status: 'loading' });
    fetch(`/api/card/${encodeURIComponent(id)}`)
      .then((response) => (response.ok ? (response.json() as Promise<Card>) : null))
      .then((card) => live && setState(card ? { status: 'ready', card } : { status: 'missing' }))
      .catch(() => live && setState({ status: 'missing' }));
    return () => {
      live = false;
    };
  }, [id]);

  useEffect(() => {
    if (state.status === 'ready') document.title = `${state.card.title} | PING`;
  }, [state]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  if (state.status === 'missing') {
    return (
      <main className="container max-w-3xl py-20">
        <h1 className="type-display text-h2 font-bold text-ink">This PING isn't here.</h1>
        <p className="type-prose mt-3 text-lead text-ink-muted">The link may be mistyped. Build one instead.</p>
        <Button asChild className="mt-8">
          <Link to="/#builder">Open the builder</Link>
        </Button>
      </main>
    );
  }

  const card = state.status === 'ready' ? state.card : null;
  const slots = card ? [...new URLSearchParams(card.traits).entries()] : [];

  return (
    <main className="container max-w-6xl py-6 sm:py-10">
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] lg:gap-10">
        <figure className="overflow-hidden rounded-lg border border-hairline bg-raised">
          <div className="aspect-[800/420] bg-panel">
            {card && (
              <img src={card.image} alt={card.title} width={800} height={420} className="size-full object-cover" />
            )}
          </div>
        </figure>

        <div>
          <p className="text-meta text-ink-muted">Someone sent you a PING.</p>
          <h1 className="type-display mt-1 text-h3 font-bold text-ink [text-wrap:balance]" aria-busy={!card}>
            {card ? card.title : ' '}
          </h1>

          <div className="mt-5 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to={card ? `/?${card.traits}#builder` : '/#builder'}>Remix this PING</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/#builder">Make your own</Link>
            </Button>
          </div>
          <Button variant="ghost" size="sm" className="mt-2 -ml-3 text-ink-muted" onClick={copyLink} disabled={!card}>
            {copied ? <Check className="size-4" aria-hidden="true" /> : <LinkIcon className="size-4" aria-hidden="true" />}
            {copied ? 'Copied' : 'Copy link'}
          </Button>

          {slots.length > 0 && (
            <dl aria-label="Wearing" className="mt-6 divide-y divide-hairline rounded-lg border border-hairline bg-raised">
              {slots.map(([slot, trait]) => (
                <div key={slot} className="flex gap-4 px-4 py-2.5">
                  <dt className="w-24 shrink-0 text-meta text-ink-muted">{SLOT_LABELS[slot] ?? slot}</dt>
                  <dd className="text-meta font-medium text-ink">{traitName(trait)}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>
    </main>
  );
};

export default Showcase;
