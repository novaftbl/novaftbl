# novaftbl__ live site

This is a Cloudflare Pages site. The front end is in `outputs/`; the private TikTok connection lives in `functions/api/`.

## One-time setup

1. Create a **Cloudflare Pages** project from this folder. Set the build command to `exit 0` and the output directory to `outputs`.
2. In Cloudflare, create a KV namespace called `TIKTOK_TOKENS`, then bind it to the Pages project using that exact variable name.
3. In the Pages project settings, add these encrypted secrets: `TIKTOK_CLIENT_KEY`, `TIKTOK_CLIENT_SECRET`, and `TIKTOK_REDIRECT_URI`.
4. In the TikTok Developer Portal, create an app with **Login Kit** and **Display API**, request the `user.info.basic` and `video.list` scopes, and register the exact URL `https://YOUR-SITE.pages.dev/api/callback` as its redirect URI.
5. Once the deployment is live, visit `https://YOUR-SITE.pages.dev/api/connect` while signed in as **@novaftbl__** and approve the connection.

The home page now requests `/api/latest`, which privately fetches the newest three TikToks and updates the cards. If TikTok is not connected or unavailable, the original design cards remain in place.

Never put a TikTok client secret, access token, or refresh token in `outputs/index.html` or a Git repository. The Worker keeps them server-side and rotates the access token automatically.
