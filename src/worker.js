// Entry point when the site is deployed as a Cloudflare Worker with static assets.
// Only /api/ask runs code; every other request is answered with the site's files.
import { onRequestPost } from "../functions/api/ask.js";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/ask") {
      if (request.method !== "POST") {
        return new Response("Method not allowed", { status: 405, headers: { allow: "POST" } });
      }
      return onRequestPost({ request, env });
    }
    return env.ASSETS.fetch(request);
  }
};
