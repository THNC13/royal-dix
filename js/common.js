/* Shared by every page: helpers, the top bar (tabs), the match-day ticker and popup, the footer. */
(function () {
  "use strict";
  var D = window.RD || { fixtures: [], league: [], players: [] };
  var K = (window.RDK = {});

  // ---------- Helpers ----------
  K.$ = function (id) { return document.getElementById(id); };
  K.esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };
  K.fmtDate = function (iso, opts) {
    return new Date(iso + "T12:00:00").toLocaleDateString("en-GB", opts || { weekday: "short", day: "numeric", month: "short" });
  };
  K.ordinal = function (n) { var s = ["th", "st", "nd", "rd"], v = n % 100; return n + (s[(v - 20) % 10] || s[v] || s[0]); };
  K.plural = function (n, w) { return n + " " + w + (n === 1 ? "" : "s"); };
  K.ball = function (n) { return '<span class="ball" data-n="' + n + '"><span>' + n + "</span></span>"; };
  K.pct = function (p) { return p.p > 0 ? (p.w / p.p) * 100 : null; };
  K.playable = function (f) { return f.venue === "home" || f.venue === "away"; };
  K.dayMs = 86400000;
  K.dateOf = function (f) { return new Date(f.date + "T00:00:00"); };

  // "Today". Add ?today=2026-11-12 to any page address to preview another day (handy for testing match day).
  var q = /[?&]today=(\d{4}-\d{2}-\d{2})/.exec(location.search);
  K.simulated = !!q;
  K.today = q ? new Date(q[1] + "T00:00:00") : (function () { var t = new Date(); t.setHours(0, 0, 0, 0); return t; })();

  K.rowOf = function (name) {
    var i = D.league.findIndex(function (t) { return t.team === name; });
    return i < 0 ? null : { pos: i + 1, t: D.league[i] };
  };

  // Work out played / won / form for one player from their frame list.
  // view: "S" singles, "D" doubles, "A" all frames
  K.statsFor = function (pl, view) {
    var res = (pl.results || []).map(function (s) {
      var m = /^(\d+)([SD])-([WL])$/.exec(s);
      return m ? { t: m[2], r: m[3] } : null;
    }).filter(function (x) { return x && (view === "A" || x.t === view); });
    var won = res.filter(function (x) { return x.r === "W"; }).length;
    return { p: res.length, w: won, form: res.map(function (x) { return x.r; }) };
  };

  var esc = K.esc;
  var page = document.body.getAttribute("data-page") || "home";

  // ---------- Match day ----------
  var todays = D.fixtures.filter(function (f) { return K.playable(f) && K.dateOf(f).getTime() === K.today.getTime(); })[0] || null;
  K.matchToday = todays;
  var us = K.rowOf(D.team), them = todays ? K.rowOf(todays.opp) : null;

  var tickerItems = [];
  var popupHtml = "";
  if (todays) {
    var home = todays.venue === "home";
    var fixtureTxt = home ? D.team + " v " + todays.opp : D.team + " away at " + todays.opp;
    if (todays.result) {
      var r = todays.result;
      tickerItems = ["Full time", D.team + " " + r.us + "–" + r.them + " " + todays.opp, "League points out of 10"];
    } else {
      tickerItems = ["Today is match day", fixtureTxt, home ? "Home" : "Away", "Tonight"];
      if (them) tickerItems.push(todays.opp + " are " + K.ordinal(them.pos) + " on " + them.t.pts + " pts");
      if (us) tickerItems.push(D.team + " are " + K.ordinal(us.pos) + " on " + us.t.pts + " pts");
      popupHtml =
        '<div class="md" id="md" role="dialog" aria-modal="true" aria-labelledby="md-h">' +
          '<div class="md-card" id="md-card" tabindex="-1">' +
            '<div class="md-k" id="md-h">Match day</div>' +
            '<div class="md-vs"><span>' + esc(home ? D.team : todays.opp) + "</span><i>v</i><span>" + esc(home ? todays.opp : D.team) + "</span></div>" +
            '<div class="md-meta"><span class="tag ' + todays.venue + '">' + todays.venue + "</span><span>Tonight</span></div>" +
            (them && us ? '<div class="md-pos"><span>' + esc(todays.opp) + " · " + K.ordinal(them.pos) + " · " + them.t.pts + " pts</span><span>" +
              esc(D.team) + " · " + K.ordinal(us.pos) + " · " + us.t.pts + " pts</span></div>" : "") +
            '<button type="button" class="btn" id="md-go">Let’s go</button>' +
          "</div></div>";
    }
  }

  // ---------- Top bar ----------
  var PAGES = [
    ["index.html", "Home", "home"],
    ["players.html", "Player Rankings", "players"],
    ["league-ranking.html", "League Ranking", "league-ranking"],
    ["table.html", "League Table", "table"],
    ["fixtures.html", "Fixtures", "fixtures"],
    ["team.html", "Our Team", "team"],
    ["rules.html", "Rules", "rules"]
  ];
  var top = K.$("topbar");
  if (top) {
    var tk = "";
    if (tickerItems.length) {
      var one = tickerItems.map(function (t) { return '<span class="tk-i">' + esc(t) + "</span>"; }).join("");
      tk = '<div class="ticker" id="ticker" role="region" aria-label="' + esc(tickerItems.join(". ")) + '">' +
           '<div class="tk-track" aria-hidden="true">' + one + one + one + one + "</div></div>";
    }
    top.innerHTML = tk +
      '<div class="tb"><a class="brand" href="index.html" aria-label="Royal Dix home"><img src="assets/badge-sm.jpg" alt="" width="36" height="36"></a>' +
      '<nav aria-label="Pages">' + PAGES.map(function (p) {
        return '<a href="' + p[0] + '"' + (p[2] === page ? ' aria-current="page"' : "") + "><span>" + esc(p[1]) + "</span></a>";
      }).join("") + "</nav></div>";

    // On phones the tab row scrolls sideways: bring the current tab to the middle.
    var nav = top.querySelector("nav"), cur = top.querySelector("nav [aria-current]");
    var centre = function () {
      if (nav && cur && nav.scrollWidth > nav.clientWidth) nav.scrollLeft = cur.offsetLeft - (nav.clientWidth - cur.offsetWidth) / 2;
    };
    centre();
    window.addEventListener("load", centre);
  }

  // ---------- Footer ----------
  var foot = K.$("foot");
  if (foot) {
    foot.innerHTML = '<img src="assets/badge-sm.jpg" alt="" width="44" height="44">' +
      "<p>" + esc(D.team) + " · " + esc(D.leagueName) + " " + esc(D.season) +
      '<br><small>Last updated <span class="updated"></span></small></p>';
  }
  if (D.lastUpdated) {
    document.querySelectorAll(".updated").forEach(function (el) {
      el.textContent = K.fmtDate(D.lastUpdated, { day: "numeric", month: "long", year: "numeric" });
    });
  }

  // ---------- Match-day popup: pops up, then sinks into the ticker like a ball into a pocket ----------
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (popupHtml && !reduce) {
    var key = "rd-md-" + D.fixtures.indexOf(todays) + "-" + todays.date, seen = false;
    try { seen = !K.simulated && sessionStorage.getItem(key) === "1"; } catch (e) {}
    if (!seen) {
      // On the home page wait for the 8 ball reveal (about 4 seconds) before the popup arrives.
      setTimeout(function () {
        try { sessionStorage.setItem(key, "1"); } catch (e) {}
        document.body.insertAdjacentHTML("beforeend", popupHtml);
        var md = K.$("md"), card = K.$("md-card"), go = K.$("md-go"), closing = false;
        document.body.style.overflow = "hidden";
        go.focus({ preventScroll: true });

        var finish = function () {
          document.body.style.overflow = "";
          if (md && md.parentNode) md.parentNode.removeChild(md);
          var tkEl = K.$("ticker");
          if (tkEl) { tkEl.classList.add("hit"); setTimeout(function () { tkEl.classList.remove("hit"); }, 1000); }
          document.removeEventListener("keydown", onKey);
        };
        var sink = function () {
          if (closing) return; closing = true;
          clearTimeout(auto);
          var tkEl = K.$("ticker");
          if (!card.animate || !tkEl) { finish(); return; }
          var c = card.getBoundingClientRect(), t = tkEl.getBoundingClientRect();
          var dx = (t.left + t.width / 2) - (c.left + c.width / 2);
          var dy = (t.top + t.height / 2) - (c.top + c.height / 2);
          var s = Math.max(0.06, Math.min(t.height / c.height, 0.12));
          card.style.animation = "none";
          var a = card.animate(
            [{ transform: "none", opacity: 1 },
             { transform: "translate(" + dx + "px," + dy + "px) scale(" + s + ")", opacity: 0.9, offset: 0.85 },
             { transform: "translate(" + dx + "px," + dy + "px) scale(" + s * 0.6 + ")", opacity: 0 }],
            { duration: 1000, easing: "cubic-bezier(.55,0,.85,.35)", fill: "forwards" });
          md.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 900, delay: 100, fill: "forwards" });
          a.onfinish = finish;
        };
        var onKey = function (e) { if (e.key === "Escape" || e.key === "Enter") sink(); };
        var auto = setTimeout(sink, 5500);
        go.addEventListener("click", sink);
        md.addEventListener("click", function (e) { if (e.target === md) sink(); });
        document.addEventListener("keydown", onKey);
      }, page === "home" ? 4300 : 600);
    }
  }
})();
