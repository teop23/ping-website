import * as React from 'react';
import { ImageResponse } from '@cloudflare/pages-plugin-vercel-og/api';
import type { APIRoute } from 'astro';

export const onRequestPost: APIRoute = async ({ request }) => {
  try {
    const arrayBuffer = await request.arrayBuffer();
    const userImageUrl = `data:image/jpeg;base64,${Buffer.from(arrayBuffer).toString('base64')}`;

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
    return new Response(err, { status: 500 });
  }
};
