import { pathToFileURL } from 'url';

/**
 * Launch-day guard for launch.config.mjs.
 *
 * BUY_LINK, EXPLORER_LINK and CHART_LINK (src/utils/constants.ts) are all
 * templated off contractAddress. A typo there does not fail the
 * build or throw at runtime; it ships a buy button that goes nowhere, at the
 * exact moment people try to use it. This catches the shapes that can be
 * checked offline, and runs in prebuild so a bad edit cannot deploy.
 *
 *   node scripts/check-launch-config.mjs
 *     Offline checks only (what prebuild runs).
 *
 *   node scripts/check-launch-config.mjs --reachable
 *     Also fetches every configured URL and fails on a non-2xx/3xx, and
 *     reports whether Dexscreener lists a pair yet (it will not until the
 *     curve graduates; that is not a failure). Run by hand after pasting the
 *     contract address, before announcing.
 */

const ADDRESS = /^0x[0-9a-fA-F]{40}$/;

const isHttps = (value) => {
  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
};

/** Every URL the site links out to, for --reachable. Empty strings skipped. */
export const configuredUrls = (config) =>
  [
    config.launchpad?.url,
    config.explorerBase,
    config.social?.twitter,
    config.social?.telegram,
    config.siteUrl,
    config.contractAddress && `${config.explorerBase}/token/${config.contractAddress}`,
  ].filter(Boolean);

/** Returns a list of problems; empty means the config is safe to ship. */
export const checkLaunchConfig = (config, now = Date.now()) => {
  const errors = [];

  if (config.contractAddress && !ADDRESS.test(config.contractAddress)) {
    errors.push(`contractAddress "${config.contractAddress}" is not a 0x-prefixed 40-hex-digit address`);
  }
  if (config.contractAddress && /^0x0{40}$/.test(config.contractAddress)) {
    errors.push('contractAddress is the zero address');
  }

  for (const [name, value] of [
    ['launchpad.url', config.launchpad?.url],
    ['explorerBase', config.explorerBase],
    ['chartBase', config.chartBase],
    ['social.twitter', config.social?.twitter],
    ['social.telegram', config.social?.telegram],
    ['siteUrl', config.siteUrl],
  ]) {
    if (!isHttps(value)) errors.push(`${name} "${value}" is not an https URL`);
  }
  for (const name of ['explorerBase', 'chartBase']) {
    if (config[name]?.endsWith('/')) errors.push(`${name} ends with "/": its links would contain "//"`);
  }

  if (config.showCountdown) {
    if (!Number.isFinite(config.countdownTarget) || config.countdownTarget <= 0) {
      errors.push('showCountdown is true but countdownTarget is not set');
    } else if (config.countdownTarget < 1e12) {
      errors.push(`countdownTarget ${config.countdownTarget} looks like seconds; it must be Unix milliseconds`);
    } else if (config.countdownTarget <= now && !config.contractAddress) {
      errors.push(`countdownTarget ${new Date(config.countdownTarget).toISOString()} is in the past and the token is not live`);
    }
  }

  if (!(config.emptyTraitChance >= 0 && config.emptyTraitChance < 1)) {
    errors.push(`emptyTraitChance ${config.emptyTraitChance} must be in [0, 1)`);
  }

  return errors;
};

const reachable = async (urls) => {
  const failures = [];
  for (const url of urls) {
    try {
      const response = await fetch(url, { method: 'GET', redirect: 'manual', signal: AbortSignal.timeout(15_000) });
      if (response.status >= 400) failures.push(`${url} answered ${response.status}`);
    } catch (err) {
      failures.push(`${url} did not answer (${err.cause?.code ?? err.name})`);
    }
  }
  return failures;
};

/**
 * Dexscreener's API answers scripts where dexscreener.com itself returns a
 * Cloudflare 403, so the chart is checked here rather than in reachable().
 */
const chartListing = async (config) => {
  const chain = config.chartBase.split('/').pop();
  try {
    const response = await fetch(`https://api.dexscreener.com/token-pairs/v1/${chain}/${config.contractAddress}`, {
      signal: AbortSignal.timeout(15_000),
    });
    const pairs = await response.json();
    return pairs.length > 0
      ? `Chart: Dexscreener lists ${pairs.length} pair(s), the navbar chart icon is showing.`
      : 'Chart: no Dexscreener pair yet (normal until the curve graduates); the chart icon stays hidden.';
  } catch (err) {
    return `Chart: Dexscreener API did not answer (${err.cause?.code ?? err.name}); the chart icon stays hidden.`;
  }
};

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { default: config } = await import('../launch.config.mjs');
  const errors = checkLaunchConfig(config);
  if (process.argv.includes('--reachable')) errors.push(...(await reachable(configuredUrls(config))));

  if (errors.length > 0) {
    console.error(`\nLaunch config check failed (${errors.length}):`);
    errors.forEach((e) => console.error(`  x ${e}`));
    process.exit(1);
  }
  console.log(
    config.contractAddress
      ? `Launch config OK: live, contract ${config.contractAddress}.`
      : 'Launch config OK: pre-launch (contractAddress is empty).'
  );
  if (config.contractAddress && process.argv.includes('--reachable')) console.log(await chartListing(config));
}
