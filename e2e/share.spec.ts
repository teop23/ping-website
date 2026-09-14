import { expect, test } from '@playwright/test';
import { isPng, manifest, openBuilder, pngSize, readSelectedCount } from './helpers';

const TWITTERBOT = 'Twitterbot/1.0';

test.describe('share flow: Share dialog -> /api/share -> /p/<id>', () => {
  test('Share stores the card, previews it, and points every target at its short link', async ({ page, request }) => {
    const { picker, preview } = await openBuilder(page);

    await picker.getByRole('img', { name: 'Crown', exact: true }).first().click();
    await picker.getByRole('img', { name: 'Blue Aura', exact: true }).first().click();
    await expect.poll(() => readSelectedCount(page)).toBe(2);

    const shareResponse = page.waitForResponse((r) => r.url().endsWith('/api/share'));
    await preview.getByRole('button', { name: 'Share' }).click();
    const share = await shareResponse;
    expect(share.status()).toBe(200);
    const { id, url } = (await share.json()) as { id: string; url: string };
    expect(url).toMatch(new RegExp(`/p/${id}$`));

    const dialog = page.getByRole('dialog', { name: 'Share' });
    await expect(dialog.getByRole('textbox', { name: 'Share link' })).toHaveValue(url);
    await expect(dialog.getByRole('img', { name: 'Link preview card for this PING' })).toHaveAttribute('src', `/api/image/p/${id}.png`);
    await expect(dialog.getByRole('img', { name: 'Link preview card for this PING' })).toHaveJSProperty('complete', true);

    const telegram = new URL((await dialog.getByRole('link', { name: 'Telegram' }).getAttribute('href'))!);
    expect(telegram.host).toBe('t.me');
    expect(telegram.searchParams.get('url')).toBe(url);

    const intent = new URL((await dialog.getByRole('link', { name: 'Post on X' }).getAttribute('href'))!);
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

    // Suggestions only appear once "Add a message" is ticked.
    await expect(dialog.getByRole('button', { name: 'gm.' })).toHaveCount(0);
    await dialog.getByRole('checkbox', { name: 'Add a message' }).check();
    // Picking a message re-shares as a new card; the default message is the bare id.
    const withMessage = page.waitForResponse(
      (r) => r.url().endsWith('/api/share') && r.request().postDataJSON()?.message === 'gm.'
    );
    await dialog.getByRole('button', { name: 'gm.' }).click();
    const messaged = (await (await withMessage).json()) as { id: string; url: string };
    expect(messaged.id).not.toBe(id);
    await expect(dialog.getByRole('textbox', { name: 'Share link' })).toHaveValue(messaged.url);
    await expect(dialog.getByRole('img', { name: 'Link preview card for this PING' })).toHaveAttribute('src', `/api/image/p/${messaged.id}.png`);
    const messagedIntent = new URL((await dialog.getByRole('link', { name: 'Post on X' }).getAttribute('href'))!);
    expect(messagedIntent.searchParams.get('text')).toContain('gm.');
    await dialog.getByRole('button', { name: 'You have 1 new PING.' }).click();
    await expect(dialog.getByRole('textbox', { name: 'Share link' })).toHaveValue(url);

    // A message the sender writes is stored as its own card once typing pauses.
    const custom = page.waitForResponse(
      (r) => r.url().endsWith('/api/share') && r.request().postDataJSON()?.message === 'wen lambo'
    );
    await dialog.getByRole('textbox', { name: 'Message' }).fill('wen lambo');
    const customShared = (await (await custom).json()) as { id: string; url: string };
    await expect(dialog.getByRole('textbox', { name: 'Share link' })).toHaveValue(customShared.url);

    // A link is refused in the dialog, before any request.
    await dialog.getByRole('textbox', { name: 'Message' }).fill('claim at free-eth.xyz');
    await expect(dialog.getByText('No links or @handles.')).toBeVisible();

    // Unticking goes back to the default card.
    await dialog.getByRole('checkbox', { name: 'Add a message' }).uncheck();
    await expect(dialog.getByRole('textbox', { name: 'Share link' })).toHaveValue(url);

    // Sharing the same character again is a read of the same id.
    const again = await request.post('/api/share', { data: { head: 'crown', aura: 'blue-aura' } });
    expect(await again.json()).toMatchObject({ id, cached: true });
  });

  test('a person opening /p/<id> sees the showcase, and Remix loads that character', async ({ page, request }) => {
    const { id } = (await (await request.post('/api/share', { data: { head: 'crown', aura: 'blue-aura' } })).json()) as { id: string };
    await page.goto(`/p/${id}`);
    await expect(page.getByRole('heading', { level: 1, name: /Crown/ })).toBeVisible();
    await expect(page.getByRole('img', { name: /Crown/ })).toBeVisible();
    await expect(page.getByText('Blue Aura', { exact: true })).toBeVisible();

    await page.getByRole('link', { name: 'Remix this PING' }).click();
    await expect(page).toHaveURL(/[?]aura=blue-aura&head=crown#builder$/);
    await expect.poll(() => readSelectedCount(page)).toBe(2);
  });

  test('/api/card/<id> describes a stored card and 404s an unknown one', async ({ request }) => {
    const { id } = (await (await request.post('/api/share', { data: { head: 'crown' } })).json()) as { id: string };
    const card = await request.get(`/api/card/${id}`);
    expect(await card.json()).toMatchObject({ id, traits: 'head=crown', image: `/api/image/p/${id}.png` });
    expect((await request.get('/api/card/doesnotexist1')).status()).toBe(404);
  });

  // Remix on /p/<id> hands a person to /?head=...; the builder must load that selection.
  test('the builder restores a character from the share URL', async ({ page }) => {
    const { picker } = await openBuilder(page, '/?head=crown&aura=blue-aura#builder');
    await expect.poll(() => readSelectedCount(page)).toBe(2);
    await expect(picker.getByText('Crown', { exact: true }).first()).toBeVisible();

    // Junk in the query is ignored, not fatal.
    await openBuilder(page, '/?head=no-such-hat&nonsense=1&face=vr-headset#builder');
    await expect.poll(() => readSelectedCount(page)).toBe(1);
  });

  test('an unknown share id goes to the builder, not a 404', async ({ request }) => {
    const res = await request.get('/p/doesnotexist1', { maxRedirects: 0 });
    expect(res.status()).toBe(302);
  });

  test('a first-time share appears at the top of the gallery, and the Community page shows it', async ({ page, request }) => {
    // A character local KV has never stored, so this share is a real write.
    const index = (await (await request.get('/traits-index.json')).json()) as Record<string, string[]>;
    const pick = (category: string) => index[category][Math.floor(Math.random() * index[category].length)];
    const character = { head: pick('head'), face: pick('face'), body: pick('body'), aura: pick('aura') };
    const shared = (await (await request.post('/api/share', { data: character })).json()) as { id: string; cached: boolean };
    test.skip(shared.cached, 'random character already stored locally');

    // The index write runs in waitUntil, after the response.
    await expect
      .poll(async () => ((await (await request.get('/api/gallery')).json()) as { items: { id: string }[] }).items[0]?.id)
      .toBe(shared.id);

    await page.goto('/community');
    const card = page.getByTestId('shared-gallery').locator(`a[href="/p/${shared.id}"]`);
    await expect(card).toBeVisible();
    await expect(card.locator('img')).toHaveJSProperty('complete', true);
  });

  test('a failed share says so and retries, instead of handing out the long /api/og link', async ({ page }) => {
    const { picker, preview } = await openBuilder(page);
    await picker.getByRole('img', { name: 'Crown', exact: true }).first().click();
    await expect.poll(() => readSelectedCount(page)).toBe(1);

    // The server's render running out of CPU: both of the client's attempts fail.
    let failing = true;
    let posts = 0;
    await page.route('**/api/share', async (route) => {
      posts++;
      if (failing) await route.fulfill({ status: 502, contentType: 'application/json', body: '{"error":"Card render failed"}' });
      else await route.continue();
    });

    await preview.getByRole('button', { name: 'Share' }).click();
    const dialog = page.getByRole('dialog', { name: 'Share' });
    await expect(dialog.getByText('Could not create the link.')).toBeVisible();
    expect(posts).toBe(2);
    await expect(dialog.getByRole('textbox', { name: 'Share link' })).toHaveValue('');
    await expect(dialog.getByRole('link', { name: 'Post on X' })).toHaveCount(0);

    failing = false;
    await dialog.getByRole('button', { name: 'Try again' }).click();
    await expect(dialog.getByRole('textbox', { name: 'Share link' })).toHaveValue(/\/p\/[0-9a-z]+$/);
  });

  test('share rejects traits that are not in the library', async ({ request }) => {
    const res = await request.post('/api/share', { data: { head: 'no-such-hat' } });
    expect(res.status()).toBe(400);
  });
});

test.describe('merged PING sharing: a message on the same /p/<id>', () => {
  test('the default message shares the message-less id', async ({ request }) => {
    const a = await (await request.post('/api/share', { data: { head: 'crown', aura: 'blue-aura' } })).json();
    const b = await (await request.post('/api/share', { data: { head: 'crown', aura: 'blue-aura', message: 'You have 1 new PING.' } })).json();
    expect(a.id).toBe(b.id);
  });

  test('the same character with a message gets a different id than without one', async ({ request }) => {
    const bare = (await (await request.post('/api/share', { data: { head: 'cowboy-hat' } })).json()) as { id: string };
    const withMessage = (await (
      await request.post('/api/share', { data: { head: 'cowboy-hat', message: 'gm.' } })
    ).json()) as { id: string };
    expect(withMessage.id).not.toBe(bare.id);
  });

  test('accepts a message the sender wrote, and refuses links, handles and emoji', async ({ request }) => {
    const ok = await request.post('/api/share', { data: { head: 'crown', message: 'wen lambo' } });
    expect(ok.status()).toBe(200);
    for (const message of ['claim at free-eth.xyz', 'DM @support', 'gm 🚀', 'x'.repeat(41)]) {
      const res = await request.post('/api/share', { data: { head: 'crown', message } });
      expect(res.status()).toBe(400);
    }
  });

  test('/api/card/<id> returns the message, and the stored card is the crop-safe banner', async ({ request }) => {
    const shared = (await (
      await request.post('/api/share', { data: { head: 'graduation-cap', message: 'Order filled.' } })
    ).json()) as { id: string };
    const card = await request.get(`/api/card/${shared.id}`);
    expect(await card.json()).toMatchObject({ id: shared.id, message: 'Order filled.' });

    const image = await request.get(`/api/image/p/${shared.id}.png`);
    expect(image.status()).toBe(200);
    const bytes = await image.body();
    expect(isPng(bytes)).toBe(true);
    const size = pngSize(bytes);
    // X center-crops link cards to ~1.91:1; a square card lost its notification.
    expect(size).toEqual({ width: 800, height: 420 });
  });

  test('a person opening a message PING sees it led with, and can send one back or remix', async ({ page, request }) => {
    const shared = (await (
      await request.post('/api/share', { data: { head: 'crown', message: 'Still holding.' } })
    ).json()) as { id: string };
    await page.goto(`/p/${shared.id}`);
    await expect(page.getByRole('heading', { level: 1, name: 'Still holding.' })).toBeVisible();

    await expect(page.getByRole('link', { name: 'Send one back' })).toHaveAttribute('href', '/?sendPing=1#builder');
    await expect(page.getByRole('link', { name: 'Remix this PING' })).toHaveAttribute(
      'href',
      expect.stringContaining('head=crown')
    );
  });

  test('the scraper gets OG tags sized for the banner card', async ({ request }) => {
    const shared = (await (
      await request.post('/api/share', { data: { head: 'crown', message: 'Seen.' } })
    ).json()) as { id: string };
    const bot = await request.get(`/p/${shared.id}`, { headers: { 'user-agent': 'Twitterbot/1.0' } });
    const html = await bot.text();
    expect(html).toContain('Seen.');
    expect(html).toMatch(/<meta[^>]+property="og:image:width"[^>]+content="800"/);
    expect(html).toMatch(/<meta[^>]+property="og:image:height"[^>]+content="420"/);
  });

  test('a message PING gets a badge in the gallery', async ({ page, request }) => {
    const index = (await (await request.get('/traits-index.json')).json()) as Record<string, string[]>;
    const pick = (category: string) => index[category][Math.floor(Math.random() * index[category].length)];
    const shared = (await (
      await request.post('/api/share', { data: { head: pick('head'), message: 'Bought the dip.' } })
    ).json()) as { id: string; cached: boolean };
    test.skip(shared.cached, 'random character + message already stored locally');

    await expect
      .poll(async () => ((await (await request.get('/api/gallery')).json()) as { items: { id: string }[] }).items[0]?.id)
      .toBe(shared.id);

    await page.goto('/community');
    const card = page.getByTestId('shared-gallery').locator(`a[href="/p/${shared.id}"]`);
    await expect(card.getByText('PING', { exact: true })).toBeVisible();
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
