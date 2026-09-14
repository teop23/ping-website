import { useEffect, useState } from "react";
import launchConfig from "../../launch.config.mjs";
import { CONTRACT_ADDRESS } from "./constants";

/**
 * Whether Dexscreener has a pair for the token, i.e. whether CHART_LINK leads
 * anywhere. Pons tokens trade on the bonding curve (charted on the Pons page
 * itself) and only get a Uniswap v4 pair when the curve graduates, which can
 * be hours or days after launch. Asking the API means the chart icon appears
 * on its own at graduation, with no second deploy.
 */
export const fetchChartListed = async (
  address: string,
  fetchFn: typeof fetch = fetch,
): Promise<boolean> => {
  if (!address) return false;
  const chain = launchConfig.chartBase.split("/").pop();
  try {
    const response = await fetchFn(`https://api.dexscreener.com/token-pairs/v1/${chain}/${address}`);
    if (!response.ok) return false;
    const pairs: unknown = await response.json();
    return Array.isArray(pairs) && pairs.length > 0;
  } catch {
    return false;
  }
};

// One request per page load, shared by every component that asks.
let listing: Promise<boolean> | undefined;

export const useChartListed = (): boolean => {
  const [listed, setListed] = useState(false);
  useEffect(() => {
    if (!CONTRACT_ADDRESS) return;
    let active = true;
    listing ??= fetchChartListed(CONTRACT_ADDRESS);
    listing.then((value) => active && setListed(value));
    return () => {
      active = false;
    };
  }, []);
  return listed;
};
