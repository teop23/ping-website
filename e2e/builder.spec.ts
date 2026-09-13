import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';
import {
  canvasFingerprint,
  isPng,
  manifest,
  openBuilder,
  pngSize,
  readSelectedCount,
  stubWindowOpen,
  watchForBreakage,
} from './helpers';

const traitCard = (picker: import('@playwright/test').Locator, label: string) =>
  picker.getByRole('img', { name: label, exact: true }).first();

test.describe('builder', () => {
  test('loads every trait and filters by category and search', async ({ page }) => {
    const problems = watchForBreakage(page);
    const { picker } = await openBuilder(page);

    for (const category of manifest.categories) {
      await picker.getByRole('button', { name: category.label, exact: true }).click();
      const count = manifest.traits.filter((t) => t.category === category.id).length;
      await expect(picker.getByRole('heading', { name: `${category.label} (${count})` })).toBeVisible();
    }

    await picker.getByRole('button', { name: 'All', exact: true }).click();
    await picker.getByPlaceholder('Search traits...').fill('crown');
    const matches = manifest.traits.filter(
      (t) => t.label.toLowerCase().includes('crown') || t.category.includes('crown')
    ).length;
    await expect(picker.getByRole('heading', { name: `Search Results (${matches})` })).toBeVisible();

    await picker.getByPlaceholder('Search traits...').fill('zzzz-no-such-trait');
    await expect(picker.getByText('No traits found')).toBeVisible();

    expect(problems).toEqual([]);
  });

  test('selecting, deselecting, removing and clearing traits repaints the preview', async ({ page }) => {
    const problems = watchForBreakage(page);
    const { picker } = await openBuilder(page);
    await page.waitForTimeout(500);
    const blank = await canvasFingerprint(page);

    await traitCard(picker, 'Crown').click();
    await expect.poll(() => readSelectedCount(page)).toBe(1);
    await expect.poll(() => canvasFingerprint(page)).not.toBe(blank);

    // Clicking a selected card toggles it off.
    await traitCard(picker, 'Crown').click();
    await expect.poll(() => readSelectedCount(page)).toBe(0);
    await expect(picker.getByText('No traits selected')).toBeVisible();

    await traitCard(picker, 'Crown').click();
    await traitCard(picker, 'Blue Aura').click();
    await expect.poll(() => readSelectedCount(page)).toBe(2);

    // The chip's remove button.
    const chip = picker.locator('div').filter({ hasText: /^Blue Aura$/ }).last();
    await chip.getByRole('button').click();
    await expect.poll(() => readSelectedCount(page)).toBe(1);

    await picker.getByRole('button', { name: 'Clear All' }).click();
    await expect.poll(() => readSelectedCount(page)).toBe(0);
    await expect.poll(() => canvasFingerprint(page)).toBe(blank);

    expect(problems).toEqual([]);
  });

  test('randomize rolls at most one trait per category and leaves slots empty', async ({ page }) => {
    await stubWindowOpen(page);
    const bodies: Record<string, string>[] = [];
    await page.route('**/api/share', async (route) => {
      bodies.push(route.request().postDataJSON());
      await route.fulfill({ json: { id: 'stub', url: 'http://localhost/p/stub' } });
    });

    const { preview } = await openBuilder(page);
    const randomize = preview.getByRole('button', { name: 'Randomize' });
    const tweet = preview.getByRole('button', { name: 'Tweet' });

    const rolls = 30;
    const counts: number[] = [];
    for (let i = 0; i < rolls; i++) {
      await randomize.click();
      const chips = await readSelectedCount(page);
      counts.push(chips);
      expect(chips).toBeLessThanOrEqual(manifest.categories.length);

      // The share body is keyed by category, so two traits from one category
      // would collapse into one key and the counts would disagree.
      if (i < 8 && chips > 0) {
        const before = bodies.length;
        await tweet.click();
        await expect.poll(() => bodies.length).toBe(before + 1);
        await expect(tweet).toBeEnabled({ timeout: 5000 });
        expect(Object.keys(bodies.at(-1)!)).toHaveLength(chips);
      }
    }

    // 8 slots at a 40-50% empty chance averages 4-4.8 traits. Thirty rolls
    // keep the sample mean well inside this band; a regression back to
    // "every slot filled" (8) or "almost nothing" fails it.
    const mean = counts.reduce((a, b) => a + b, 0) / rolls;
    expect(mean).toBeGreaterThan(2.8);
    expect(mean).toBeLessThan(6);
    expect(Math.max(...counts)).toBeLessThan(manifest.categories.length + 1);
    expect(new Set(counts).size).toBeGreaterThan(1);
  });

  test('download produces a 1024px PNG', async ({ page }) => {
    const { picker, preview } = await openBuilder(page);
    await traitCard(picker, 'Crown').click();
    await expect.poll(() => readSelectedCount(page)).toBe(1);

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      preview.getByRole('button', { name: 'Download' }).click(),
    ]);
    expect(download.suggestedFilename()).toBe('my-ping-character.png');
    const bytes = readFileSync((await download.path())!);
    expect(isPng(bytes)).toBe(true);
    expect(pngSize(bytes)).toEqual({ width: 1024, height: 1024 });
  });

  test('copy puts a PNG on the clipboard', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    const problems = watchForBreakage(page);
    const { picker, preview } = await openBuilder(page);
    await traitCard(picker, 'Crown').click();
    await expect.poll(() => readSelectedCount(page)).toBe(1);

    // "Copied!" shows as soon as the click lands, before the write has even
    // started, so the button text proves nothing. Read the clipboard back.
    await preview.getByRole('button', { name: 'Copy' }).click();
    await expect
      .poll(
        () =>
          page.evaluate(async () => {
            const items = await navigator.clipboard.read();
            return items.flatMap((item) => item.types);
          }),
        { timeout: 10_000 }
      )
      .toContain('image/png');
    expect(problems).toEqual([]);
  });

  test('text tool adds a label over the preview', async ({ page }) => {
    const { picker } = await openBuilder(page);
    await picker.getByRole('button', { name: 'Text', exact: true }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await dialog.getByPlaceholder('Enter text...').fill('gm pingers');
    await dialog.getByRole('button', { name: 'Add Text' }).click();
    await page.keyboard.press('Escape');
    await expect(page.getByText('gm pingers', { exact: true }).first()).toBeVisible();
  });
});
