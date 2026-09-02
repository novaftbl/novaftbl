const TOKEN_KEY = "novaftbl__";
const jsonHeaders = {
  "content-type": "application/json; charset=UTF-8",
  "cache-control": "public, max-age=900, s-maxage=900",
};

export async function onRequestGet(context) {
  const token = await context.env.TIKTOK_TOKENS.get(TOKEN_KEY, { type: "json" });
  if (!token) return Response.json({ error: "TikTok is not connected yet." }, { status: 503, headers: jsonHeaders });

  const accessToken = await refreshIfNeeded(token, context.env);
  const response = await fetch(
    "https://open.tiktokapis.com/v2/video/list/?fields=id,title,video_description,duration,cover_image_url,share_url,embed_link,create_time",
    { method: "POST", headers: { Authorization: `Bearer ${accessToken}`, "content-type": "application/json" }, body: JSON.stringify({ max_count: 3 }) },
  );
  if (!response.ok) return Response.json({ error: "TikTok feed is temporarily unavailable." }, { status: 502, headers: jsonHeaders });
  const payload = await response.json();
  return Response.json({ videos: payload.data?.videos ?? [] }, { headers: jsonHeaders });
}

async function refreshIfNeeded(token, env) {
  if (token.expires_at > Date.now() + 10 * 60 * 1000) return token.access_token;
  const body = new URLSearchParams({ client_key: env.TIKTOK_CLIENT_KEY, client_secret: env.TIKTOK_CLIENT_SECRET, grant_type: "refresh_token", refresh_token: token.refresh_token });
  const response = await fetch("https://open.tiktokapis.com/v2/oauth/token/", { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body });
  if (!response.ok) throw new Error("TikTok token refresh failed");
  const refreshed = await response.json();
  const next = { access_token: refreshed.access_token, refresh_token: refreshed.refresh_token || token.refresh_token, expires_at: Date.now() + refreshed.expires_in * 1000 };
  await env.TIKTOK_TOKENS.put(TOKEN_KEY, JSON.stringify(next));
  return next.access_token;
}
