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
        //example response
        /**
         * {
      "username": "fuelkek",
      "name": "Fuel",
      "description": "I just searched your SOL address, I saw your trading history and was wondering if you are trying to be the first on-chain clown?",
      "followers_count": 132089,
      "following_count": 13601,
      "tweet_count": 14783,
      "location": "Aurahalla ",
      "profile_image_url": "https://pbs.twimg.com/profile_images/1934895131812823040/R2c7RMTZ_400x400.jpg",
      "profile_banner_url": "https://pbs.twimg.com/profile_banners/1518671564916629505/1732537335",
      "created_at": "Mon Apr 25 19:21:53 +0000 2022",
      "user_id": "1518671564916629505"
    }
         */
        const twitterPPUrl = userInfo.profile_image_url;
        console.log('Twitter profile picture URL:', twitterPPUrl);
        if (!twitterPPUrl) {
            return new Response('Twitter profile picture not found', { status: 404 });
        }

        const redirectUrl = `https://pingonsol.com/api/pp.png?photo=${encodeURIComponent(twitterPPUrl)}`;
        return Response.redirect(redirectUrl, 307); // Temporary redirect with method preserved
    } catch (err) {
        return new Response(`Error resolving handle: ${err}`, { status: 500 });
    }
};
