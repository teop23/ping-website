/**
 * Type declaration for launch.config.mjs.
 *
 * Kept as a separate .d.mts (not the .mjs itself converted to .ts) so the
 * config stays a plain, comment-friendly ESM file every runtime (Vite,
 * esbuild/wrangler, plain `node`) can load with zero transform step. See the
 * header comment in launch.config.mjs for why.
 */
export interface LaunchConfig {
  tokenLive: boolean;
  contractAddress: string;
  chartLink: string;
  countdownTarget: number;
  showCountdown: boolean;

  chain: {
    name: string;
    id: number;
  };
  launchpad: {
    name: string;
    url: string;
  };
  tokenSupply: number;
  explorerBase: string;

  social: {
    twitter: string;
    telegram: string;
  };

  siteUrl: string;
  tokenSymbol: string;
  tokenName: string;

  emptyTraitChance: number;
}

declare const launchConfig: LaunchConfig;
export default launchConfig;
