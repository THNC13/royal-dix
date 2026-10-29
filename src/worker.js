// Entry point when the site is deployed as a Cloudflare Worker with static assets.
// Only /api/* runs code (rules assistant, photo album); every other request is answered with the site's files.
import { onRequestPost } from "../functions/api/ask.js";
import { handlePhotos } from "./photos.js";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/ask") {
      if (request.method !== "POST") {
        return new Response("Method not allowed", { status: 405, headers: { allow: "POST" } });
      }
      return onRequestPost({ request, env });
    }
    if (url.pathname === "/api/photos" || url.pathname.startsWith("/api/photos/")) {
      return handlePhotos(request, env, url);
    }
    return env.ASSETS.fetch(request);
  }
};
