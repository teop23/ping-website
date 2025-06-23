import * as React from 'react';
import { ImageResponse } from '@cloudflare/pages-plugin-vercel-og/api';
import type { APIRoute } from 'astro';
export const onRequestGet: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const queryParams = Object.fromEntries(url.searchParams.entries());
    //one param might be type, filter out any non-trait params
    const traitParams = Object.fromEntries(
      Object.entries(queryParams).filter(([key]) => key !== 'type' && key !== 'ts')
    );
    const isBanner = queryParams.type === 'banner';
    const baseURL = "https://pingonsol.com";
    const baseCharacterImage = `${baseURL}/ping.png`;
    const baseImageScaleMultiplier = 1.4;
    const baseContainerWidth = isBanner ? 1200 : 512;
    const baseContainerHeight = isBanner ? 630 : 512;
    const baseImageSize = 512 * baseImageScaleMultiplier;
    const baseImageTopOffset = isBanner ? (baseContainerHeight / 2 - baseImageSize / 2) : (-1 * (baseImageSize - 512) / 2);
    const baseImageLeftOffset = isBanner ? (baseContainerWidth / 2 - baseImageSize / 2) : (-1 * (baseImageSize - 512) / 2);
    const traitImageTopOffset = isBanner ? (baseContainerHeight / 2 - 256) : 0;
    const traitImageLeftOffset = isBanner ? (baseContainerWidth / 2 - 256) : 0;
    const traitOrder = ['aura', 'body', 'face', 'mouth', 'head', 'right_hand', 'left_hand', 'accessory'];
    // Load the traits index JSON from the public directory
    const traitsIndexUrl = new URL('/traits-index.json', request.url);
    const traitsIndexRes = await fetch(traitsIndexUrl.href);
    const traitsIndex: Record<string, string[]> = await traitsIndexRes.json();

    const validCategories = Object.keys(traitsIndex);
    const traitSelectionsByCategory: { category: string; trait: string }[] = [];

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

    traitSelectionsByCategory.sort((a, b) => traitOrder.indexOf(a.category) - traitOrder.indexOf(b.category));

    const selectedTraits = traitSelectionsByCategory.map(({ category, trait }) => {
      const traitKey = `trait-${trait}_${category}`;
      return `${baseURL}/traits/${traitKey}.png`;
    });

    // 🖼️ Generate the composited image
    return new ImageResponse(
      <div
        style={{
          width: baseContainerWidth,
          height: baseContainerHeight,
          display: 'flex',
          position: 'relative',
          backgroundColor: "#fff",
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
        headers: {
          'Content-Type': 'image/png',
        }
      }
    );
  } catch (err) {
    return new Response(`Internal error: ${err}`, { status: 500 });
  }
};
