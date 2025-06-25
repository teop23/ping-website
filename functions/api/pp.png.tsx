// File: functions/api/generate/pp.png.tsx
import { ImageResponse } from '@cloudflare/pages-plugin-vercel-og/api';
import type { APIRoute } from 'astro';
import * as React from 'react';

export const onRequestGet: APIRoute = async ({ request }) => {
    try {
        const url = new URL(request.url);
        const userPhotoUrl = url.searchParams.get("photo");

        if (!userPhotoUrl) {
            return new Response("Missing photo URL parameter", { status: 400 });
        }
        const basePingImage = "https://pingonsol.com/ping.png";
        const blankShirtTrait = "https://pingonsol.com/traits/trait-blank-tee_body.png";

        return new ImageResponse(
            <div
                style={{
                    width: 512,
                    height: 512,
                    display: "flex",
                    position: "relative",
                }}
            >
                {/* Base Ping character */}
                <img
                    src={basePingImage}
                    width={512}
                    height={512}
                    style={{ position: "absolute", top: 0, left: 0 }}
                />

                {/* Shirt with blank space */}
                <img
                    src={blankShirtTrait}
                    width={512}
                    height={512}
                    style={{ position: "absolute", top: 0, left: 0 }}
                />

                {/* Circular cropped user photo */}
                <img
                    src={userPhotoUrl}
                    width={128}
                    height={128}
                    style={{
                        position: "absolute",
                        top: 270,  // 🔧 Adjust Y position
                        left: 190, // 🔧 Adjust X position
                        borderRadius: "50%",
                        objectFit: "cover",
                    }}
                />
            </div>,
            {
                width: 512,
                height: 512,
            }
        );
    } catch (err) {
        console.error("Error generating profile picture:", err);
        return new Response(`Internal error: ${err}`, { status: 500 });
    }
};
