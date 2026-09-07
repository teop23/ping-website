import * as React from 'react';
import { ImageResponse } from '@cloudflare/pages-plugin-vercel-og/api';
import type { APIRoute } from 'astro';
import {
  EMPTY_TRAIT_CHANCE,
  RENDER_BASE_IMAGE,
  cardGeometry,
  RENDER_TRAITS_DIR,
  TRAIT_ORDER,
  noStore,
  pickBgColor,
} from '../../_lib';
export const onRequestGet: APIRoute = async ({ request }) => {
    try {
        const url = new URL(request.url);
        const isBanner = url.searchParams.get('type') === 'banner';
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
    } = cardGeometry(isBanner);
        const traitOrder = TRAIT_ORDER;
        // Load the traits index JSON from the public directory
        const traitsIndexUrl = new URL('/traits-index.json', request.url);
        const traitsIndexRes = await fetch(traitsIndexUrl.href);
        const traitsIndex: Record<string, string[]> = await traitsIndexRes.json();

        const validCategories = Object.keys(traitsIndex);
        const traitSelectionsByCategory: { category: string; trait: string }[] = [];
        // Output differs every call anyway, so seed the colour off the roll.
        const bgColor = pickBgColor(String(Math.random()));

        // Roll each category, sometimes leaving it empty. The builder does the
        // same (EMPTY_TRAIT_CHANCE), so this matches what a real character looks
        // like instead of always wearing all eight slots - which also made this
        // endpoint the heaviest possible render on every single call.
        for (const category of validCategories) {
            const traits = traitsIndex[category];
            if (traits.length === 0) {
                return new Response(`No traits found for category "${category}"`, { status: 400 });
            }
            if (Math.random() < EMPTY_TRAIT_CHANCE) continue;
            const randomTrait = traits[Math.floor(Math.random() * traits.length)];
            traitSelectionsByCategory.push({ category, trait: randomTrait });
        }

        const selectedTraits = traitSelectionsByCategory.map(({ category, trait }) => {
            const traitKey = `trait-${trait}_${category}`;
            return `${baseURL}${RENDER_TRAITS_DIR}/${traitKey}.png`;
        });

        traitSelectionsByCategory.sort((a, b) => traitOrder.indexOf(a.category) - traitOrder.indexOf(b.category));

        // 🖼️ Generate the composited image
        return noStore(new ImageResponse(
            <div
                style={{
                    width: baseContainerWidth,
                    height: baseContainerHeight,
                    display: 'flex',
                    position: 'relative',
                    backgroundColor: bgColor,
                }}
            >
                <img
                    key="base-character"
                    src={baseCharacterImage}
                    width={baseImageSize}
                    height={baseImageSize}
                    style={{ position: 'absolute', top: baseImageTopOffset, left: baseImageLeftOffset }}
                />
                {selectedTraits.map((src, i) => (
                    <img
                        key={i}
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
            }
        ));
    } catch (err) {
        return new Response(`Internal error: ${err}`, { status: 500 });
    }
};
