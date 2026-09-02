export async function onRequestGet(context) {
  const state = crypto.randomUUID();
  const redirectUri = context.env.TIKTOK_REDIRECT_URI;
  if (!redirectUri) return new Response("Set TIKTOK_REDIRECT_URI before connecting TikTok.", { status: 500 });
  const auth = new URL("https://www.tiktok.com/v2/auth/authorize/");
  auth.search = new URLSearchParams({ client_key: context.env.TIKTOK_CLIENT_KEY, response_type: "code", scope: "user.info.basic,video.list", redirect_uri: redirectUri, state }).toString();
  return new Response(null, { status: 302, headers: { location: auth, "set-cookie": `tiktok_oauth_state=${state}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=600` } });
}
