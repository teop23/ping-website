import * as React from 'react';
import { ImageResponse } from '@cloudflare/pages-plugin-vercel-og/api';
import type { APIRoute } from 'astro';
import {
  CAPTION_INSET,
  OG_THEME,
  cardGeometry,
  PING_MESSAGES,
  cleanPingMessage,
  renderArt,
  pickBgColor,
  splitAtBase,
  seedFromParams,
} from '../../_lib';

/** The lock-screen phone on a captioned banner, left of the character. */
const PHONE = { left: CAPTION_INSET, top: 34, width: 318, radius: 46, bezel: 9 };
/** The notification card: a small icon on the header row, the message full width below. */
const NOTIFICATION = { padding: 16, icon: 32 };
/** Phone width less the bezels, the screen's 14 padding a side and the card's own padding. */
const NOTIFICATION_TEXT_WIDTH = PHONE.width - 2 * PHONE.bezel - 2 * 14 - 2 * NOTIFICATION.padding;

// Query params that shape the image rather than name a trait.
const OPTION_PARAMS = ['type', 'ts', 'caption', 'message'];

export const onRequestGet: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const queryParams = Object.fromEntries(url.searchParams.entries());
    //one param might be type, filter out any non-trait params
    const traitParams = Object.fromEntries(
      Object.entries(queryParams).filter(([key]) => !OPTION_PARAMS.includes(key))
    );
    const isBanner = queryParams.type === 'banner';
    // The phone notification. Opt-in and banner-only: /api/share asks for it
    // on its one render per card, while the open API and the bot-scraped
    // legacy route keep the cheaper text-free render.
    const captioned = isBanner && queryParams.caption === '1';

    // A PING's message prints in the captioned banner's phone notification.
    // It reaches here from /api/share (already cleaned) or directly from this
    // open endpoint, which applies the same rules itself.
    const message = queryParams.message === undefined ? PING_MESSAGES[0] : cleanPingMessage(queryParams.message);
    if (message === null) {
      return new Response('message must be 1-40 plain characters with no links or handles', { status: 400 });
    }

    const baseURL = new URL(request.url).origin;
    // The banner draws smaller than the square, so it gets smaller art.
    const art = renderArt(isBanner);
    const baseCharacterImage = `${baseURL}${art.baseImage}`;
    const {
      width: baseContainerWidth,
      height: baseContainerHeight,
      character: traitSize,
      baseSize: baseImageSize,
      baseTop: baseImageTopOffset,
      baseLeft: baseImageLeftOffset,
      traitTop: traitImageTopOffset,
      traitLeft: traitImageLeftOffset,
    } = cardGeometry(isBanner, captioned);
    // Load the traits index JSON from the public directory
    const traitsIndexUrl = new URL('/traits-index.json', request.url);
    const traitsIndexRes = await fetch(traitsIndexUrl.href);
    const traitsIndex: Record<string, string[]> = await traitsIndexRes.json();

    const validCategories = Object.keys(traitsIndex);
    const traitSelectionsByCategory: { category: string; trait: string }[] = [];
    // Seeded on the traits alone, so the square and the banner of one character
    // match, and a card Twitter scraped matches what the user later opens.
    const bgColor = pickBgColor(seedFromParams(url.searchParams, OPTION_PARAMS));

    // ✅ Validate all query parameter keys (categories)
    for (const [category, trait] of Object.entries(traitParams)) {
      if (!validCategories.includes(category)) {
        return new Response(`Invalid category "${category}". Valid categories are: ${validCategories.join(', ')}`, {
          status: 400,
        });
      }

      if (!traitsIndex[category].includes(trait)) {
        return new Response(`Invalid trait "${trait}" for category "${category}", valid traits are: ${traitsIndex[category].join(', ')}`, {
          status: 400,
        });
      }

      traitSelectionsByCategory.push({ category, trait });
    }

    // Auras go behind the penguin, the rest in front of it, both in paint order.
    const toUrl = ({ category, trait }: { category: string; trait: string }) =>
      `${baseURL}${art.traitsDir}/trait-${trait}_${category}.png`;
    const { under, over } = splitAtBase(traitSelectionsByCategory);
    const underBase = under.map(toUrl);
    const overBase = over.map(toUrl);

    // satori cannot read woff2; the TTF cuts are the notification's fonts.
    // The Inter subset covers ASCII and Latin-1 but not Latin Extended-A/B,
    // which MESSAGE_CHARS allows, so Archivo joins as a fallback family only
    // for a message that needs it: every font parsed is CPU off a tight budget.
    const loadFont = (file: string) => fetch(`${baseURL}/fonts/${file}`).then((r) => r.arrayBuffer());
    const needsFallback = /[^\x20-\xFF]/.test(message);
    const fonts = captioned
      ? await Promise.all([
          loadFont('Inter-Regular.ttf'),
          loadFont('Inter-SemiBold.ttf'),
          needsFallback ? loadFont('Archivo-Regular.ttf') : null,
        ]).then(([regular, semiBold, archivo]) => [
          { name: 'Inter', data: regular, weight: 400 as const, style: 'normal' as const },
          { name: 'Inter', data: semiBold, weight: 600 as const, style: 'normal' as const },
          ...(archivo ? [{ name: 'Archivo', data: archivo, weight: 400 as const, style: 'normal' as const }] : []),
        ])
      : undefined;
    const iconUrl = `${baseURL}/favicon-180.png`;

    // 🖼️ Generate the composited image
    return new ImageResponse(
      <div
        style={{
          width: baseContainerWidth,
          height: baseContainerHeight,
          display: 'flex',
          position: 'relative',
          backgroundColor: bgColor,
        }}
      >
        {captioned && (
          // A phone peeking up from the bottom edge, lock screen on, one
          // notification from PING. Trait names used to sit here; nobody read
          // the small pill above them as a phone notification.
          <div
            style={{
              position: 'absolute',
              left: PHONE.left,
              top: PHONE.top,
              width: PHONE.width,
              height: baseContainerHeight - PHONE.top + PHONE.radius,
              display: 'flex',
              padding: PHONE.bezel,
              borderRadius: PHONE.radius,
              backgroundColor: OG_THEME.ink,
              fontFamily: 'Inter, Archivo',
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                borderRadius: PHONE.radius - PHONE.bezel,
                backgroundImage: 'linear-gradient(180deg, #2B3A31 0%, #16211B 100%)',
                padding: '12px 14px 0',
              }}
            >
              <div style={{ width: 84, height: 24, borderRadius: 12, backgroundColor: OG_THEME.ink }} />
              <div style={{ fontSize: 72, fontWeight: 600, color: '#F3F1EA', lineHeight: 1, marginTop: 14, letterSpacing: -2 }}>
                9:41
              </div>
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  marginTop: 22,
                  padding: NOTIFICATION.padding,
                  borderRadius: 24,
                  backgroundColor: 'rgba(255,255,255,0.94)',
                  color: OG_THEME.ink,
                }}
              >
                {/* Icon and app name share the header row; the message gets the full width under it. */}
                <div style={{ display: 'flex', alignItems: 'center', width: NOTIFICATION_TEXT_WIDTH }}>
                  <img src={iconUrl} width={NOTIFICATION.icon} height={NOTIFICATION.icon} style={{ borderRadius: 8 }} />
                  <div style={{ fontSize: 18, fontWeight: 600, marginLeft: 10, flexGrow: 1 }}>PING</div>
                  <div style={{ fontSize: 15, fontWeight: 400, color: '#5E6B63' }}>now</div>
                </div>
                {/* satori sizes text to its content, not the space left, so the width is explicit. */}
                <div style={{ display: 'flex', width: NOTIFICATION_TEXT_WIDTH, fontSize: 26, fontWeight: 600, lineHeight: 1.18, marginTop: 10 }}>
                  {message}
                </div>
              </div>
            </div>
          </div>
        )}
        {underBase.map((src) => (
          <img
            key={src}
            src={src}
            width={traitSize}
            height={traitSize}
            style={{ position: 'absolute', top: traitImageTopOffset, left: traitImageLeftOffset }}
          />
        ))}
        <img
          key="base-character"
          src={baseCharacterImage}
          width={baseImageSize}
          height={baseImageSize}
          style={{ position: 'absolute', top: baseImageTopOffset, left: baseImageLeftOffset }}
        />
        {overBase.map((src) => (
          <img
            key={src}
            src={src}
            width={traitSize}
            height={traitSize}
            style={{ position: 'absolute', top: traitImageTopOffset, left: traitImageLeftOffset }}
          />
        ))}
      </div>,
      {
        width: baseContainerWidth,
        height: baseContainerHeight,
        fonts,
      }
    );
  } catch (err) {
    console.error('custom.png render failed:', err);
    return new Response('Internal error', { status: 500 });
  }
};
