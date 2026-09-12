import { spawnSync } from 'child_process';
import { readFileSync } from 'fs';
import { describe, expect, it } from 'vitest';

const run = (...args) => {
  const result = spawnSync('node', ['scripts/check-copy-count.mjs', ...args], { encoding: 'utf8' });
  return { code: result.status ?? 1, output: `${result.stdout ?? ''}${result.stderr ?? ''}` };
};

describe('pre-build: no hardcoded trait counts', () => {
  it('passes on the current source tree', () => {
    const { code, output } = run();
    expect(code).toBe(0);
    expect(output).toContain('No hardcoded trait counts found');
  });

  it('index.html carries the __TRAIT_COUNT__ placeholder, not a literal', () => {
    const html = readFileSync('index.html', 'utf8');
    expect(html).toContain('__TRAIT_COUNT__');
    expect(html).not.toMatch(/\b\d{2,4}\s+traits\b/);
  });
});

describe('post-build: dist/index.html must quote the real count', () => {
  it('fails when dist/ has not been built yet', () => {
    // Uses --expect to avoid depending on whether a stale dist/ happens to
    // exist locally; the real check (against an actual `npm run build`
    // output) is exercised by the verification steps in docs/HANDOFF.md.
    const { code, output } = run('--post-build', '--expect', '999999');
    expect(code).toBe(1);
    expect(output.length).toBeGreaterThan(0);
  });
});
