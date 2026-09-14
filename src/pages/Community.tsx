import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { communityPings, pingMemes, sortItems } from '../utils/communityData';
import SharedGallery from '../components/SharedGallery';

const Tile: React.FC<{ src: string; alt: string; fit: 'cover' | 'contain'; children: React.ReactNode }> = ({
  src,
  alt,
  fit,
  children,
}) => (
  <figure className="overflow-hidden rounded-lg border border-hairline bg-raised">
    <div className="aspect-square border-b border-hairline bg-panel">
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={`size-full ${fit === 'cover' ? 'object-cover' : 'object-contain'}`}
      />
    </div>
    <figcaption className="truncate px-4 py-3 text-meta text-ink">{children}</figcaption>
  </figure>
);

const GRID = 'grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4';

const Community: React.FC = () => (
  <main className="container max-w-6xl py-12">
    <h1 className="type-display text-h2 font-bold text-ink sm:text-h1">Community</h1>
    <p className="type-prose mt-3 max-w-2xl text-lead text-ink-muted">
      PINGs people built and shared, plus the memes.
    </p>

    <Tabs defaultValue="shared" className="mt-10">
      <TabsList className="mb-8">
        <TabsTrigger value="shared">Shared</TabsTrigger>
        <TabsTrigger value="pings">Fan art</TabsTrigger>
        <TabsTrigger value="memes">Memes</TabsTrigger>
      </TabsList>

      <TabsContent value="shared">
        <SharedGallery />
      </TabsContent>

      <TabsContent value="pings">
        <ul className={GRID}>
          {sortItems(communityPings, 'newest').map((ping) => (
            <li key={ping.imageUrl}>
              <Tile src={ping.imageUrl} alt={`PING by @${ping.creator}`} fit="cover">
                <a
                  href={`https://x.com/${ping.creator}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline-offset-2 hover:underline"
                >
                  @{ping.creator}
                </a>
              </Tile>
            </li>
          ))}
        </ul>
      </TabsContent>

      <TabsContent value="memes">
        <ul className={GRID}>
          {sortItems(pingMemes, 'newest').map((meme) => (
            <li key={meme.imageUrl}>
              <Tile src={meme.imageUrl} alt={meme.title} fit="contain">
                {meme.title}
              </Tile>
            </li>
          ))}
        </ul>
      </TabsContent>
    </Tabs>
  </main>
);

export default Community;
