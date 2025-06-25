import * as React from 'react';
import { ImageResponse } from '@cloudflare/pages-plugin-vercel-og/api';
import type { APIRoute } from 'astro';

export const onRequestPost: APIRoute = async ({ request }) => {
  try {
    const arrayBuffer = await request.arrayBuffer();
    // Convert ArrayBuffer to base64 (browser/edge compatible)
    function arrayBufferToBase64(buffer: ArrayBuffer) {
      let binary = '';
      const bytes = new Uint8Array(buffer);
      const len = bytes.byteLength;
      for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return btoa(binary);
    }
    const userImageUrl = `data:image/jpeg;base64,${arrayBufferToBase64(arrayBuffer)}`;

    // These should point to your base image endpoints
    const basePingImage = "https://pingonsol.com/ping.png";
    const blankShirtTrait = 'https://pingonsol.com/traits/trait-blank-tee_body.png';

    // Position + size of the shirt area (adjust as needed)
    const shirtSize = 180;
    const shirtLeft = 165;
    const shirtTop = 290;

    return new ImageResponse(
      (
        <div
          style={{
            width: 512,
            height: 512,
            position: 'relative',
            display: 'flex',
          }}
        >
          <img
            src={basePingImage}
            width="512"
            height="512"
            style={{ position: 'absolute', top: 0, left: 0 }}
          />
          <img
            src={blankShirtTrait}
            width="512"
            height="512"
            style={{ position: 'absolute', top: 0, left: 0 }}
          />
          <div
            style={{
              position: 'absolute',
              top: shirtTop,
              left: shirtLeft,
              width: shirtSize,
              height: shirtSize,
              borderRadius: '50%',
              overflow: 'hidden',
            }}
          >
            <img
              src={userImageUrl}
              width={shirtSize}
              height={shirtSize}
              style={{ objectFit: 'cover' }}
            />
          </div>
        </div>
      ),
      {
        width: 512,
        height: 512,
      }
    );
  } catch (err) {
    console.error('Error generating image:', err);
    return new Response(err, { status: 500 });
  }
};
