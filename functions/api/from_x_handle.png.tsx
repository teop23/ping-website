import type { APIRoute } from 'astro';

type TwitterUserInfo = {
    username: string;
    name: string;
    description: string;
    followers_count: number;
    following_count: number;
    tweet_count: number;
    location: string;
    profile_image_url: string;
    profile_banner_url: string;
    created_at: string;
    user_id: string;
};

export const onRequestGet: APIRoute = async ({ request }) => {
    const { searchParams } = new URL(request.url);
    const handle = searchParams.get('handle');
    const type = searchParams.get('type') || '';

    if (!handle) {
        return new Response('Missing Twitter handle', { status: 400 });
    }

    try {
        // Example using unavatar.io (no API key required)
        const avatarURL = `https://unavatar.io/twitter/${handle}`;

        const userInfoEndpoint = `https://twittermedia.b-cdn.net/x-id/?id=${handle}`;

        const response = await fetch(userInfoEndpoint, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; TwitterBot/1.0; +https://twitter.com/bot)',
                "Origin": "https://snaplytics.io",
                "Referer": "https://snaplytics.io/"
            },
        });

        if (!response.ok) {
            return new Response('Failed to fetch user info', { status: response.status });
        }

        const userInfo: TwitterUserInfo = await response.json();
        const twitterPPUrl = userInfo.profile_image_url;
        console.log('Twitter profile picture URL:', twitterPPUrl);
        if (!twitterPPUrl) {
            return new Response('Twitter profile picture not found', { status: 404 });
        }

        const redirectUrl = `https://pingonsol.com/api/pp.png?${type ? `type=${type}&` : ''}photo=${encodeURIComponent(twitterPPUrl)}`;
        return Response.redirect(redirectUrl, 307); // Temporary redirect with method preserved
    } catch (err) {
        return new Response(`Error resolving handle: ${err}`, { status: 500 });
    }
};
