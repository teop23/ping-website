import { spawnSync } from 'child_process';
import { readFileSync } from 'fs';
import { describe, expect, it } from 'vitest';

const run = (...args) => {
  const result = spawnSync('node', ['scripts/check-copy-count.mjs', ...args], { encoding: 'utf8' });
  return { code: result.status ?? 1, output: `${result.stdout ?? ''}${result.stderr ?? ''}` };
};

describe('pre-build: trait counts stay where they belong', () => {
  it('passes on the current source tree', () => {
    const { code, output } = run();
    expect(code).toBe(0);
    expect(output).toContain('Page copy derives the count, share copy omits it');
  });

  it('share metadata in index.html quotes no trait count', () => {
    // A share card outlives the number it quotes: every platform that scrapes
    // it caches the description for months, so a count baked in here is wrong
    // out in the world no matter how correctly it was derived at build time.
    const html = readFileSync('index.html', 'utf8');
    expect(html).not.toContain('__TRAIT_COUNT__');
    expect(html).not.toMatch(/\b\d{2,4}\s+traits\b/);
  });

  it('the OG banner quotes no trait count either', () => {
    const tsx = readFileSync('functions/api/og/banner.png.tsx', 'utf8');
    expect(tsx).not.toMatch(/TRAIT_COUNT/);
    expect(tsx).not.toMatch(/\b\d{2,4}\s+traits\b/);
  });

  it('the page itself still derives a real count from the manifest', () => {
    // On-page copy is read live, so quoting the count there is fine - as long
    // as it comes from the manifest and not from someone's fingers.
    const constants = readFileSync('src/utils/constants.ts', 'utf8');
    expect(constants).toContain('traitsManifest.traits.length');
    expect(constants).not.toMatch(/TRAIT_COUNT\s*=\s*\d+/);
  });
});

describe('post-build: built HTML must ship clean', () => {
  // --file points the check at a fixture, so the failure modes are covered
  // without depending on whether a stale dist/ happens to exist locally.
  const check = (fixture) => run('--post-build', '--file', `scripts/fixtures/${fixture}`);

  it('fails when the file is missing entirely', () => {
    const { code } = check('does-not-exist.html');
    expect(code).toBe(1);
  });

  it('fails when a placeholder was never replaced', () => {
    const { code, output } = check('og-unreplaced.html');
    expect(code).toBe(1);
    expect(output).toContain('__SITE_URL__');
  });

  it('fails when share metadata quotes a trait count', () => {
    const { code, output } = check('og-stale-count.html');
    expect(code).toBe(1);
    expect(output).toContain('176');
  });

  it('passes on clean output, and ignores counts in the body', () => {
    // Only the <head> is scraped. The rendered page may quote a live count.
    const { code } = check('og-clean.html');
    expect(code).toBe(0);
  });
});
