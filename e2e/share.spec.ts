import { expect, test } from '@playwright/test';
import { isPng, manifest, openBuilder, openedUrls, pngSize, readSelectedCount, stubWindowOpen } from './helpers';

const TWITTERBOT = 'Twitterbot/1.0';

test.describe('share flow: Tweet -> /api/share -> /p/<id>', () => {
  test('Tweet stores the card and opens the composer on its short link', async ({ page, request }) => {
    await stubWindowOpen(page);
    const { picker, preview } = await openBuilder(page);

    await picker.getByRole('img', { name: 'Crown', exact: true }).first().click();
    await picker.getByRole('img', { name: 'Blue Aura', exact: true }).first().click();
    await expect.poll(() => readSelectedCount(page)).toBe(2);

    const shareResponse = page.waitForResponse((r) => r.url().endsWith('/api/share'));
    await preview.getByRole('button', { name: 'Tweet' }).click();
    const share = await shareResponse;
    expect(share.status()).toBe(200);
    const { id, url } = (await share.json()) as { id: string; url: string };
    expect(url).toMatch(new RegExp(`/p/${id}$`));

    await expect.poll(async () => (await openedUrls(page)).length).toBeGreaterThan(0);
    const intent = new URL((await openedUrls(page)).at(-1)!);
    expect(intent.host).toBe('twitter.com');
    expect(intent.pathname).toBe('/intent/tweet');
    expect(intent.searchParams.get('url')).toBe(url);
    expect(intent.searchParams.get('hashtags')).toBe('PING,RobinhoodChain,Crypto');
    // The intent has no image parameter; setting one was a silent no-op once.
    expect(intent.searchParams.has('image')).toBe(false);

    // The scraper gets OG tags pointing at the stored image.
    const bot = await request.get(`/p/${id}`, { headers: { 'user-agent': TWITTERBOT }, maxRedirects: 0 });
    expect(bot.status()).toBe(200);
    const html = await bot.text();
    const ogImage = html.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/)?.[1]
      ?? html.match(/<meta[^>]+content="([^"]+)"[^>]+property="og:image"/)?.[1];
    expect(ogImage).toContain(`/api/image/p/${id}.png`);
    expect(html).toContain('twitter:card');

    const image = await request.get(new URL(ogImage!).pathname);
    expect(image.status()).toBe(200);
    expect(image.headers()['content-type']).toContain('image/png');
    expect(image.headers()['cache-control']).toContain('immutable');
    const bytes = await image.body();
    expect(isPng(bytes)).toBe(true);
    expect(pngSize(bytes).width).toBeGreaterThan(pngSize(bytes).height);

    // Sharing the same character again is a read of the same id.
    const again = await request.post('/api/share', { data: { head: 'crown', aura: 'blue-aura' } });
    expect(await again.json()).toMatchObject({ id, cached: true });
  });

  test('a person opening /p/<id> is sent to the builder with the traits in the URL', async ({ request }) => {
    const { id } = (await (await request.post('/api/share', { data: { head: 'crown' } })).json()) as { id: string };
    const human = await request.get(`/p/${id}`, { maxRedirects: 0 });
    expect(human.status()).toBe(302);
    expect(new URL(human.headers()['location']).search).toBe('?head=crown');
  });

  // /p/<id> hands a person to /?head=...; the builder must load that selection.
  test('the builder restores a character from the share URL', async ({ page }) => {
    const { picker } = await openBuilder(page, '/?head=crown&aura=blue-aura#builder');
    await expect.poll(() => readSelectedCount(page)).toBe(2);
    await expect(picker.getByText('Crown', { exact: true }).first()).toBeVisible();

    // Junk in the query is ignored, not fatal.
    await openBuilder(page, '/?head=no-such-hat&nonsense=1&face=3d-glasses#builder');
    await expect.poll(() => readSelectedCount(page)).toBe(1);
  });

  test('an unknown share id goes to the builder, not a 404', async ({ request }) => {
    const res = await request.get('/p/doesnotexist1', { maxRedirects: 0 });
    expect(res.status()).toBe(302);
  });

  test('share rejects traits that are not in the library', async ({ request }) => {
    const res = await request.post('/api/share', { data: { head: 'no-such-hat' } });
    expect(res.status()).toBe(400);
  });
});

test.describe('image API', () => {
  test('random.png renders a PNG every call, and not always the same one', async ({ request }) => {
    const bodies = new Set<string>();
    for (let i = 0; i < 4; i++) {
      const res = await request.get(`/api/image/random.png?t=${i}`);
      expect(res.status()).toBe(200);
      const bytes = await res.body();
      expect(isPng(bytes)).toBe(true);
      bodies.add(bytes.toString('base64'));
    }
    expect(bodies.size).toBeGreaterThan(1);
  });

  test('custom.png renders a chosen character and rejects a bad one', async ({ request }) => {
    const ok = await request.get('/api/image/custom.png?head=crown&aura=blue-aura');
    expect(ok.status()).toBe(200);
    expect(isPng(await ok.body())).toBe(true);

    const bad = await request.get('/api/image/custom.png?head=no-such-hat');
    expect(bad.status()).toBe(400);
  });

  test('the trait index served to the functions matches the manifest', async ({ request }) => {
    const index = (await (await request.get('/traits-index.json')).json()) as Record<string, string[]>;
    const total = Object.values(index).reduce((n, list) => n + list.length, 0);
    expect(total).toBe(manifest.traits.length);
  });
});
