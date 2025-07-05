import * as React from 'react';
import { ImageResponse } from '@cloudflare/pages-plugin-vercel-og/api';
import type { APIRoute } from 'astro';
export const onRequestGet: APIRoute = async ({ request }) => {
    try {
        const url = new URL(request.url);
        const isBanner = url.searchParams.get('type') === 'banner';
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
        const getRandomBGColor = () => {
            const colors = {
                electricBlue: "#00FFFF",
                neonPurple: "#9D00FF",
                hotPink: "#FF007F",
                acidGreen: "#B0FF00",
                lavaOrange: "#FF4500",
                cyberYellow: "#FFD300",
                magentaShock: "#FF00FF",
                aquaMint: "#00FFCC",
                ultraviolet: "#5F00BA",
                coralFlash: "#FF5E5B"
            };

            const colorKeys = Object.keys(colors);
            const randomIndex = Math.floor(Math.random() * colorKeys.length);
            return colors[colorKeys[randomIndex]];
        }

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
            return `${baseURL}/traits/${traitKey}.png`;
        });

        traitSelectionsByCategory.sort((a, b) => traitOrder.indexOf(a.category) - traitOrder.indexOf(b.category));

        // 🖼️ Generate the composited image
        return new ImageResponse(
            <div
                style={{
                    width: baseContainerWidth,
                    height: baseContainerHeight,
                    display: 'flex',
                    position: 'relative',
                    backgroundColor: getRandomBGColor(),
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
