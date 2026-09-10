import { RoadmapStep } from "@/components/Roadmap";

/**
 * Launch configuration.
 *
 * $PING is relaunching on Pons, on Robinhood Chain. Until the token is
 * deployed there is no contract address, and showing the old Solana pump.fun
 * address on a Robinhood Chain site would be worse than showing nothing.
 * Flip TOKEN_LIVE once CONTRACT_ADDRESS is real; every surface reads this
 * flag and degrades to a pre-launch state on its own.
 */
export const TOKEN_LIVE = false;

/** 0x address from the Pons launch. Empty until deployed. */
export const CONTRACT_ADDRESS = "";

// --- Chain facts. These are fixed by Pons and Robinhood Chain, not by us. ---
export const CHAIN_NAME = "Robinhood Chain";
export const CHAIN_ID = 4663;
export const LAUNCHPAD_NAME = "Pons";
export const LAUNCHPAD_URL = "https://www.ponslaunchpad.com/";
/** Pons mints a fixed 1B supply straight to the bonding curve. No creator allocation. */
export const TOKEN_SUPPLY = 1_000_000_000;
export const EXPLORER_BASE = "https://robinhoodchain.blockscout.com";

export const EXPLORER_LINK = CONTRACT_ADDRESS
  ? `${EXPLORER_BASE}/token/${CONTRACT_ADDRESS}`
  : EXPLORER_BASE;

export const BUY_LINK = CONTRACT_ADDRESS
  ? `${LAUNCHPAD_URL}?token=${CONTRACT_ADDRESS}`
  : LAUNCHPAD_URL;

/** TODO(relaunch): repoint once the new pair exists. */
export const CHART_LINK = "";

// --- Social ---
export const SOCIAL_LINKS = {
  TWITTER: "https://x.com/i/communities/1933201526584963118",
  TELEGRAM: "https://t.me/pingtoken",
  DEXSCREENER: CHART_LINK,
};

// --- Countdown ---
/** Unix ms. Set to the Pons launch slot, then flip SHOW_COUNTDOWN. */
export const COUNTDOWN_TARGET = 0;
export const SHOW_COUNTDOWN = false;

// --- Builder ---
export const EMPTY_TRAIT_CHANCE = 0.3; // 30% chance of no trait in a category
export const TOKEN_SYMBOL = "PING";
export const TOKEN_NAME = "PING";

// --- Roadmap ---
// Deadpan: state what is done and what is next. No "revolutionising", no
// "phase 4: to be revealed".
export const ROADMAP_STEPS: RoadmapStep[] = [
  {
    id: "phase-1",
    title: "Character generator",
    description:
      "238 traits across eight slots, a browser trait editor, and an open image API that renders any combination on demand. All shipped and in use.",
    status: "completed" as const,
  },
  {
    id: "phase-2",
    title: "Robinhood Chain launch",
    description:
      "Deploy on Pons with a fixed supply and permanently locked liquidity. Rebuild the site around the new chain.",
    status: "in-progress" as const,
  },
  {
    id: "phase-3",
    title: "Trait library and sharing",
    description:
      "Expand the trait library with community submissions. Share tools that put a generated character straight into a post, with the preview rendered server-side.",
    status: "upcoming" as const,
  },
  {
    id: "phase-4",
    title: "Integrations",
    description:
      "Open the image API to other projects on Robinhood Chain. Whatever the community builds with it decides what comes after.",
    status: "upcoming" as const,
  },
];

export type RoadmapStatus = "completed" | "in-progress" | "upcoming";
