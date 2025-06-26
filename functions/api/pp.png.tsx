import { ImageResponse } from '@cloudflare/pages-plugin-vercel-og/api';
import type { APIRoute } from 'astro';
import * as React from 'react';

export const onRequestGet: APIRoute = async ({ request }) => {
    try {
        const baseImageScaleMultiplier = 1.4;
        const baseImageSize = 512 * baseImageScaleMultiplier;
        const url = new URL(request.url);
        const userPhotoUrl = url.searchParams.get("photo");
        const isBanner = url.searchParams.get("type") === "banner";
        console.log(isBanner, "isBanner");
        if (!userPhotoUrl) {
            return new Response("Missing photo URL parameter", { status: 400 });
        }
        const basePingImage = "https://pingonsol.com/ping.png";
        const blankShirtTrait = "https://pingonsol.com/traits/trait-blank-tee_body.png";
        const baseContainerWidth = isBanner ? 1200 : 512;
        const baseContainerHeight = isBanner ? 630 : 512;
        const baseImageTopOffset = isBanner ? (baseContainerHeight / 2 - baseImageSize / 2) : (-1 * (baseImageSize - 512) / 2);
        const baseImageLeftOffset = isBanner ? (baseContainerWidth / 2 - baseImageSize / 2) : (-1 * (baseImageSize - 512) / 2);
        const traitImageTopOffset = isBanner ? (baseContainerHeight / 2 - 256) : 0;
        const traitImageLeftOffset = isBanner ? (baseContainerWidth / 2 - 256) : 0;
        const pfpImageSize = 120;
        const pfpImageLeftOffset = isBanner ? (baseContainerHeight / 2 - 256) : 0 + (baseContainerWidth / 2) - (pfpImageSize / 2);
        const pfpImageTopOffset = isBanner ? (baseContainerWidth / 2 - 256) : 0 + 242;

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
                    src={basePingImage}
                    width={baseImageSize}
                    height={baseImageSize}
                    style={{ position: 'absolute', top: baseImageTopOffset, left: baseImageLeftOffset }}
                />
                <img
                    key={'pfp'}
                    src={blankShirtTrait}
                    width="512"
                    height="512"
                    style={{ position: 'absolute', top: traitImageTopOffset, left: traitImageLeftOffset }}
                />
                <img
                    src={userPhotoUrl}
                    width={pfpImageSize}
                    height={pfpImageSize}
                    style={{
                        position: "absolute",
                        top: pfpImageTopOffset,
                        left: pfpImageLeftOffset,
                        borderRadius: "50%",
                        objectFit: "cover",
                    }}
                />
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
        console.error("Error generating profile picture:", err);
        return new Response(`Internal error: ${err}`, { status: 500 });
    }
};
