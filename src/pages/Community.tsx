import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Heart, Share2, Download, ExternalLink, Filter, Grid, List } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

// Mock data for community pings
const communityPings = [
  {
    id: '1',
    title: 'Cool Cyber Ping',
    creator: 'CryptoPing123',
    imageUrl: 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=400',
    likes: 42,
    shares: 15,
    traits: ['cyber-helmet', 'neon-aura', 'laser-sword'],
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    title: 'Wizard Ping Master',
    creator: 'MagicPinger',
    imageUrl: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=400',
    likes: 38,
    shares: 12,
    traits: ['wizard-hat', 'magic-wand', 'mystical-aura'],
    createdAt: '2024-01-14'
  },
  {
    id: '3',
    title: 'Pirate Captain Ping',
    creator: 'SeaPinger',
    imageUrl: 'https://images.pexels.com/photos/1181533/pexels-photo-1181533.jpeg?auto=compress&cs=tinysrgb&w=400',
    likes: 56,
    shares: 23,
    traits: ['pirate-hat', 'eye-patch', 'sword'],
    createdAt: '2024-01-13'
  },
  {
    id: '4',
    title: 'Space Explorer Ping',
    creator: 'CosmicPing',
    imageUrl: 'https://images.pexels.com/photos/2582928/pexels-photo-2582928.jpeg?auto=compress&cs=tinysrgb&w=400',
    likes: 71,
    shares: 31,
    traits: ['space-helmet', 'jetpack', 'star-aura'],
    createdAt: '2024-01-12'
  },
  {
    id: '5',
    title: 'Ninja Stealth Ping',
    creator: 'ShadowPinger',
    imageUrl: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400',
    likes: 49,
    shares: 18,
    traits: ['ninja-mask', 'katana', 'shadow-aura'],
    createdAt: '2024-01-11'
  },
  {
    id: '6',
    title: 'Royal King Ping',
    creator: 'RoyalPinger',
    imageUrl: 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=400',
    likes: 63,
    shares: 27,
    traits: ['crown', 'royal-cape', 'golden-aura'],
    createdAt: '2024-01-10'
  }
];

// Mock data for ping memes
const pingMemes = [
  {
    id: '1',
    title: 'When PING hits $1',
    creator: 'MemeKing',
    imageUrl: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=400',
    likes: 156,
    shares: 89,
    type: 'meme',
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    title: 'PING vs Other Tokens',
    creator: 'CryptoMemer',
    imageUrl: 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=400',
    likes: 203,
    shares: 124,
    type: 'meme',
    createdAt: '2024-01-14'
  },
  {
    id: '3',
    title: 'Me buying more PING',
    creator: 'DiamondHands',
    imageUrl: 'https://images.pexels.com/photos/1181533/pexels-photo-1181533.jpeg?auto=compress&cs=tinysrgb&w=400',
    likes: 178,
    shares: 95,
    type: 'meme',
    createdAt: '2024-01-13'
  },
  {
    id: '4',
    title: 'PING Community be like',
    creator: 'PingLover',
    imageUrl: 'https://images.pexels.com/photos/2582928/pexels-photo-2582928.jpeg?auto=compress&cs=tinysrgb&w=400',
    likes: 134,
    shares: 67,
    type: 'meme',
    createdAt: '2024-01-12'
  },
  {
    id: '5',
    title: 'HODL PING Forever',
    creator: 'CryptoHodler',
    imageUrl: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400',
    likes: 245,
    shares: 156,
    type: 'meme',
    createdAt: '2024-01-11'
  },
  {
    id: '6',
    title: 'PING to the Moon',
    creator: 'MoonPinger',
    imageUrl: 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=400',
    likes: 189,
    shares: 112,
    type: 'meme',
    createdAt: '2024-01-10'
  }
];

type ViewMode = 'grid' | 'list';
type SortBy = 'newest' | 'oldest';

