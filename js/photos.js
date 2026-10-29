/* Memories page: shrink photos on the phone, upload them, show the album. */
(function () {
  "use strict";
  var K = window.RDK, $ = K.$, esc = K.esc;
  var album = $("album"), msg = $("up-msg"), file = $("up-file");
  var photos = [], code = "";
  var mine = {};   // photos added from this phone: id -> private delete token
  try { mine = JSON.parse(localStorage.getItem("rd-mine") || "{}") || {}; } catch (e) { mine = {}; }
  var keep = function () { try { localStorage.setItem("rd-mine", JSON.stringify(mine)); } catch (e) {} };

  var say = function (t, bad) { msg.textContent = t || ""; msg.className = "up-msg" + (bad ? " bad" : ""); };

  function load() {
    fetch("/api/photos", { cache: "no-store" })
      .then(function (r) {
        if (r.status === 503) { throw new Error("off"); }
        if (!r.ok) throw new Error("x");
        return r.json();
      })
      .then(function (d) { photos = d.photos || []; draw(); })
      .catch(function (e) {
        $("album-empty").hidden = false;
        $("album-empty").textContent = e.message === "off" ? "The photo album isn't switched on yet. Check back soon." : "Couldn't load the album. Pull down to refresh.";
      });
  }

  function draw() {
    $("album-empty").hidden = photos.length > 0;
    if (!photos.length) $("album-empty").textContent = "No photos yet. Be the first to add one.";
    album.innerHTML = photos.map(function (p, i) {
      return '<button type="button" class="ph" data-i="' + i + '" aria-label="Open photo' + (p.caption ? ": " + esc(p.caption) : "") + '">' +
        '<img loading="lazy" decoding="async" src="/api/photos/' + esc(p.id) + '" alt="' + esc(p.caption || "Royal Dix photo") + '"></button>';
    }).join("");
  }

  // ----- shrink a photo to about 1600px wide JPEG before sending (saves data and storage) -----
  function shrink(f) {
    return new Promise(function (resolve, reject) {
      var done = function (img, w, h) {
        var max = 1600, sc = Math.min(1, max / Math.max(w, h));
        var c = document.createElement("canvas"); c.width = Math.round(w * sc); c.height = Math.round(h * sc);
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
        c.toBlob(function (b) { b ? resolve(b) : reject(new Error("shrink")); }, "image/jpeg", 0.82);
      };
      if (window.createImageBitmap) {
        createImageBitmap(f, { imageOrientation: "from-image" }).then(function (bm) { done(bm, bm.width, bm.height); }, fallback);
      } else fallback();
      function fallback() {
        var img = new Image(), u = URL.createObjectURL(f);
        img.onload = function () { URL.revokeObjectURL(u); done(img, img.naturalWidth, img.naturalHeight); };
        img.onerror = function () { reject(new Error("read")); };
        img.src = u;
      }
    });
  }

  function upload(files) {
    var list = Array.prototype.slice.call(files).filter(function (f) { return /^image\//.test(f.type) || /\.(jpe?g|png|webp|heic)$/i.test(f.name); });
    if (!list.length) { say("Pick a photo to add.", true); return; }
    var ok = 0, i = 0;
    var next = function () {
      if (i >= list.length) {
        say(ok ? (ok === 1 ? "Added! Looking good." : ok + " photos added!") : "Nothing was added.", !ok);
        file.value = ""; $("up-cap").value = ""; load(); return;
      }
      say("Adding photo " + (i + 1) + " of " + list.length + "…");
      shrink(list[i++]).then(function (blob) {
        var fd = new FormData();
        fd.append("photo", blob, "photo.jpg"); fd.append("name", $("up-name").value); fd.append("caption", $("up-cap").value);
        return fetch("/api/photos", { method: "POST", body: fd });
      }).then(function (r) {
        if (r.status === 503) throw new Error("The photo album isn't switched on yet.");
        if (!r.ok) return r.json().then(function (j) { throw new Error(j.error || "Upload failed."); });
        return r.json().then(function (j) { if (j && j.id && j.token) { mine[j.id] = j.token; keep(); } ok++; });
      }).then(next, function (e) { say(e.message || "That one didn't work. Try again.", true); i = list.length; setTimeout(function () { file.value = ""; }, 0); });
    };
    next();
  }
  file.addEventListener("change", function () { if (file.files.length) upload(file.files); });
  try { $("up-name").value = localStorage.getItem("rd-name") || ""; } catch (e) {}
  $("up-name").addEventListener("change", function () { try { localStorage.setItem("rd-name", this.value); } catch (e) {} });

  // ----- full-screen viewer -----
  var box = null, cur = 0;
  function show(i) {
    cur = (i + photos.length) % photos.length;
    var p = photos[cur];
    box.querySelector("img").src = "/api/photos/" + p.id;
    box.querySelector("img").alt = p.caption || "Royal Dix photo";
    var d = box.querySelector(".lb-del"); if (d) { d.textContent = (mine[p.id] || !p.v) ? "Delete photo" : "Delete (captain)"; d.hidden = false; var pn = box.querySelector(".lb-pane"); if (pn) pn.hidden = true; var st0 = box.querySelector(".lb-st"); if (st0) st0.textContent = ""; }
    var when = p.ts ? new Date(p.ts).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "";
    box.querySelector(".lb-cap").innerHTML = (p.caption ? "<b>" + esc(p.caption) + "</b>" : "") + "<span>" + esc([p.by ? "Added by " + p.by : "", when].filter(Boolean).join(" · ")) + "</span>";
  }
  function close() { if (box) { box.remove(); box = null; document.body.style.overflow = ""; document.removeEventListener("keydown", key); } }
  function key(e) { if (e.key === "Escape") close(); else if (e.key === "ArrowRight") show(cur + 1); else if (e.key === "ArrowLeft") show(cur - 1); }
  function open(i) {
    box = document.createElement("div"); box.className = "lb"; box.setAttribute("role", "dialog"); box.setAttribute("aria-modal", "true");
    box.innerHTML = '<button class="lb-x" aria-label="Close">×</button><button class="lb-n lb-p" aria-label="Previous">‹</button><img alt=""><button class="lb-n lb-nx" aria-label="Next">›</button>' +
      '<div class="lb-cap"></div><button class="lb-del" type="button">Delete (captain)</button>' +
      '<div class="lb-pane" hidden><input class="lb-code" type="password" autocomplete="off" placeholder="Team code" aria-label="Team code"><button class="lb-go" type="button">Delete</button><button class="lb-no" type="button">Cancel</button></div><div class="lb-st" role="status"></div>';
    document.body.appendChild(box); document.body.style.overflow = "hidden";
    box.querySelector(".lb-x").onclick = close;
    box.querySelector(".lb-p").onclick = function (e) { e.stopPropagation(); show(cur - 1); };
    box.querySelector(".lb-nx").onclick = function (e) { e.stopPropagation(); show(cur + 1); };
    box.addEventListener("click", function (e) { if (e.target === box) close(); });
    var del = box.querySelector(".lb-del"), pane = box.querySelector(".lb-pane"), inp = box.querySelector(".lb-code"), st = box.querySelector(".lb-st");
    var ask = function (t, bad) { st.textContent = t || ""; st.className = "lb-st" + (bad ? " bad" : ""); };
    var doDelete = function (c) {
      ask("Deleting…");
      var id0 = photos[cur].id, h = mine[id0] ? { "x-delete-token": mine[id0] } : photos[cur].v ? { "x-team-code": c } : {};
      fetch("/api/photos/" + id0, { method: "DELETE", headers: h }).then(function (r) {
        return r.json().catch(function () { return {}; }).then(function (j) {
          if (r.ok) { if (mine[id0]) { delete mine[id0]; keep(); } else code = c; close(); load(); return; }
          if (r.status === 401) { code = ""; ask("That code isn't right. Try again.", true); inp.value = ""; inp.focus(); return; }
          if (r.status === 403) { ask("Deleting isn't switched on yet. Add the TEAM_CODE secret in Cloudflare first.", true); return; }
          ask(j.error || "Couldn't delete that photo.", true);
        });
      }, function () { ask("No connection. Try again.", true); });
    };
    del.onclick = function () {
      if (mine[photos[cur].id] || !photos[cur].v) {
        if (del.getAttribute("data-sure") !== "1") { del.setAttribute("data-sure", "1"); del.textContent = "Tap again to delete this photo"; setTimeout(function () { if (del.getAttribute("data-sure") === "1") { del.removeAttribute("data-sure"); del.textContent = "Delete photo"; } }, 4000); return; }
        del.removeAttribute("data-sure"); doDelete(""); return;
      }
      if (code) { doDelete(code); return; }
      pane.hidden = false; del.hidden = true; inp.focus();
    };
    box.querySelector(".lb-go").onclick = function () { if (inp.value.trim()) doDelete(inp.value.trim()); else ask("Type the team code first.", true); };
    inp.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); box.querySelector(".lb-go").click(); } e.stopPropagation(); });
    box.querySelector(".lb-no").onclick = function () { pane.hidden = true; del.hidden = false; ask(""); };
    var sx = null;   // swipe left / right on a phone
    box.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; }, { passive: true });
    box.addEventListener("touchend", function (e) { if (sx === null) return; var dx = e.changedTouches[0].clientX - sx; sx = null; if (Math.abs(dx) > 50) show(cur + (dx < 0 ? 1 : -1)); });
    document.addEventListener("keydown", key);
    show(i);
  }
  album.addEventListener("click", function (e) { var b = e.target.closest(".ph"); if (b) open(+b.getAttribute("data-i")); });

  load();
})();
