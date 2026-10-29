/* Live match panel. Reads data/live.json every 15 seconds.
   r: "W" we won the frame, "L" we lost it, "live" being played now, "" not started.
   Score = frames won + 1 bonus point to whoever wins the match (out of 10). */
(function () {
  "use strict";
  var K = window.RDK, D = window.RD, host = K && K.$("live");
  if (!host) return;
  var esc = K.esc, timer = null;

  function render(L) {
    if (!L || !L.on) { host.hidden = true; return; }
    if (L.date && (K.today - new Date(L.date + "T00:00:00")) / K.dayMs > 1) { host.hidden = true; return; }   // old match: tuck it away
    var fr = L.frames || [], w = 0, l = 0, played = 0, cur = null;
    fr.forEach(function (f) {
      if (f.r === "W") { w++; played++; } else if (f.r === "L") { l++; played++; } else if (f.r === "live") cur = f;
    });
    var done = played === fr.length && fr.length > 0, final = /full time|final/i.test(L.status || "") || done;
    var us = w, them = l;
    if (final) { if (w > l) us++; else if (l > w) them++; else { us++; them++; } }
    var home = L.venue !== "away";
    var a = home ? [D.team, us] : [L.opp, them], b = home ? [L.opp, them] : [D.team, us];
    host.hidden = false;
    host.className = "live" + (final ? " final" : "");
    host.innerHTML =
      '<div class="lv-top"><span class="lv-dot"></span><b>' + (final ? "Full time" : "Live") + "</b><span>" + esc(L.status || "") + "</span></div>" +
      '<div class="lv-score"><div><span>' + esc(a[0]) + "</span><b>" + a[1] + "</b></div><i>–</i><div><b>" + b[1] + "</b><span>" + esc(b[0]) + "</span></div></div>" +
      (final ? "" : '<div class="lv-sub">' + w + " frames to " + l + " · " + played + " of " + fr.length + " played · match point to the winner</div>") +
      '<ol class="lv-frames">' + fr.map(function (f) {
        var who = [f.us, f.them].filter(Boolean).length ? esc(f.us || "?") + " v " + esc(f.them || "?") : "";
        return '<li class="' + (f.r === "W" ? "won" : f.r === "L" ? "lost" : f.r === "live" ? "on" : "") + '"><span class="n">' + esc(f.label) + '</span><span class="who">' + who +
          '</span><span class="res">' + (f.r === "W" ? "Won" : f.r === "L" ? "Lost" : f.r === "live" ? "In play" : "") + "</span></li>";
      }).join("") + "</ol>" +
      '<div class="lv-foot">Updates every few seconds</div>';

    // ticker: put the live score at the front of the running text
    var tk = document.querySelector(".tk-track");
    if (tk && !final) {
      tk.querySelectorAll(".tk-live").forEach(function (n) { n.remove(); });
      var kids = Array.prototype.slice.call(tk.children), g = kids.length / 4;
      var txt = (final ? "Full time " : "Live ") + a[0] + " " + a[1] + "–" + b[1] + " " + b[0];
      for (var i = 3; i >= 0; i--) {
        var s = document.createElement("span"); s.className = "tk-i tk-live"; s.textContent = txt;
        tk.insertBefore(s, kids[i * g] || null);
      }
    }
  }

  function load() {
    fetch("data/live.json?t=" + Date.now(), { cache: "no-store" })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(render).catch(function () {});
  }
  load();
  timer = setInterval(function () { if (!document.hidden) load(); }, 15000);
})();
