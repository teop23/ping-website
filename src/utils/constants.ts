// Contract addresses and other constants
export const CONTRACT_ADDRESS = "EiFYrfJHuiWM6uHADtmzSKMAEzrANB9tLaLc4GhBpump"; // Example Solana address

// Buy link for the token
export const BUY_LINK = "https://jup.ag/swap/EiFYrfJHuiWM6uHADtmzSKMAEzrANB9tLaLc4GhBpump-So11111111111111111111111111111111111111112";

// Social media links
export const SOCIAL_LINKS = {
  TWITTER: "https://x.com/i/communities/1933201526584963118",
  TELEGRAM: "https://t.me/pingtoken",
  DEXSCREENER: "https://dexscreener.com/solana/placeholder" // You can change this later
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
    description: "Expand trait library, establish daily community spaces. Create tools to easily share user-created content that will make $PING go viral on X.",
    status: "in-progress" as const
  },
  {
    id: "phase-3",
    title: "Phase 3: Advanced Features and Partnerships", 
    description: "Integrate other social media platforms, create partnerships with major crypto platforms and artists. Incorporate features suggested by the community(Improve Ping Website and API).",
    status: "upcoming" as const
  },
  {
    id: "phase-4",
    title: "Phase 4: To Be Revealed", 
    description: "",
    status: "upcoming" as const
  },
];

export type RoadmapStatus = "completed" | "in-progress" | "upcoming";