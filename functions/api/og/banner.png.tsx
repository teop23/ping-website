import { ImageResponse } from '@cloudflare/pages-plugin-vercel-og/api';
import type { APIRoute } from 'astro';
import * as React from 'react';
import { OG_THEME, RENDER_BASE_IMAGE, RENDER_TRAITS_DIR, TRAIT_ORDER, paintsUnderBase } from '../../_lib';

// Derived from the real trait library, not hand-typed - see

/**
 * The share card for the site itself.
 *
 * The old one was a static PNG carrying a "$PING" wordmark in Solana's
 * blue-to-purple gradient, which is the wrong chain and the wrong palette.
 * This renders from the same trait art and the same tokens the site uses, so
 * it cannot drift from the design the way a hand-exported file does, and it
 * picks up new traits for free.
 *
 * Snapshotted to public/opengraph-ping.png at build time as well, because a
 * relative og:image is unreliable across scrapers and the production domain is
 * not known until launch.
 */

const CARD = { width: 1200, height: 630 };

/** Reads well at thumbnail size and shows off that traits layer. */
const FEATURED: Record<string, string> = {
  head: 'cowboy-hat',
  face: 'cool-glasses',
  body: 'ping-tee',
  right_hand: 'bitcoin',
};

export const onRequestGet: APIRoute = async ({ request }) => {
  try {
    const origin = new URL(request.url).origin;

    // satori cannot read woff2, which is all the site ships for the browser, so
    // the card loads TTF cuts of the same family. Without these it silently
    // falls back to a serif at a single weight, which is not the brand.
    const [regular, extraBold] = await Promise.all([
      fetch(`${origin}/fonts/Archivo-Regular.ttf`).then((r) => r.arrayBuffer()),
      fetch(`${origin}/fonts/Archivo-ExtraBold.ttf`).then((r) => r.arrayBuffer()),
    ]);

    // Auras would go behind the base art; FEATURED has none today, but the card
    // composites the same way the builder does so it stays right if one is added.
    const present = TRAIT_ORDER.filter((category) => FEATURED[category]);
    const srcFor = (category: string) =>
      `${origin}${RENDER_TRAITS_DIR}/trait-${FEATURED[category]}_${category}.png`;
    const underBase = present.filter(paintsUnderBase).map(srcFor);
    const overBase = present.filter((category) => !paintsUnderBase(category)).map(srcFor);

    // The character is composited exactly as the builder does it: the base is
    // drawn at 1.4x behind trait layers that fill the frame.
    const frame = 520;
    const baseSize = frame * 1.4;
    const characterLeft = CARD.width - frame - 90;
    const characterTop = (CARD.height - frame) / 2;

    return new ImageResponse(
      (
        <div
          style={{
            width: CARD.width,
            height: CARD.height,
            display: 'flex',
            position: 'relative',
            fontFamily: 'Archivo',
            backgroundColor: OG_THEME.background,
          }}
        >
          {/* Accent bar: the one piece of brand colour on the card. */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: 14,
              height: CARD.height,
              backgroundColor: OG_THEME.accent,
            }}
          />

          <div
            style={{
              position: 'absolute',
              left: 90,
              top: 190,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ fontSize: 104, fontWeight: 800, color: OG_THEME.ink, letterSpacing: -3 }}>
              $PING
            </div>
            <div style={{ fontSize: 34, color: OG_THEME.ink, opacity: 0.75, marginTop: 14 }}>
              Eight slots. Endless characters.
            </div>
            <div style={{ fontSize: 34, color: OG_THEME.ink, opacity: 0.75 }}>
              An open image API.
            </div>
            <div
              style={{
                marginTop: 34,
                display: 'flex',
                alignSelf: 'flex-start',
                backgroundColor: OG_THEME.accent,
                color: OG_THEME.accentInk,
                fontSize: 26,
                fontWeight: 700,
                padding: '12px 26px',
                borderRadius: 8,
              }}
            >
              Robinhood Chain
            </div>
          </div>

          {underBase.map((src) => (
            <img
              key={src}
              src={src}
              width={frame}
              height={frame}
              style={{ position: 'absolute', left: characterLeft, top: characterTop }}
            />
          ))}
          <img
            src={`${origin}${RENDER_BASE_IMAGE}`}
            width={baseSize}
            height={baseSize}
            style={{
              position: 'absolute',
              left: characterLeft - (baseSize - frame) / 2,
              top: characterTop - (baseSize - frame) / 2,
            }}
          />
          {overBase.map((src) => (
            <img
              key={src}
              src={src}
              width={frame}
              height={frame}
              style={{ position: 'absolute', left: characterLeft, top: characterTop }}
            />
          ))}
        </div>
      ),
      {
        width: CARD.width,
        height: CARD.height,
        fonts: [
          { name: 'Archivo', data: regular, weight: 400, style: 'normal' },
          { name: 'Archivo', data: extraBold, weight: 800, style: 'normal' },
        ],
      }
    );
  } catch (err) {
    return new Response(`Internal error: ${err}`, { status: 500 });
  }
};
