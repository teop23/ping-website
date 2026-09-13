import { describe, expect, it } from 'vitest';
import launchConfig from '../launch.config.mjs';
import { checkLaunchConfig, configuredUrls } from './check-launch-config.mjs';

const ADDRESS = '0x' + 'ab12'.repeat(10);
const NOW = Date.UTC(2026, 8, 13);
const withConfig = (overrides) => ({ ...launchConfig, ...overrides });

describe('checkLaunchConfig', () => {
  it('passes the config as committed', () => {
    expect(checkLaunchConfig(launchConfig, NOW)).toEqual([]);
  });

  it('passes a correctly filled launch-day config', () => {
    const live = withConfig({
      tokenLive: true,
      contractAddress: ADDRESS,
      chartLink: 'https://dexscreener.com/robinhood/0xpair',
      showCountdown: true,
      countdownTarget: NOW + 3_600_000,
    });
    expect(checkLaunchConfig(live, NOW)).toEqual([]);
  });

  it('rejects going live without an address', () => {
    expect(checkLaunchConfig(withConfig({ tokenLive: true }), NOW).join()).toMatch(/contractAddress is empty/);
  });

  it('rejects malformed and zero addresses', () => {
    for (const bad of ['0x123', ADDRESS.slice(2), `${ADDRESS} `, `0x${'g'.repeat(40)}`]) {
      expect(checkLaunchConfig(withConfig({ contractAddress: bad }), NOW)).not.toEqual([]);
    }
    expect(checkLaunchConfig(withConfig({ contractAddress: `0x${'0'.repeat(40)}` }), NOW).join()).toMatch(/zero address/);
  });

  it('rejects non-https links', () => {
    expect(checkLaunchConfig(withConfig({ chartLink: 'dexscreener.com/x' }), NOW).join()).toMatch(/chartLink/);
    expect(checkLaunchConfig(withConfig({ social: { ...launchConfig.social, telegram: 'http://t.me/x' } }), NOW).join()).toMatch(/telegram/);
    expect(checkLaunchConfig(withConfig({ explorerBase: 'https://robinhoodchain.blockscout.com/' }), NOW).join()).toMatch(/\/\/token/);
  });

  it('catches countdown mistakes', () => {
    const errors = (overrides) => checkLaunchConfig(withConfig({ showCountdown: true, ...overrides }), NOW).join();
    expect(errors({ countdownTarget: 0 })).toMatch(/not set/);
    expect(errors({ countdownTarget: Math.floor(NOW / 1000) + 3600 })).toMatch(/seconds/);
    expect(errors({ countdownTarget: NOW - 1000 })).toMatch(/past/);
  });

  it('rejects an out-of-range empty trait chance', () => {
    expect(checkLaunchConfig(withConfig({ emptyTraitChance: 1 }), NOW)).not.toEqual([]);
    expect(checkLaunchConfig(withConfig({ emptyTraitChance: undefined }), NOW)).not.toEqual([]);
  });
});

describe('configuredUrls', () => {
  it('includes the explorer token page only once an address exists', () => {
    expect(configuredUrls(launchConfig).some((u) => u.includes('/token/'))).toBe(false);
    expect(configuredUrls(withConfig({ contractAddress: ADDRESS }))).toContain(
      `${launchConfig.explorerBase}/token/${ADDRESS}`
    );
  });
});
