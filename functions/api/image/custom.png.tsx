import * as React from 'react';
import { ImageResponse } from '@cloudflare/pages-plugin-vercel-og/api';
import type { APIRoute } from 'astro';
import {
  RENDER_BASE_IMAGE,
  cardGeometry,
  RENDER_TRAITS_DIR,
  pickBgColor,
  splitAtBase,
  seedFromParams,
} from '../../_lib';
export const onRequestGet: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const queryParams = Object.fromEntries(url.searchParams.entries());
    //one param might be type, filter out any non-trait params
    const traitParams = Object.fromEntries(
      Object.entries(queryParams).filter(([key]) => key !== 'type' && key !== 'ts')
    );
    const isBanner = queryParams.type === 'banner';
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
    // Load the traits index JSON from the public directory
    const traitsIndexUrl = new URL('/traits-index.json', request.url);
    const traitsIndexRes = await fetch(traitsIndexUrl.href);
    const traitsIndex: Record<string, string[]> = await traitsIndexRes.json();

    const validCategories = Object.keys(traitsIndex);
    const traitSelectionsByCategory: { category: string; trait: string }[] = [];
    // Seeded on the traits alone, so the square and the banner of one character
    // match, and a card Twitter scraped matches what the user later opens.
    const bgColor = pickBgColor(seedFromParams(url.searchParams, ['type', 'ts']));

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
      }
    );
  } catch (err) {
    return new Response(`Internal error: ${err}`, { status: 500 });
  }
};
