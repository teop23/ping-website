import { spawnSync } from 'child_process';
import { readFileSync } from 'fs';
import { describe, expect, it } from 'vitest';

const run = (...args) => {
  const result = spawnSync('node', ['scripts/check-copy-count.mjs', ...args], { encoding: 'utf8' });
  return { code: result.status ?? 1, output: `${result.stdout ?? ''}${result.stderr ?? ''}` };
};

describe('trait count in site copy', () => {
  it('fails when the copy disagrees with the library', () => {
    const { code, output } = run('--expect', '1');
    expect(code).toBe(1);
    expect(output).toContain('copy says');
  });

  it('passes when every quoted count matches', () => {
    const count = Number(readFileSync('src/pages/Home.tsx', 'utf8').match(/TRAIT_COUNT = (\d+)/)[1]);
    const { code, output } = run('--expect', String(count));
    expect(code).toBe(0);
    expect(output).toContain('matches');
  });
});
