import { expect, test } from '@playwright/test';
import { manifest, watchForBreakage } from './helpers';

test.describe('site', () => {
  test('home renders the fold, hero and generator with nothing broken', async ({ page }) => {
    const problems = watchForBreakage(page);
    await page.goto('/');

    await expect(page.getByRole('heading', { level: 1, name: 'Build a PING.' })).toBeVisible();
    await expect(page.getByText(`${manifest.traits.length} across 8 slots`)).toBeVisible();
    await expect(page.getByRole('heading', { name: 'The generator' })).toBeVisible();

    // The hero cycles through hardcoded combos; a trait renamed or cut from the
    // library shows up here as a 404, not as a visible error.
    await page.waitForTimeout(4000);
    await page.getByRole('heading', { name: 'The generator' }).scrollIntoViewIfNeeded();
    await page.waitForLoadState('networkidle');

    expect(problems).toEqual([]);
  });

  test('the generator link scrolls to the builder', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Open the generator' }).click();
    await expect(page.getByRole('region', { name: 'Trait picker' })).toBeInViewport();
  });

  for (const { path, heading } of [
    { path: '/community', heading: 'Community' },
    { path: '/docs', heading: 'API Documentation' },
  ]) {
    test(`${path} renders`, async ({ page }) => {
      const problems = watchForBreakage(page);
      await page.goto(path);
      await expect(page.getByRole('heading', { level: 1, name: heading })).toBeVisible();
      await page.waitForLoadState('networkidle');
      expect(problems).toEqual([]);
    });
  }

  for (const path of ['/create-traits', '/watermark']) {
    test(`${path} renders its tool`, async ({ page }) => {
      const problems = watchForBreakage(page);
      await page.goto(path);
      // Both are lazy routes that pull in fabric.js; the fallback must clear.
      await expect(page.getByRole('status').filter({ hasText: 'Loading' })).toHaveCount(0);
      await expect(page.locator('main, canvas').first()).toBeVisible();
      await page.waitForLoadState('networkidle');
      expect(problems).toEqual([]);
    });
  }

  test('navbar navigates between pages', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Community' }).first().click();
    await expect(page).toHaveURL(/\/community$/);
    await expect(page.getByRole('heading', { level: 1, name: 'Community' })).toBeVisible();
    await page.getByRole('link', { name: 'Home' }).first().click();
    await expect(page.getByRole('heading', { level: 1, name: 'Build a PING.' })).toBeVisible();
  });
});
