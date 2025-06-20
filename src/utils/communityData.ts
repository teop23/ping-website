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
    createdAt: '2024-06-19'
  },
  {
    creator: '0x34kik',
    imageUrl: 'https://pbs.twimg.com/media/GtxEEraXUAE79G8?format=jpg&name=small',
    createdAt: '2024-06-19'
  },
  {
    creator: 'backroomsonbase',
    imageUrl: 'https://pbs.twimg.com/media/GtxBnw9WUAAWrw0?format=jpg&name=small',
    createdAt: '2024-06-19'
  },
  {
    creator: 'SquionINK',
    imageUrl: 'https://pbs.twimg.com/media/GtxB7U-WEAA7RhM?format=jpg&name=small',
    createdAt: '2024-06-19'
  },
  {
    creator: 'latiniron',
    imageUrl: 'https://pbs.twimg.com/media/GtzNjo3W4AAy_Nd?format=jpg&name=small',
    createdAt: '2024-06-19'
  },
  {
    creator: 'FIFACOINSOLANA',
    imageUrl: 'https://pbs.twimg.com/media/GtxBkFWXEAEfwxF?format=png&name=small',
    createdAt: '2024-06-19'
  },
  {
    creator: 'SaltyDan2023',
    imageUrl: 'https://pbs.twimg.com/media/GtxCF6pW0AA6bAa?format=jpg&name=small',
    createdAt: '2024-06-19'
  },
  {
    creator: 'JasonBourn56653',
    imageUrl: 'https://pbs.twimg.com/media/GtxBy7HXEAAfVUl?format=jpg&name=small',
    createdAt: '2024-06-19'
  },
  {
    creator: 'gromadaz',
    imageUrl: 'https://pbs.twimg.com/media/GtxSqQ2XAAAvcgW?format=jpg&name=small',
    createdAt: '2024-06-19'
  },
  {
    creator: 'Jackmeta_x',
    imageUrl: 'https://pbs.twimg.com/media/GtxL4F3XEAELbY8?format=jpg&name=small',
    createdAt: '2024-06-19'
  },
  {
    creator: 'zecocooper',
    imageUrl: 'https://pbs.twimg.com/media/GtxVWiDWAAE0qfd?format=jpg&name=small',
    createdAt: '2024-06-19'
  },

];

// Ping Memes Data
export const pingMemes = [
  {
    title: 'When PING hits $1',
    imageUrl: '/memes/ping-hits-1-dollar.jpg',
    type: 'meme' as const,
    createdAt: '2024-01-15'
  },
  {
    title: 'PING vs Other Tokens',
    imageUrl: '/memes/ping-vs-other-tokens.jpg',
    type: 'meme' as const,
    createdAt: '2024-01-14'
  },
  {
    title: 'Me buying more PING',
    imageUrl: '/memes/buying-more-ping.jpg',
    type: 'meme' as const,
    createdAt: '2024-01-13'
  },
  {
    title: 'PING Community be like',
    imageUrl: '/memes/ping-community.jpg',
    type: 'meme' as const,
    createdAt: '2024-01-12'
  },
  {
    title: 'HODL PING Forever',
    imageUrl: '/memes/hodl-ping-forever.jpg',
    type: 'meme' as const,
    createdAt: '2024-01-11'
  },
  {
    title: 'PING to the Moon',
    imageUrl: '/memes/ping-to-the-moon.jpg',
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