import * as React from 'react';
import { ImageResponse } from '@cloudflare/pages-plugin-vercel-og/api';
import type { APIRoute } from 'astro';
export const onRequestGet: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const queryParams = Object.fromEntries(url.searchParams.entries());
    const baseURL = "https://pingonsol.com";
    const baseCharacterImage = `${baseURL}/ping.png`;
    const baseImageScaleMultiplier = 1.4;
    const baseImageSize = 512 * baseImageScaleMultiplier;
    const baseImageOffset = -1 * (baseImageSize - 512) / 2;
    const traitOrder = ['aura', 'body', 'face', 'mouth', 'head', 'right_hand', 'left_hand', 'accessory'];
    // Load the traits index JSON from the public directory
    const traitsIndexUrl = new URL('/traits-index.json', request.url);
    const traitsIndexRes = await fetch(traitsIndexUrl.href);
    const traitsIndex: Record<string, string[]> = await traitsIndexRes.json();

    const validCategories = Object.keys(traitsIndex);
    const traitSelectionsByCategory: { category: string; trait: string }[] = [];

    // ✅ Validate all query parameter keys (categories)
    for (const [category, trait] of Object.entries(queryParams)) {
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
          width: 512,
          height: 512,
          display: 'flex',
          position: 'relative',
        }}
      >
        <img
          key="base-character"
          src={baseCharacterImage}
          width={baseImageSize}
          height={baseImageSize}
          style={{ position: 'absolute', top: baseImageOffset, left: baseImageOffset }}
        />
        {selectedTraits.map((src, i) => (
          <img
            key={i}
            src={src}
            width="512"
            height="512"
            style={{ position: 'absolute', top: 0, left: 0 }}
          />
        ))}
      </div>,
      {
        width: 512,
        height: 512,
      }
    );
  } catch (err) {
    return new Response(`Internal error: ${err}`, { status: 500 });
  }
};
