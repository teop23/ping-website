// Community Pings Data
export const communityPings = [
  {
    creator: 'itsvibekilla',
    imageUrl: '/community/itsvibekilla.jpg',
    createdAt: '2025-06-19'
  },
  {
    creator: '0x34kik',
    imageUrl: '/community/0x34kik.jpg',
    createdAt: '2025-06-19'
  },
  {
    creator: 'backroomsonbase',
    imageUrl: '/community/backroomsonbase.jpg',
    createdAt: '2025-06-19'
  },
  {
    creator: 'SquionINK',
    imageUrl: '/community/SquionINK.jpg',
    createdAt: '2025-06-19'
  },
  {
    creator: 'latiniron',
    imageUrl: '/community/latiniron.jpg',
    createdAt: '2025-06-19'
  },
  {
    creator: 'FIFACOINSOLANA',
    imageUrl: '/community/FIFACOINSOLANA.jpg',
    createdAt: '2025-06-19'
  },
  {
    creator: 'SaltyDan2023',
    imageUrl: '/community/SaltyDan2023.jpg',
    createdAt: '2025-06-19'
  },
  {
    creator: 'JasonBourn56653',
    imageUrl: '/community/JasonBourn56653.jpg',
    createdAt: '2025-06-19'
  },
  {
    creator: 'gromadaz',
    imageUrl: '/community/gromadaz.jpg',
    createdAt: '2025-06-19'
  },
  {
    creator: 'zecocooper',
    imageUrl: '/community/zecocooper.jpg',
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