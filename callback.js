const TOKEN_KEY = "novaftbl__";

export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const cookies = Object.fromEntries((context.request.headers.get("cookie") || "").split("; ").filter(Boolean).map(value => value.split("=")));
  if (!url.searchParams.get("code") || url.searchParams.get("state") !== cookies.tiktok_oauth_state) return new Response("TikTok connection could not be verified. Please try again.", { status: 400 });
  const body = new URLSearchParams({ client_key: context.env.TIKTOK_CLIENT_KEY, client_secret: context.env.TIKTOK_CLIENT_SECRET, code: url.searchParams.get("code"), grant_type: "authorization_code", redirect_uri: context.env.TIKTOK_REDIRECT_URI });
  const response = await fetch("https://open.tiktokapis.com/v2/oauth/token/", { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body });
  if (!response.ok) return new Response("TikTok did not accept the connection. Check the app's redirect URL and scopes.", { status: 502 });
  const token = await response.json();
  await context.env.TIKTOK_TOKENS.put(TOKEN_KEY, JSON.stringify({ access_token: token.access_token, refresh_token: token.refresh_token, expires_at: Date.now() + token.expires_in * 1000 }));
  return Response.redirect(`${url.origin}/?connected=true`, 302);
}
