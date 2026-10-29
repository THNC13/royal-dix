// Photo album API for the "Memories" page. Photos live in a Cloudflare KV namespace bound as PHOTOS.
// Anyone with the link can add a photo. Whoever uploads a photo can delete it (their browser keeps a private token);
// the team code (TEAM_CODE secret) can delete any photo.
const MAX_BYTES = 2.5 * 1024 * 1024;   // the page shrinks photos first, so real uploads are far smaller
const MAX_PHOTOS = 500;
const json = (obj, status = 200, extra = {}) =>
  new Response(JSON.stringify(obj), { status, headers: { "content-type": "application/json", "cache-control": "no-store", ...extra } });

function sniff(b) {                         // trust the bytes, not the filename
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "image/jpeg";
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return "image/png";
  if (b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 && b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50) return "image/webp";
  return null;
}
const sha = async (t) => [...new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t)))].map((x) => x.toString(16).padStart(2, "0")).join("");
const clean = (s, n) => String(s || "").replace(/[\u0000-\u001f<>]/g, " ").trim().slice(0, n);

export async function handlePhotos(request, env, url) {
  const kv = env.PHOTOS;
  if (!kv) return json({ error: "The photo album isn't switched on yet." }, 503);
  const parts = url.pathname.split("/").filter(Boolean);   // ["api","photos",id?]
  const id = parts[2];

  if (!id) {
    if (request.method === "GET") {
      const list = await kv.list({ prefix: "p:", limit: 1000 });
      const photos = list.keys.map((k) => ({ id: k.name.slice(2), ...(k.metadata || {}) })).sort((a, b) => (a.id < b.id ? 1 : -1));
      return json({ photos });
    }
    if (request.method === "POST") {
      let form;
      try { form = await request.formData(); } catch { return json({ error: "Could not read the upload." }, 400); }
      const file = form.get("photo");
      if (!file || typeof file === "string") return json({ error: "No photo found." }, 400);
      if (file.size > MAX_BYTES) return json({ error: "That photo is too big." }, 413);
      const bytes = new Uint8Array(await file.arrayBuffer());
      const type = sniff(bytes);
      if (!type) return json({ error: "Only JPG, PNG or WebP photos, please." }, 415);
      const count = (await kv.list({ prefix: "p:", limit: MAX_PHOTOS + 1 })).keys.length;
      if (count >= MAX_PHOTOS) return json({ error: "The album is full." }, 507);
      const ts = Date.now();
      const nid = String(ts).padStart(13, "0") + "-" + crypto.randomUUID().slice(0, 6);
      const meta = { v: 2, ts, by: clean(form.get("name"), 30), caption: clean(form.get("caption"), 140), type };
      const token = crypto.randomUUID() + crypto.randomUUID();
      await kv.put("k:" + nid, await sha(token));
      await kv.put("p:" + nid, bytes, { metadata: meta });
      return json({ ok: true, id: nid, token, ...meta }, 201);
    }
    return json({ error: "Method not allowed" }, 405, { allow: "GET, POST" });
  }

  if (!/^[0-9]{13}-[0-9a-f]{6}$/.test(id)) return json({ error: "Not found" }, 404);
  if (request.method === "GET") {
    const { value, metadata } = await kv.getWithMetadata("p:" + id, { type: "arrayBuffer" });
    if (!value) return json({ error: "Not found" }, 404);
    return new Response(value, { headers: { "content-type": (metadata && metadata.type) || "image/jpeg", "cache-control": "public, max-age=31536000, immutable", "x-content-type-options": "nosniff" } });
  }
  if (request.method === "DELETE") {
    const code = request.headers.get("x-team-code"), tok = request.headers.get("x-delete-token");
    let ok = false;
    if (!(await kv.get("k:" + id))) ok = true;   // early photos from before owners were tracked: anyone can remove them
    if (tok) { const h = await kv.get("k:" + id); ok = !!h && h === (await sha(tok)); }
    if (!ok && code) ok = !!env.TEAM_CODE && code === env.TEAM_CODE;
    if (!ok) return json({ error: tok ? "Only the person who added this photo can delete it." : env.TEAM_CODE ? "Wrong team code." : "Deleting isn't set up." }, tok || env.TEAM_CODE ? 401 : 403);
    await kv.delete("p:" + id); await kv.delete("k:" + id);
    return json({ ok: true });
  }
  return json({ error: "Method not allowed" }, 405, { allow: "GET, DELETE" });
}
