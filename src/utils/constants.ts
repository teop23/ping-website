import { RoadmapStep } from "@/components/Roadmap";
import launchConfig from "../../launch.config.mjs";
import traitsManifest from "../../public/traits-manifest.json";

/**
 * Launch configuration.
 *
 * The actual values now live in /launch.config.mjs at the repo root - that
 * is the one file the owner edits on launch day (see its header for what
 * each value does and why it's a plain .mjs file, shared by src/, functions/
 * and index.html). This module re-exports them under their existing names so
 * every component that already imports from here keeps working unchanged.
 *
 * $PING is relaunching on Pons, on Robinhood Chain. Until the token is
 * deployed there is no contract address, and showing the old Solana pump.fun
 * address on a Robinhood Chain site would be worse than showing nothing.
 * The token is live exactly when CONTRACT_ADDRESS is set; every surface reads
 * TOKEN_LIVE and degrades to a pre-launch state on its own.
 */
/** 0x address from the Pons launch. Empty until deployed. */
export const CONTRACT_ADDRESS = launchConfig.contractAddress;
export const TOKEN_LIVE = CONTRACT_ADDRESS !== "";

// --- Chain facts. These are fixed by Pons and Robinhood Chain, not by us. ---
export const CHAIN_NAME = launchConfig.chain.name;
export const CHAIN_ID = launchConfig.chain.id;
export const LAUNCHPAD_NAME = launchConfig.launchpad.name;
export const LAUNCHPAD_URL = launchConfig.launchpad.url;
/** Pons mints a fixed 1B supply straight to the bonding curve. No creator allocation. */
export const TOKEN_SUPPLY = launchConfig.tokenSupply;
export const EXPLORER_BASE = launchConfig.explorerBase;

export const EXPLORER_LINK = CONTRACT_ADDRESS
  ? `${EXPLORER_BASE}/token/${CONTRACT_ADDRESS}`
  : EXPLORER_BASE;

/** Pons token pages live at /launchpad/<address>, checked against a real listing. */
export const BUY_LINK = CONTRACT_ADDRESS
  ? `${LAUNCHPAD_URL}/${CONTRACT_ADDRESS}`
  : LAUNCHPAD_URL;

/**
 * Dexscreener token page, which opens the token's top pair. Pons tokens only
 * get a pair when the bonding curve graduates into Uniswap v4; until then
 * this page is "Not Found", so the navbar gates it on useChartListed().
 */
export const CHART_LINK = CONTRACT_ADDRESS
  ? `${launchConfig.chartBase}/${CONTRACT_ADDRESS}`
  : "";

// --- Social ---
export const SOCIAL_LINKS = {
  TWITTER: launchConfig.social.twitter,
  TELEGRAM: launchConfig.social.telegram,
  DEXSCREENER: CHART_LINK,
};

export const SITE_URL = launchConfig.siteUrl;

// --- Countdown ---
/** Unix ms. Set to the Pons launch slot, then flip SHOW_COUNTDOWN. */
export const COUNTDOWN_TARGET = launchConfig.countdownTarget;
export const SHOW_COUNTDOWN = launchConfig.showCountdown;

// --- Builder ---
export const EMPTY_TRAIT_CHANCE = launchConfig.emptyTraitChance; // chance a category rolls empty on Randomize
export const TOKEN_SYMBOL = launchConfig.tokenSymbol;
export const TOKEN_NAME = launchConfig.tokenName;

/**
 * Derived from the real trait library (public/traits-manifest.json, built by
 * scripts/generate-index.mjs from public/traits/*.png) - never hand-typed.
 * This used to be a literal duplicated across 4 files that drifted; now
 * every consumer (this file, index.html via a build-time token, and
 * functions/api/og/banner.png.tsx) reads the same manifest.
 */
export const TRAIT_COUNT = traitsManifest.traits.length;

// --- Roadmap ---
// Deadpan: state what is done and what is next. No "revolutionising", no
// "phase 4: to be revealed".
export const ROADMAP_STEPS: RoadmapStep[] = [
  {
    id: "phase-1",
    title: "Character generator",
    description:
      `${TRAIT_COUNT} traits across eight slots, a browser trait editor, and an open image API that renders any combination on demand. All shipped and in use.`,
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
