// File: functions/api/generate/pp.png.tsx
import { ImageResponse } from '@cloudflare/pages-plugin-vercel-og/api';
import type { APIRoute } from 'astro';
import * as React from 'react';

export const onRequestGet: APIRoute = async ({ request }) => {
    try {
        const baseImageScaleMultiplier = 1.4;
        const baseImageSize = 512 * baseImageScaleMultiplier;
        const baseContainerHeight = 512;
        const baseContainerWidth = 512;
        const url = new URL(request.url);
        const userPhotoUrl = url.searchParams.get("photo");

        if (!userPhotoUrl) {
            return new Response("Missing photo URL parameter", { status: 400 });
        }
        const basePingImage = "https://pingonsol.com/ping.png";
        const blankShirtTrait = "https://pingonsol.com/traits/trait-blank-tee_body.png";
        const baseImageTopOffset = (-1 * (baseImageSize - 512) / 2);
        const baseImageLeftOffset = (-1 * (baseImageSize - 512) / 2);
        const traitImageTopOffset = 0;
        const traitImageLeftOffset = 0;
        const pfpImageSize = 120;
        const pfpImageLeftOffset = (baseContainerWidth / 2) - (pfpImageSize / 2);
        const pfpImageTopOffset = 242;

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
