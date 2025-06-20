import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Heart, Filter, Grid, List } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  communityPings, 
  pingMemes, 
  sortItems, 
  type CommunityPing, 
  type PingMeme 
} from '../utils/communityData';

type ViewMode = 'grid' | 'list';
type SortBy = 'newest' | 'oldest';

const Community: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortBy>('newest');

  // Get sorted data
  const sortedCommunityPings = sortItems(communityPings, sortBy);
  const sortedPingMemes = sortItems(pingMemes, sortBy);

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
          {/* <div className="flex items-center gap-4">
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
          </div> */}

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
                    key={`ping-${index}-${ping.creator}`}
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
                    key={`meme-${index}-${meme.title}`}
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
  ping: CommunityPing;
}

const PingCard: React.FC<PingCardProps> = ({ ping }) => {
  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group bg-white border-0 shadow-md">
      <div className="flex flex-row justify-center items-center relative aspect-square">
        <img
          src={ping.imageUrl}
          alt={`PING by ${ping.creator}`}
          className="size-full object-cover group-hover:scale-[1.02] transition-transform duration-500 ease-out"
        />
        {/* Subtle overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <CardContent className="p-4 bg-gradient-to-br from-white to-gray-50/50 border-t border-gray-100/50 relative">
        {/* Subtle top border accent */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        
        <p className="text-xs text-muted-foreground mb-2">
          by{' '}
          {ping.creator ? (
            <a
              href={`https://x.com/${ping.creator}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 transition-colors duration-200 font-medium hover:underline decoration-primary/30 underline-offset-2"
            >
              @{ping.creator}
            </a>
          ) : (
            'Anonymous'
          )}
        </p>
      </CardContent>
    </Card>
  );
};

// Ping List Item Component
const PingListItem: React.FC<PingCardProps> = ({ ping }) => {
  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group bg-white border-0 shadow-md hover:shadow-primary/5">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <img
            src={ping.imageUrl}
            alt={`PING by ${ping.creator}`}
            className="w-16 h-16 object-cover rounded-lg flex-shrink-0 group-hover:scale-105 transition-transform duration-300 shadow-sm"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground mb-2">
              by{' '}
              {ping.creator ? (
                <a
                  href={`https://x.com/${ping.creator}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 transition-colors duration-200 font-medium hover:underline decoration-primary/30 underline-offset-2"
                >
                  @{ping.creator}
                </a>
              ) : (
                'Anonymous'
              )}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Meme Card Component
interface MemeCardProps {
  meme: PingMeme;
}

const MemeCard: React.FC<MemeCardProps> = ({ meme }) => {
  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group bg-white border-0 shadow-md">
      <div className="relative aspect-square">
        <img
          src={meme.imageUrl}
          alt={meme.title}
          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500 ease-out"
        />
        {/* Subtle overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <CardContent className="p-4 bg-gradient-to-br from-white to-gray-50/50 border-t border-gray-100/50 relative">
        {/* Subtle top border accent */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        
        <h3 className="font-semibold text-sm mb-1 truncate">{meme.title}</h3>
        <p className="text-xs text-muted-foreground">
          {new Date(meme.createdAt).toLocaleDateString()}
        </p>
      </CardContent>
    </Card>
  );
};

// Meme List Item Component
const MemeListItem: React.FC<MemeCardProps> = ({ meme }) => {
  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group bg-white border-0 shadow-md hover:shadow-primary/5">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <img
            src={meme.imageUrl}
            alt={meme.title}
            className="w-16 h-16 object-cover rounded-lg flex-shrink-0 group-hover:scale-105 transition-transform duration-300 shadow-sm"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm mb-1 truncate">{meme.title}</h3>
            <p className="text-xs text-muted-foreground">
              {new Date(meme.createdAt).toLocaleDateString()}
            </p>
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