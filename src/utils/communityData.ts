// Community Pings Data
export const communityPings = [
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

// Ping Memes Data
export const pingMemes = [
  {
    id: '1',
    title: 'When PING hits $1',
    creator: 'MemeKing',
    imageUrl: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=400',
    likes: 156,
    shares: 89,
    type: 'meme' as const,
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    title: 'PING vs Other Tokens',
    creator: 'CryptoMemer',
    imageUrl: 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=400',
    likes: 203,
    shares: 124,
    type: 'meme' as const,
    createdAt: '2024-01-14'
  },
  {
    id: '3',
    title: 'Me buying more PING',
    creator: 'DiamondHands',
    imageUrl: 'https://images.pexels.com/photos/1181533/pexels-photo-1181533.jpeg?auto=compress&cs=tinysrgb&w=400',
    likes: 178,
    shares: 95,
    type: 'meme' as const,
    createdAt: '2024-01-13'
  },
  {
    id: '4',
    title: 'PING Community be like',
    creator: 'PingLover',
    imageUrl: 'https://images.pexels.com/photos/2582928/pexels-photo-2582928.jpeg?auto=compress&cs=tinysrgb&w=400',
    likes: 134,
    shares: 67,
    type: 'meme' as const,
    createdAt: '2024-01-12'
  },
  {
    id: '5',
    title: 'HODL PING Forever',
    creator: 'CryptoHodler',
    imageUrl: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400',
    likes: 245,
    shares: 156,
    type: 'meme' as const,
    createdAt: '2024-01-11'
  },
  {
    id: '6',
    title: 'PING to the Moon',
    creator: 'MoonPinger',
    imageUrl: 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=400',
    likes: 189,
    shares: 112,
    type: 'meme' as const,
    createdAt: '2024-01-10'
  }
];

// Type definitions
export type CommunityPing = typeof communityPings[0];
export type PingMeme = typeof pingMemes[0];

// Utility function for sorting items by date
export const sortItems = <T extends { createdAt: string }>(
  items: T[], 
  sortBy: 'newest' | 'oldest'
): T[] => {
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