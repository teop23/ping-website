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
        console.log("baseContainerWidth", baseContainerWidth, "baseContainerHeight", baseContainerHeight);
        const baseImageTopOffset = isBanner ? (baseContainerHeight / 2 - baseImageSize / 2) : (-1 * (baseImageSize - 512) / 2);
        const baseImageLeftOffset = isBanner ? (baseContainerWidth / 2 - baseImageSize / 2) : (-1 * (baseImageSize - 512) / 2);
        const traitImageTopOffset = isBanner ? (baseContainerHeight / 2 - 256) : 0;
        const traitImageLeftOffset = isBanner ? (baseContainerWidth / 2 - 256) : 0;
        const pfpImageSize = 120;
        const pfpImageLeftOffset = (baseContainerWidth / 2) - (pfpImageSize / 2);
        const pfpImageTopOffset = (isBanner ? (baseContainerHeight / 2 - 256) : 0) + 242;
        console.log("pfpImageTopOffset", pfpImageTopOffset, "pfpImageLeftOffset", pfpImageLeftOffset);
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
            }
        );
    } catch (err) {
        console.error("Error generating profile picture:", err);
        return new Response(`Internal error: ${err}`, { status: 500 });
    }
};
