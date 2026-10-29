(function () {
  "use strict";
  var D = window.RD;

  var esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };
  var $ = function (id) { return document.getElementById(id); };
  var fmtDate = function (iso, opts) {
    return new Date(iso + "T12:00:00").toLocaleDateString("en-GB", opts || { weekday: "short", day: "numeric", month: "short" });
  };
  var ball = function (n) { return '<span class="ball" data-n="' + n + '"><span>' + n + "</span></span>"; };
  var pct = function (p) { return p.p > 0 ? (p.w / p.p) * 100 : null; };

  // Work out played / won / form for one player from their frame list.
  // view: "S" singles, "D" doubles, "A" all frames
  var statsFor = function (pl, view) {
    var res = (pl.results || []).map(function (s) {
      var m = /^(\d+)([SD])-([WL])$/.exec(s);
      return m ? { t: m[2], r: m[3] } : null;
    }).filter(function (x) { return x && (view === "A" || x.t === view); });
    var won = res.filter(function (x) { return x.r === "W"; }).length;
    return { p: res.length, w: won, form: res.map(function (x) { return x.r; }) };
  };

  // ---------- Dates ----------
  var today = new Date(); today.setHours(0, 0, 0, 0);
  var dayMs = 86400000;
  var dateOf = function (f) { return new Date(f.date + "T00:00:00"); };
  var playable = function (f) { return f.venue === "home" || f.venue === "away"; };

  document.querySelectorAll(".updated").forEach(function (el) {
    el.textContent = fmtDate(D.lastUpdated, { day: "numeric", month: "long", year: "numeric" });
  });

  // ---------- Where teams sit ----------
  var ordinal = function (n) { var s = ["th", "st", "nd", "rd"], v = n % 100; return n + (s[(v - 20) % 10] || s[v] || s[0]); };
  var rowOf = function (name) {
    var i = D.league.findIndex(function (t) { return t.team === name; });
    return i < 0 ? null : { pos: i + 1, t: D.league[i] };
  };
  var plural = function (n, w) { return n + " " + w + (n === 1 ? "" : "s"); };
  var us = rowOf(D.team);

  // ---------- Scoreboard (next match, their position, ours) ----------
  var upcoming = D.fixtures.filter(function (f) { return dateOf(f) >= today && f.venue !== "tbc"; })[0];
  var nextPlay = D.fixtures.filter(function (f) { return dateOf(f) >= today && playable(f); })[0];
  var cell = function (k, big, sub) {
    return '<div class="sb-cell"><div class="k">' + k + '</div><div class="big">' + big + '</div><div class="s">' + sub + "</div></div>";
  };
  var whenTxt = function (f) {
    var d = Math.round((dateOf(f) - today) / dayMs);
    return d === 0 ? "Tonight" : d === 1 ? "Tomorrow" : fmtDate(f.date) + " · in " + d + " days";
  };
  var cells = [];
  if (upcoming) {
    var tagHtml = playable(upcoming) ? '<span class="tag ' + upcoming.venue + '">' + upcoming.venue + "</span>" : "";
    cells.push(cell((playable(upcoming) ? "Next match" : "Next up") + " · Week " + esc(upcoming.wk),
      esc(upcoming.opp), tagHtml + "<span>" + esc(whenTxt(upcoming)) + "</span>"));
  } else {
    cells.push(cell("Season " + esc(D.season), "Fixtures to be confirmed", ""));
  }
  var them = nextPlay ? rowOf(nextPlay.opp) : null;
  if (them) {
    cells.push(cell(nextPlay === upcoming ? esc(nextPlay.opp) + " in the table" : "Then " + esc(nextPlay.opp),
      ordinal(them.pos), them.t.pts + " pts · won " + them.t.w + ", lost " + them.t.l));
  }
  if (us) {
    var gap = "";
    if (them) {
      var diff = us.t.pts - them.t.pts;
      gap = diff > 0 ? plural(diff, "pt") + " ahead"
          : diff < 0 ? plural(-diff, "pt") + " behind"
          : "level on points";
    }
    cells.push(cell(esc(D.team), ordinal(us.pos), us.t.pts + " pts" + (gap ? " · " + gap : "")));
  }
  $("next").innerHTML = cells.join("");

  // ---------- Player rankings ----------
  var captions = {
    S: "Singles only. These frames decide the league's player ranking and top player.",
    D: "Doubles frames on their own. They don't count towards the league ranking.",
    A: "Our own Royal Dix table: every singles and doubles frame together."
  };
  var currentView = "S";

  var renderPlayers = function (view) {
    currentView = view;
    var rows = D.players.map(function (pl) {
      var st = statsFor(pl, view);
      return { pl: pl, p: st.p, w: st.w, form: st.form };
    }).sort(function (a, b) {
      var pa = pct(a), pb = pct(b);
      if (pa === null && pb === null) return a.pl.ball - b.pl.ball;
      if (pa === null) return 1;
      if (pb === null) return -1;
      return pb - pa || b.w - a.w || b.p - a.p || a.pl.ball - b.pl.ball;
    });
    var anyPlayed = rows.some(function (r) { return r.p > 0; });
    $("awaiting").hidden = anyPlayed;
    $("players-cap").textContent = captions[view];
    document.querySelectorAll(".seg button").forEach(function (btn) {
      btn.setAttribute("aria-pressed", btn.getAttribute("data-view") === view ? "true" : "false");
    });
    $("players-body").innerHTML = rows.map(function (r, i) {
      var pl = r.pl, pc = pct(r);
      var pcTxt = pc === null ? '<span class="na">–</span>' : pc.toFixed(0) + "%";
      var bar = pc === null ? "" : '<span class="bar"><i style="width:' + pc.toFixed(0) + '%"></i></span>';
      var form = r.form.slice(-5).map(function (x) {
        return '<i class="' + (x === "W" ? "w" : "l") + '" title="' + (x === "W" ? "Won" : "Lost") + '"></i>';
      }).join("");
      return '<tr class="' + (i === 0 && pc !== null ? "first" : "") + '">' +
        '<td class="pos c-pos">' + (pc !== null ? i + 1 : "–") + "</td>" +
        '<td class="c-name"><span class="player">' + ball(pl.ball) + "<span>" + esc(pl.name) + "</span>" +
          (pl.captain ? '<span class="cap">Captain</span>' : "") + "</span></td>" +
        "<td>" + r.p + "</td><td>" + r.w + '</td><td class="hide-s">' + (r.p - r.w) + "</td>" +
        '<td class="c-pct"><span class="pct"><b>' + pcTxt + "</b>" + bar + "</span></td>" +
        '<td class="hide-s c-form"><span class="form">' + form + "</span></td></tr>";
    }).join("");
  };
  document.querySelectorAll(".seg button").forEach(function (btn) {
    btn.addEventListener("click", function () { renderPlayers(btn.getAttribute("data-view")); });
  });
  renderPlayers("S");

  // ---------- League table ----------
  // Order follows the official table (tie-breaks are the league's own), so no re-sorting here.
  var league = D.league.slice();
  var leaguePlayed = league.some(function (t) { return t.p > 0; });
  $("league-sub").textContent = D.leagueName + " " + D.season +
    (leaguePlayed ? (D.leagueAfterWeek ? ", after week " + D.leagueAfterWeek : "") : ". Points appear after the first results.");
  $("league-body").innerHTML = league.map(function (t, i) {
    var diff = t.f - t.a;
    return '<tr class="' + (t.us ? "us" : "") + '">' +
      '<td class="pos c-pos">' + (i + 1) + '</td><td class="c-name">' + esc(t.team) + "</td>" +
      "<td>" + t.p + "</td><td>" + t.w + "</td><td>" + t.l + "</td>" +
      '<td class="hide-s">' + t.f + '</td><td class="hide-s">' + t.a + "</td>" +
      "<td>" + (diff > 0 ? "+" : "") + diff + '</td><td class="c-pts">' + t.pts + "</td></tr>";
  }).join("");

  // ---------- Fixtures ----------
  var nextKey = upcoming ? upcoming.wk : null;
  var oppSub = function (f) {
    var r = playable(f) ? rowOf(f.opp) : null;
    return r ? "<small>" + ordinal(r.pos) + " in the league · " + r.t.pts + " pts</small>" : "";
  };
  $("fixtures-list").innerHTML = D.fixtures.map(function (f) {
    var cls = ["fx"];
    var special = !playable(f);
    if (special) cls.push(f.venue);
    if (f.wk === nextKey) cls.push("next-up");
    if (dateOf(f) < today && f.venue !== "tbc" && f.venue !== "break") cls.push("past");
    var right = "";
    if (f.result) {
      var r = f.result, o = r.us > r.them ? "won" : r.us < r.them ? "lost" : "drew";
      right = '<span class="score ' + o + '">' + r.us + "–" + r.them + "</span>";
    }
    var label = f.venue === "bye" ? "Bye" : f.venue === "break" ? "Break" : f.venue === "tbc" ? "TBC" : f.venue;
    var wkLabel = (f.wk === "17+" ? "Wk 17+" : "Wk " + f.wk);
    var dateTxt = f.venue === "tbc" ? "From " + fmtDate(f.date) : fmtDate(f.date);
    return '<li class="' + cls.join(" ") + '">' +
      '<span class="wk">' + esc(wkLabel) + "</span>" +
      '<span class="date">' + esc(dateTxt) + "</span>" +
      '<span class="tag ' + f.venue + '">' + (special ? "" : label) + "</span>" +
      '<span class="opp">' + esc(f.opp) + oppSub(f) + "</span>" + right + "</li>";
  }).join("");

  // ---------- Our team: packed rack, 8 in the middle ----------
  var rackRows = [[1, 2, 3, 4], [5, 8, 6], [7, 9, 11, 12]];
  var byBall = {};
  D.players.forEach(function (p) { byBall[p.ball] = p; });
  var placed = {};
  rackRows.forEach(function (r) { r.forEach(function (n) { placed[n] = true; }); });
  var extra = D.players.filter(function (p) { return !placed[p.ball]; }).map(function (p) { return p.ball; });
  if (extra.length) rackRows.push(extra);   // anyone added later (e.g. ball 10) lands on a new row
  $("rack").innerHTML = rackRows.map(function (row) {
    return '<div class="rack-row">' + row.map(function (n) {
      var p = byBall[n]; if (!p) return "";
      var sS = statsFor(p, "S"), sD = statsFor(p, "D");
      var line = (sS.p + sD.p) === 0 ? "Yet to play" :
        "<span>Singles " + sS.w + "/" + sS.p + "</span><span>Doubles " + sD.w + "/" + sD.p + "</span>";
      return '<div class="rb">' + ball(n) +
        '<div class="nm">' + esc(p.name) + (p.captain ? "<small>Captain</small>" : "") + "</div>" +
        '<div class="st">' + line + "</div></div>";
    }).join("") + "</div>";
  }).join("");

  // ---------- Official league player ranking (shown once the league publishes it) ----------
  var LR = D.leagueRanking || { published: false, rows: [] };
  var lrRows = LR.rows || [];
  if (LR.published && lrRows.length) {
    $("lr-sub").textContent = "The league's own player ranking, singles frames only" + (LR.afterWeek ? ", after week " + LR.afterWeek : "") + ".";
    $("lr-table").hidden = false;
    $("lr-body").innerHTML = lrRows.map(function (r, i) {
      var pc = r.gp > 0 ? Math.round((r.w / r.gp) * 100) + "%" : "–";
      return '<tr class="' + (r.team === D.team ? "us" : "") + '"><td class="pos c-pos">' + (i + 1) + '</td>' +
        '<td class="c-name">' + esc(r.name) + '</td><td class="c-name hide-s">' + esc(r.team || "") + "</td>" +
        "<td>" + r.gp + "</td><td>" + r.w + '</td><td class="c-pts">' + pc + "</td></tr>";
    }).join("");
  } else {
    $("lr-sub").textContent = "The league's own player ranking, singles frames only.";
    $("lr-empty").hidden = false;
    $("lr-empty").textContent = "Not published yet. The league site shows no player ranking so far this season. It will appear here once the league publishes it.";
  }

  // ---------- Tab row follows the page (so a phone user always sees where they are) ----------
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".topbar nav a[href^='#']"));
  var navBox = document.querySelector(".topbar nav");
  var setCurrent = function (id) {
    navLinks.forEach(function (a) {
      var on = a.getAttribute("href") === "#" + id;
      if (on) { a.setAttribute("aria-current", "true"); } else { a.removeAttribute("aria-current"); }
      if (on && navBox && navBox.scrollWidth > navBox.clientWidth) {
        var left = a.offsetLeft - (navBox.clientWidth - a.offsetWidth) / 2;
        try { navBox.scrollTo({ left: left, behavior: "smooth" }); } catch (e) { navBox.scrollLeft = left; }
      }
    });
  };
  if ("IntersectionObserver" in window) {
    var seen = {};
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { seen[en.target.id] = en.isIntersecting ? en.intersectionRatio : 0; });
      var best = null;
      Object.keys(seen).forEach(function (k) { if (seen[k] > 0 && (best === null || seen[k] >= seen[best])) best = k; });
      if (best) setCurrent(best);
    }, { rootMargin: "-120px 0px -45% 0px", threshold: [0, .25, .5, .75, 1] });
    navLinks.forEach(function (a) {
      var s = document.getElementById(a.getAttribute("href").slice(1));
      if (s) io.observe(s);
    });
  }
})();
