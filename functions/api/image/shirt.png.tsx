import { ImageResponse } from '@cloudflare/pages-plugin-vercel-og/api';
import type { APIRoute } from 'astro';
import { RENDER_BASE_IMAGE, RENDER_TRAITS_DIR, cardGeometry, pickBgColor } from '../../_lib';
import * as React from 'react';

export const onRequestGet: APIRoute = async ({ request }) => {
    try {
        const url = new URL(request.url);
        const userPhotoUrl = url.searchParams.get("photo");
        const isBanner = url.searchParams.get("type") === "banner";
        if (!userPhotoUrl) {
            return new Response("Missing photo URL parameter", { status: 400 });
        }
        const baseURL = url.origin;
        const basePingImage = `${baseURL}${RENDER_BASE_IMAGE}`;
        const blankShirtTrait = `${baseURL}${RENDER_TRAITS_DIR}/trait-blank-tee_body.png`;
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
        // The photo sits on the tee. Both offsets are in character-space, so
        // they scale with the character rather than with the canvas.
        const scale = traitSize / 512;
        const pfpImageSize = 120 * scale;
        const pfpImageLeftOffset = (baseContainerWidth / 2) - (pfpImageSize / 2);
        const pfpImageTopOffset = traitImageTopOffset + 242 * scale;
        return new ImageResponse(
            <div
                style={{
                    width: baseContainerWidth,
                    height: baseContainerHeight,
                    display: 'flex',
                    position: 'relative',
                    backgroundColor: pickBgColor(userPhotoUrl),
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
                    width={traitSize}
                    height={traitSize}
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