const Community: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortBy>('newest');

  // Sort function
  const sortItems = <T extends { createdAt: string }>(items: T[]): T[] => {
    return [...items].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      
      if (sortBy === 'newest') {
        return dateB - dateA; // Newest first (descending)
      } else {
        return dateA - dateB; // Oldest first (ascending)
      }
    });
  };

  // Get sorted data
  const sortedCommunityPings = sortItems(communityPings);
  const sortedPingMemes = sortItems(pingMemes);

  return (
    <div className="flex-grow bg-gradient-to-br from-gray-50 to-gray-100 w-full min-h-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
              Community
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Discover amazing PING characters created by our community and enjoy the best PING memes
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-muted-foreground" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortBy)}
                className="px-3 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid size={16} />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List size={16} />
            </Button>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <Tabs defaultValue="pings" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
              <TabsTrigger value="pings" className="flex items-center gap-2">
                <Users size={16} />
                Community Pings
              </TabsTrigger>
              <TabsTrigger value="memes" className="flex items-center gap-2">
                <Heart size={16} />
                Ping Memes
              </TabsTrigger>
            </TabsList>

            {/* Community Pings Tab */}
            <TabsContent value="pings">
              <div className={cn(
                viewMode === 'grid' 
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "space-y-4"
              )}>
                {sortedCommunityPings.map((ping, index) => (
                  <motion.div
                    key={ping.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                  >
                    {viewMode === 'grid' ? (
                      <PingCard
                        ping={ping}
                      />
                    ) : (
                      <PingListItem
                        ping={ping}
                      />
                    )}
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Ping Memes Tab */}
            <TabsContent value="memes">
              <div className={cn(
                viewMode === 'grid' 
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "space-y-4"
              )}>
                {sortedPingMemes.map((meme, index) => (
                  <motion.div
                    key={meme.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                  >
                    {viewMode === 'grid' ? (
                      <MemeCard
                        meme={meme}
                      />
                    ) : (
                      <MemeListItem
                        meme={meme}
                      />
                    )}
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

// Ping Card Component
interface PingCardProps {
  ping: typeof communityPings[0];
}

const PingCard: React.FC<PingCardProps> = ({ ping }) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
      <div className="relative aspect-square">
        <img
          src={ping.imageUrl}
          alt={ping.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-sm mb-1 truncate">{ping.title}</h3>
        <p className="text-xs text-muted-foreground mb-2">by {ping.creator}</p>
        <div className="flex flex-wrap gap-1">
          {ping.traits.slice(0, 2).map((trait) => (
            <span
              key={trait}
              className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
            >
              {trait}
            </span>
          ))}
          {ping.traits.length > 2 && (
            <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
              +{ping.traits.length - 2}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Ping List Item Component
const PingListItem: React.FC<PingCardProps> = ({ ping }) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <img
            src={ping.imageUrl}
            alt={ping.title}
            className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm mb-1 truncate">{ping.title}</h3>
            <p className="text-xs text-muted-foreground mb-2">by {ping.creator}</p>
            <div className="flex flex-wrap gap-1">
              {ping.traits.slice(0, 3).map((trait) => (
                <span
                  key={trait}
                  className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                >
                  {trait}
                </span>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Meme Card Component
interface MemeCardProps {
  meme: typeof pingMemes[0];
}

const MemeCard: React.FC<MemeCardProps> = ({ meme }) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
      <div className="relative aspect-square">
        <img
          src={meme.imageUrl}
          alt={meme.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-sm mb-1 truncate">{meme.title}</h3>
        <p className="text-xs text-muted-foreground">by {meme.creator}</p>
      </CardContent>
    </Card>
  );
};

// Meme List Item Component
const MemeListItem: React.FC<MemeCardProps> = ({ meme }) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <img
            src={meme.imageUrl}
            alt={meme.title}
            className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm mb-1 truncate">{meme.title}</h3>
            <p className="text-xs text-muted-foreground">by {meme.creator}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper function for conditional classes
function cn(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export default Community;