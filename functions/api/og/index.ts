export async function onRequest(context) {
    const url = new URL(context.request.url);
    const imageUrl = `https://pingonsol.com/api/image/custom.png${url.search}&type=banner`; // dynamic image

    const userAgent = context.request.headers.get("user-agent") || "";

    const isBot = /Twitterbot|Slackbot|Discordbot|facebookexternalhit|TelegramBot/i.test(userAgent);
    if (!isBot) {
        return Response.redirect("https://pingonsol.com/", 302);
    }
    return new Response(
        `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Share Preview</title>

        <!-- Twitter Card + Open Graph -->
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Check out my custom image!" />
        <meta name="twitter:description" content="Dynamic image generated just for you." />
        <meta name="twitter:image" content="${imageUrl}" />

        <meta property="og:title" content="Check out my custom image!" />
        <meta property="og:description" content="Dynamic image generated just for you." />
        <meta property="og:image" content="${imageUrl}" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="${url.href}" />
      </head>
      <body>
        <img src="${imageUrl}" alt="Generated Image" style="max-width: 100%;" />
      </body>
      </html>
    `,
        {
            headers: {
                "Content-Type": "text/html;charset=UTF-8",
                "Cache-Control": "public, max-age=600",
            },
        }
    );
}
