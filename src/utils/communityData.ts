// Community Pings Data
export const communityPings = [
  {
    creator: 'thatHVACtech',
    imageUrl: 'https://pbs.twimg.com/media/GtxdNeSXcAAACYt?format=jpg&name=small',
    createdAt: '2025-06-19'
  },
  {
    creator: 'itsvibekilla',
    imageUrl: 'https://pbs.twimg.com/media/GtxGPZZXcAA1jdy?format=jpg&name=small',
    createdAt: '2025-06-19'
  },
  {
    creator: '0x34kik',
    imageUrl: 'https://pbs.twimg.com/media/GtxEEraXUAE79G8?format=jpg&name=small',
    createdAt: '2025-06-19'
  },
  {
    creator: 'backroomsonbase',
    imageUrl: 'https://pbs.twimg.com/media/GtxBnw9WUAAWrw0?format=jpg&name=small',
    createdAt: '2025-06-19'
  },
  {
    creator: 'SquionINK',
    imageUrl: 'https://pbs.twimg.com/media/GtxB7U-WEAA7RhM?format=jpg&name=small',
    createdAt: '2025-06-19'
  },
  {
    creator: 'latiniron',
    imageUrl: 'https://pbs.twimg.com/media/GtzNjo3W4AAy_Nd?format=jpg&name=small',
    createdAt: '2025-06-19'
  },
  {
    creator: 'FIFACOINSOLANA',
    imageUrl: 'https://pbs.twimg.com/media/GtxBkFWXEAEfwxF?format=png&name=small',
    createdAt: '2025-06-19'
  },
  {
    creator: 'SaltyDan2023',
    imageUrl: 'https://pbs.twimg.com/media/GtxCF6pW0AA6bAa?format=jpg&name=small',
    createdAt: '2025-06-19'
  },
  {
    creator: 'JasonBourn56653',
    imageUrl: 'https://pbs.twimg.com/media/GtxBy7HXEAAfVUl?format=jpg&name=small',
    createdAt: '2025-06-19'
  },
  {
    creator: 'gromadaz',
    imageUrl: 'https://pbs.twimg.com/media/GtxSqQ2XAAAvcgW?format=jpg&name=small',
    createdAt: '2025-06-19'
  },
  {
    creator: 'Jackmeta_x',
    imageUrl: 'https://pbs.twimg.com/media/GtxL4F3XEAELbY8?format=jpg&name=small',
    createdAt: '2025-06-19'
  },
  {
    creator: 'zecocooper',
    imageUrl: 'https://pbs.twimg.com/media/GtxVWiDWAAE0qfd?format=jpg&name=small',
    createdAt: '2025-06-19'
  },

];

// Ping Memes Data
export const pingMemes = [
  {
    title: 'Ping Driving With the Gang',
    imageUrl: '/memes/ping-driving-with-gang.jpg',
    type: 'meme' as const,
    createdAt: '2025-06-19'
  },
  {
    title: 'Ping Fighting In the War',
    imageUrl: '/memes/ping-fighting-in-the-war.jpg',
    type: 'meme' as const,
    createdAt: '2025-06-19'
  },
  {
    title: 'Ping Freezing the Chart',
    imageUrl: '/memes/ping-froze-the-chart.jpg',
    type: 'meme' as const,
    createdAt: '2025-06-19'
  },
  {
    title: 'CyberPing 2077',
    imageUrl: '/memes/CyberPing-2077.jpeg',
    type: 'meme' as const,
    createdAt: '2025-06-19'
  },
  {
    title: 'Ping Ice Magazine',
    imageUrl: '/memes/ping-iice-magazine.jpg',
    type: 'meme' as const,
    createdAt: '2025-06-19'
  },
  {
    title: 'Ping Driving',
    imageUrl: '/memes/ping-driving.jpg',
    type: 'meme' as const,
    createdAt: '2025-06-19'
  },
  {
    title: 'Ping Driving APC',
    imageUrl: '/memes/ping-driving-apc.jpg',
    type: 'meme' as const,
    createdAt: '2025-06-19'
  },
  {
    title: 'Ping Boxing',
    imageUrl: '/memes/ping-boxing.jpg',
    type: 'meme' as const,
    createdAt: '2025-06-19'
  },
  {
    title: 'Ping DJ',
    imageUrl: '/memes/ping-dj.jpeg',
    type: 'meme' as const,
    createdAt: '2025-06-19'
  },
  {
    title: 'Ping Band',
    imageUrl: '/memes/ping-band.jpg',
    type: 'meme' as const,
    createdAt: '2025-06-19'
  },
  {
    title: 'Ping DJ Flyer',
    imageUrl: '/memes/ping-club-flyer.jpg',
    type: 'meme' as const,
    createdAt: '2025-06-19'
  },
  {
    title: 'Ping Taking a Bath',
    imageUrl: '/memes/ping-taking-bath.jpg',
    type: 'meme' as const,
    createdAt: '2025-06-19'
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