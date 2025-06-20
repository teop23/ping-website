// Community Pings Data
export const communityPings = [
  {
    creator: 'thatHVACtech',
    imageUrl: 'https://pbs.twimg.com/media/GtxdNeSXcAAACYt?format=jpg&name=small',
    createdAt: '2024-06-19'
  },
  {
    creator: 'itsvibekilla',
    imageUrl: 'https://pbs.twimg.com/media/GtxGPZZXcAA1jdy?format=jpg&name=small',
    createdAt: '2024-01-14'
  },
  {
    creator: '0x34kik',
    imageUrl: 'https://pbs.twimg.com/media/GtxEEraXUAE79G8?format=jpg&name=small',
    createdAt: '2024-01-13'
  },
  {
    creator: '',
    imageUrl: '',
    createdAt: '2024-01-13'
  },
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