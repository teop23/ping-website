// Contract addresses and other constants
export const CONTRACT_ADDRESS = "EiFYrfJHuiWM6uHADtmzSKMAEzrANB9tLaLc4GhBpump"; // Example Solana address

// Buy link for the token
export const BUY_LINK = "https://pump.fun/coin/EiFYrfJHuiWM6uHADtmzSKMAEzrANB9tLaLc4GhBpump";

// Social media links
export const SOCIAL_LINKS = {
  TWITTER: "https://x.com/i/communities/1933201526584963118",
  TELEGRAM: "https://t.me/pingtoken"
};

// Countdown target timestamp (Unix timestamp in milliseconds)
// Example: January 1, 2025, 00:00:00 UTC - edit this to your desired date
export const COUNTDOWN_TARGET = 1750280400 * 1000;

// Show/hide countdown component
export const SHOW_COUNTDOWN = false;

// Randomizer settings
export const EMPTY_TRAIT_CHANCE = 0.3; // 30% chance for no trait in a category

// Other constants can be added here
export const NETWORK = "mainnet";
export const TOKEN_SYMBOL = "PING";
export const TOKEN_NAME = "PING Token";

// Roadmap configuration
export const ROADMAP_STEPS = [
  {
    id: "phase-1",
    title: "Phase 1: Foundation",
    description: "Launch PING token, establish community, and deploy character builder with basic traits.",
    status: "completed" as const
  },
  {
    id: "phase-2", 
    title: "Phase 2: Community Growth",
    description: "Expand trait library, implement trait marketplace, and grow social media presence.",
    status: "in-progress" as const
  },
  {
    id: "phase-3",
    title: "Phase 3: Advanced Features", 
    description: "Add NFT minting, character animations, and community-driven trait creation tools.",
    status: "upcoming" as const
  },
  {
    id: "phase-4",
    title: "Phase 4: Ecosystem Expansion",
    description: "Partner integrations, mobile app, and gamification features for the PING universe.",
    status: "upcoming" as const
  },
  {
    id: "phase-5",
    title: "Phase 5: Metaverse Ready",
    description: "3D character models, virtual world integration, and cross-platform compatibility.",
    status: "upcoming" as const
  }
];

export type RoadmapStatus = "completed" | "in-progress" | "upcoming";