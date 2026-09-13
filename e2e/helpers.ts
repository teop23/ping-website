import { expect, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';

export interface ManifestTrait {
  id: string;
  name: string;
  label: string;
  category: string;
}

export const manifest = JSON.parse(readFileSync('public/traits-manifest.json', 'utf8')) as {
  categories: { id: string; label: string }[];
  traits: ManifestTrait[];
};

export const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

export const isPng = (bytes: Buffer): boolean =>
  PNG_SIGNATURE.every((byte, i) => bytes[i] === byte);

export const pngSize = (bytes: Buffer) => ({
  width: bytes.readUInt32BE(16),
  height: bytes.readUInt32BE(20),
});

/**
 * Collects the things that mean a page is broken even when it looks fine:
 * uncaught errors, console errors, and any same-origin request that failed or
 * came back 4xx/5xx (a missing trait PNG is exactly that).
 */
export const watchForBreakage = (page: Page) => {
  const problems: string[] = [];
  page.on('pageerror', (err) => problems.push(`pageerror: ${err.message}`));
  page.on('console', (msg) => {
    if (msg.type() === 'error') problems.push(`console: ${msg.text()}`);
  });
  page.on('response', (res) => {
    const url = new URL(res.url());
    if (url.host === new URL(page.url() || res.url()).host && res.status() >= 400) {
      problems.push(`${res.status()} ${url.pathname}`);
    }
  });
  page.on('requestfailed', (req) => {
    const failure = req.failure()?.errorText ?? '';
    // Navigations away and aborted image decodes are not breakage.
    if (!/ERR_ABORTED/.test(failure)) problems.push(`failed ${req.url()} ${failure}`);
  });
  return problems;
};

/**
 * window.open is stubbed so the Tweet flow can be asserted without a real X
 * popup: every URL the page tries to open (directly or by setting the
 * composer's location) lands in window.__opened.
 */
export const stubWindowOpen = async (page: Page) => {
  await page.addInitScript(() => {
    const opened: string[] = [];
    (window as unknown as { __opened: string[] }).__opened = opened;
    window.open = ((url?: string | URL) => {
      if (url) opened.push(String(url));
      return {
        location: {
          set href(value: string) {
            opened.push(value);
          },
        },
        close() {},
      } as unknown as Window;
    }) as typeof window.open;
  });
};

export const openedUrls = (page: Page) =>
  page.evaluate(() => (window as unknown as { __opened: string[] }).__opened.filter(Boolean));

/** The builder section, scrolled into view, with its trait grid loaded. */
export const openBuilder = async (page: Page, path = '/#builder') => {
  await page.goto(path);
  const picker = page.getByRole('region', { name: 'Trait picker' });
  await expect(picker.getByText(`All Traits (${manifest.traits.length})`)).toBeVisible();
  return {
    picker,
    preview: page.getByRole('region', { name: 'Character preview' }),
    selectedCount: picker.getByRole('heading', { name: /^Selected \(\d+\)$/ }),
  };
};

export const readSelectedCount = async (page: Page): Promise<number> => {
  const text = await page
    .getByRole('region', { name: 'Trait picker' })
    .getByRole('heading', { name: /^Selected \(\d+\)$/ })
    .innerText();
  return Number(text.match(/\d+/)![0]);
};

/** A cheap fingerprint of the preview canvas, to tell whether it repainted. */
export const canvasFingerprint = (page: Page) =>
  page
    .getByRole('region', { name: 'Character preview' })
    .locator('canvas')
    .evaluate((canvas: HTMLCanvasElement) => canvas.toDataURL('image/png'));
