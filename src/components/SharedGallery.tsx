import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

export interface GalleryItem {
  id: string;
  title: string;
  image: string;
  url: string;
  at: number;
  /** Set when this PING was sent with a preset message. */
  message?: string;
}

interface GalleryResponse {
  items: GalleryItem[];
  next: number | null;
}

type Status = 'loading' | 'ready' | 'error';

/**
 * Every character someone has shared, newest first, from /api/gallery.
 *
 * Cards link to /p/<id> as a plain anchor, not a router Link: that route is a
 * Pages Function that redirects a person into the builder with the character
 * loaded, so it has to be a real navigation.
 */
const SharedGallery: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [next, setNext] = useState<number | null>(0);
  const [status, setStatus] = useState<Status>('loading');

  const load = useCallback(async (offset: number) => {
    setStatus('loading');
    try {
      const response = await fetch(`/api/gallery?offset=${offset}`);
      if (!response.ok) throw new Error(String(response.status));
      const page = (await response.json()) as GalleryResponse;
      setItems((current) => {
        const seen = new Set(current.map((item) => item.id));
        return [...current, ...page.items.filter((item) => !seen.has(item.id))];
      });
      setNext(page.next);
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    load(0);
  }, [load]);

  if (status === 'ready' && items.length === 0) {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <p className="text-lead text-ink">No shared PINGs yet.</p>
        <p className="mt-2 text-meta text-ink-muted">
          Build one, hit Share, and it shows up here.
        </p>
        <Button asChild className="mt-6">
          <Link to="/">Open the builder</Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" data-testid="shared-gallery">
        {items.map((item) => (
          <li key={item.id}>
            <a href={item.url} className="group block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <Card className="relative overflow-hidden border border-hairline bg-raised shadow-panel transition-shadow duration-300 group-hover:shadow-xl">
                {item.message && (
                  <span className="absolute right-2 top-2 z-10 rounded-pill bg-brand px-2 py-0.5 text-micro font-semibold text-accent-ink">
                    PING
                  </span>
                )}
                <div className={item.message ? 'aspect-square overflow-hidden bg-panel' : 'aspect-[800/420] overflow-hidden bg-panel'}>
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    width={item.message ? 512 : 800}
                    height={item.message ? 512 : 420}
                    className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                  />
                </div>
                <CardContent className="border-t border-hairline p-4">
                  <p className="truncate text-meta font-medium text-ink">{item.message ?? item.title}</p>
                  <p className="mt-1 text-micro text-ink-muted">
                    {new Date(item.at).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            </a>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex flex-col items-center gap-3" aria-live="polite">
        {status === 'loading' && <span className="text-meta text-ink-muted">Loading</span>}
        {status === 'error' && (
          <>
            <span className="text-meta text-ink-muted">Couldn't load the gallery.</span>
            <Button variant="outline" size="sm" onClick={() => load(next ?? items.length)}>
              Try again
            </Button>
          </>
        )}
        {status === 'ready' && next !== null && (
          <Button variant="outline" onClick={() => load(next)}>
            Load more
          </Button>
        )}
      </div>
    </div>
  );
};

export default SharedGallery;
