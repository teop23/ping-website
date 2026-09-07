import * as React from 'react';
import { ImageResponse } from '@cloudflare/pages-plugin-vercel-og/api';
import type { APIRoute } from 'astro';
import {
  RENDER_BASE_IMAGE,
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
        const baseImageScaleMultiplier = 1.4;
        const baseContainerWidth = isBanner ? 1200 : 512;
        const baseContainerHeight = isBanner ? 630 : 512;
        const baseImageSize = 512 * baseImageScaleMultiplier;
        const baseImageTopOffset = isBanner ? (baseContainerHeight / 2 - baseImageSize / 2) : (-1 * (baseImageSize - 512) / 2);
        const baseImageLeftOffset = isBanner ? (baseContainerWidth / 2 - baseImageSize / 2) : (-1 * (baseImageSize - 512) / 2);
        const traitImageTopOffset = isBanner ? (baseContainerHeight / 2 - 256) : 0;
        const traitImageLeftOffset = isBanner ? (baseContainerWidth / 2 - 256) : 0;
        const traitOrder = TRAIT_ORDER;
        // Load the traits index JSON from the public directory
        const traitsIndexUrl = new URL('/traits-index.json', request.url);
        const traitsIndexRes = await fetch(traitsIndexUrl.href);
        const traitsIndex: Record<string, string[]> = await traitsIndexRes.json();

        const validCategories = Object.keys(traitsIndex);
        const traitSelectionsByCategory: { category: string; trait: string }[] = [];
        // Output differs every call anyway, so seed the colour off the roll.
        const bgColor = pickBgColor(String(Math.random()));

        //select random traits for each category
        for (const category of validCategories) {
            const traits = traitsIndex[category];
            if (traits.length === 0) {
                return new Response(`No traits found for category "${category}"`, { status: 400 });
            }
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
                        width="512"
                        height="512"
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
