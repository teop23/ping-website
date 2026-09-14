import type { APIRoute } from 'astro';
import { isValidXHandle, unavatarUrl, UNAVATAR_TTL_SECONDS } from '../../_lib';

export const onRequestGet: APIRoute = async ({ request }) => {
    const { searchParams, origin } = new URL(request.url);
    const handle = searchParams.get('handle');
    const type = searchParams.get('type') === 'banner' ? 'banner' : '';

    if (!handle) {
        return new Response('Missing Twitter handle', { status: 400 });
    }

    if (!isValidXHandle(handle)) {
        return new Response('Invalid Twitter handle', { status: 400 });
    }

    const avatarUrl = unavatarUrl(handle);

    let response: Response;
    try {
        response = await fetch(avatarUrl);
    } catch (err) {
        console.error('unavatar lookup failed:', err);
        return new Response('Error resolving handle', { status: 502 });
    }

    if (response.status === 404) {
        return new Response('Twitter profile picture not found', { status: 404 });
    }

    if (!response.ok) {
        return new Response('Failed to fetch user info', { status: 502 });
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.startsWith('image/')) {
        return new Response('Failed to fetch user info', { status: 502 });
    }

    const redirectUrl = `${origin}/api/image/shirt.png?${type ? `type=${type}&` : ''}photo=${encodeURIComponent(avatarUrl)}`;
    // The avatar URL depends only on the handle, so cache this redirect for
    // UNAVATAR_TTL_SECONDS - a repeat
    // request never re-touches the rate-limited upstream.
    return new Response(null, {
        status: 307,
        headers: {
            Location: redirectUrl,
            'Cache-Control': `public, max-age=${UNAVATAR_TTL_SECONDS}`,
        },
    });
};
