(function () {
  "use strict";

  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };



  var flat = [];
  var examples = [
    "Cue ball touching an opponent's ball",
    "Potted the black on the break",
    "Can I pot the 8 and another ball?",
    "Played out of turn",
    "Nobody can make a legal shot"
  ];

  // ---------- Load rules ----------
  fetch("data/rules.json")
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (data) {
      data.sections.forEach(function (s) {
        s.rules.forEach(function (r) { flat.push({ ref: r.ref, text: r.text, tags: r.tags || "", section: s.title }); });
      });
      $("rules-list").innerHTML = data.sections.map(function (s) {
        return "<details><summary>" + esc(s.title) + '</summary><div class="body">' +
          s.rules.map(function (r) {
            return '<div class="rule" id="r-' + esc(r.ref.replace(/[^a-z0-9]/gi, "")) + '"><span class="ref">' + esc(r.ref) + "</span><p>" + esc(r.text) + "</p></div>";
          }).join("") + "</div></details>";
      }).join("");
      search();
    })
    .catch(function () {
      $("load-msg").textContent = "The rules didn't load. Check your connection and refresh the page.";
    });

  // ---------- Example chips ----------
  $("chips").innerHTML = examples.map(function (e) {
    return '<button type="button" class="chip">' + esc(e) + "</button>";
  }).join("");
  $("chips").addEventListener("click", function (ev) {
    if (ev.target.classList.contains("chip")) {
      $("q").value = ev.target.textContent;
      search();
      $("q").focus();
    }
  });

  // ---------- Live search (no internet service needed) ----------
  var stop = "the a an and or of to in on at is it was were be been my our their they he she we you i can do does did if when then with that this for from by as are but not no so than into out up down over after before while".split(" ");
  var syn = { black: "8 eight", eight: "8 black", scratch: "in off cue ball potted", frozen: "touching", stripes: "group", solids: "group", spots: "group", ref: "referee", pocketed: "potted pot", sank: "potted pot", sunk: "potted pot" };

  function tokens(q) {
    var out = [];
    q.toLowerCase().replace(/[^a-z0-9' ]+/g, " ").split(/\s+/).forEach(function (w) {
      if (!w || stop.indexOf(w) > -1) return;
      out.push(w);
      if (syn[w]) syn[w].split(" ").forEach(function (x) { out.push(x); });
    });
    return out;
  }

  function search() {
    var q = $("q").value.trim();
    var box = $("results");
    if (q.length < 3) { box.innerHTML = ""; return; }
    var toks = tokens(q);
    var scored = flat.map(function (r) {
      var hay = (r.text + " " + r.tags + " " + r.ref).toLowerCase(), score = 0;
      toks.forEach(function (t) {
        if (t.length < 2) return;
        var re = new RegExp("(^|[^a-z0-9])" + t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
        if (re.test(hay)) score += (r.tags.toLowerCase().indexOf(t) > -1 ? 3 : 2);
      });
      return { r: r, score: score };
    }).filter(function (x) { return x.score > 0; })
      .sort(function (a, b) { return b.score - a.score; })
      .slice(0, 5);
    if (!scored.length) {
      box.innerHTML = '<li><h3>No matching rule found. Try the assistant, or ask the referee.</h3></li>';
      return;
    }
    box.innerHTML = '<li><h3>Closest rules</h3></li>' + scored.map(function (x) {
      return '<li class="rule"><span class="ref">' + esc(x.r.ref) + "</span><p>" + esc(x.r.text) +
        '<span class="from">' + esc(x.r.section) + "</span></p></li>";
    }).join("");
  }

  var t;
  $("q").addEventListener("input", function () { clearTimeout(t); t = setTimeout(search, 150); });

  // ---------- Ask the rules assistant ----------
  var savedCode = store.get("rd-code");
  if (savedCode) $("code").value = savedCode;

  function show(msg, isErr, footnote) {
    var a = $("answer");
    a.innerHTML = '<div class="answer' + (isErr ? " err" : "") + '">' + esc(msg) +
      (footnote ? "<small>" + esc(footnote) + "</small>" : "") + "</div>";
  }

  $("ask-form").addEventListener("submit", function (ev) {
    ev.preventDefault();
    var q = $("q").value.trim();
    if (q.length < 5) { show("Describe what happened first, in a sentence.", true); return; }
    var btn = $("ask-btn");
    btn.disabled = true; btn.textContent = "Checking the rules…";
    show("Checking the rules…", false);

    fetch("/api/ask", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ question: q, code: $("code").value })
    })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { status: r.status, body: j }; }); })
      .then(function (res) {
        if (res.status === 200 && res.body.answer) {
          if ($("code").value) store.set("rd-code", $("code").value);
          show(res.body.answer, false, "AI answer based on the league rules. The referee's decision is final.");
        } else if (res.status === 401) {
          $("codebox").hidden = false;
          $("code").focus();
          show(res.body.error || "Enter the team code to use the assistant.", true);
        } else {
          show(res.body.error || "The assistant isn't available right now. The matching rules below still work.", true);
        }
      })
      .catch(function () {
        show("Couldn't reach the assistant. The matching rules below still work.", true);
      })
      .then(function () { btn.disabled = false; btn.textContent = "Ask the rules assistant"; });
  });
})();
