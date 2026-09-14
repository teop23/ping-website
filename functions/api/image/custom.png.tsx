import * as React from 'react';
import { ImageResponse } from '@cloudflare/pages-plugin-vercel-og/api';
import type { APIRoute } from 'astro';
import {
  CAPTION_INSET,
  OG_THEME,
  RENDER_BASE_IMAGE,
  captionFromTraits,
  cardGeometry,
  PING_MESSAGES,
  isValidPingMessage,
  RENDER_TRAITS_DIR,
  pickBgColor,
  splitAtBase,
  seedFromParams,
} from '../../_lib';
// Query params that shape the image rather than name a trait.
/** Left margin of a captioned banner's text column. */
const CAPTION_LEFT = CAPTION_INSET;

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
    // Trait names printed on the card, so a saved or screenshotted image keeps
    // the context the page title carries. Opt-in and banner-only: /api/share
    // asks for it on its one render per character, while the open API and the
    // bot-scraped legacy route keep the cheaper text-free render.
    const captioned = isBanner && queryParams.caption === '1';

    // A PING's message prints in the captioned banner's notification pill.
    // Presets only - it reaches here from /api/share (already validated) or
    // directly from this open endpoint, which validates it itself. It used to
    // be a separate square layout with the notification on top, which X's
    // ~1.91:1 center crop cut off entirely.
    if (queryParams.message !== undefined && !isValidPingMessage(queryParams.message)) {
      return new Response('message must be one of the PING presets', { status: 400 });
    }
    const message = queryParams.message || PING_MESSAGES[0];

    const baseURL = new URL(request.url).origin;
    const baseCharacterImage = `${baseURL}${RENDER_BASE_IMAGE}`;
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
      `${baseURL}${RENDER_TRAITS_DIR}/trait-${trait}_${category}.png`;
    const { under, over } = splitAtBase(traitSelectionsByCategory);
    const underBase = under.map(toUrl);
    const overBase = over.map(toUrl);

    // satori cannot read woff2; the TTF cuts are the same family the site uses.
    const fonts = captioned
      ? await Promise.all([
          fetch(`${baseURL}/fonts/Archivo-Regular.ttf`).then((r) => r.arrayBuffer()),
          fetch(`${baseURL}/fonts/Archivo-ExtraBold.ttf`).then((r) => r.arrayBuffer()),
        ]).then(([regular, extraBold]) => [
          { name: 'Archivo', data: regular, weight: 400 as const, style: 'normal' as const },
          { name: 'Archivo', data: extraBold, weight: 800 as const, style: 'normal' as const },
        ])
      : undefined;
    const caption = captionFromTraits(new URLSearchParams(traitParams));
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
          <div
            style={{
              position: 'absolute',
              left: CAPTION_LEFT,
              top: 0,
              // The gap keeps the notification pill off an aura's square edge.
              width: traitImageLeftOffset - CAPTION_LEFT - 32,
              height: baseContainerHeight,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              fontFamily: 'Archivo',
              color: OG_THEME.ink,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 16px 12px 12px',
                borderRadius: 18,
                backgroundColor: '#FFFFFF',
                border: '1px solid #DDD9CC',
              }}
            >
              <img src={iconUrl} width={48} height={48} style={{ borderRadius: 11 }} />
              <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 12, flexGrow: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <div style={{ fontSize: 17, fontWeight: 800 }}>PING</div>
                  <div style={{ fontSize: 14, color: '#5E6B63' }}>now</div>
                </div>
                <div style={{ fontSize: 22, lineHeight: 1.15, marginTop: 2 }}>{message}</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', marginTop: 22 }}>
              {caption.names.length === 0 ? (
                <div style={{ fontSize: 34, fontWeight: 800, lineHeight: 1.15 }}>PING</div>
              ) : (
                caption.names.map((name) => (
                  // The gap separates two names; a name that wraps stays tight.
                  <div key={name} style={{ fontSize: 34, fontWeight: 800, lineHeight: 1.05, marginBottom: 8 }}>
                    {name}
                  </div>
                ))
              )}
            </div>
            {caption.more > 0 && (
              <div style={{ fontSize: 22, opacity: 0.7, marginTop: 10 }}>{`+${caption.more} more`}</div>
            )}
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
