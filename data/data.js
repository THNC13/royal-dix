// ============================================================
//  ROYAL DIX — WEEKLY DATA FILE
//  This is the only file that changes week to week.
//  Update the numbers below, commit to GitHub, Cloudflare redeploys.
//
//  Scoring on the league site: 9 frames per match (6 singles + 3 doubles),
//  1 point per frame won, plus 1 match point to the team that wins more frames.
// ============================================================
window.RD = {
  team: "Royal Dix",
  leagueName: "Econ Winter Pool League",
  season: "2026/27",
  lastUpdated: "2026-10-30",
  leagueAfterWeek: 2,
  // Set while a week is only part-entered (clears when the full week is in). Shown under the league table.
  leaguePartial: "Week 3 so far: Royal Dix v Wobbly Dix, Smokeys Men v Smokeys Hot Shotz and Captain 'N v El Barquito are in. Other matches to follow.",

  // ---------- LEAGUE TABLE ----------
  // Keep rows in the same order as the official table (the site does not re-sort).
  // p = matches played, w = matches won, l = matches lost,
  // f = frames for, a = frames against, pts = league points
  league: [
    { team: "Smokeys Men",            p: 3, w: 3, l: 0, f: 23, a: 4,  pts: 26 },
    { team: "El Barquito",            p: 3, w: 3, l: 0, f: 19, a: 8,  pts: 22 },
    { team: "Wobbly Dix",             p: 3, w: 2, l: 1, f: 16, a: 11, pts: 18 },
    { team: "Royal Dix",              p: 3, w: 1, l: 2, f: 16, a: 11, pts: 17, us: true },
    { team: "Boulevard",              p: 2, w: 2, l: 0, f: 14, a: 4,  pts: 16 },
    { team: "Royal Oak",              p: 2, w: 2, l: 0, f: 10, a: 8,  pts: 12 },
    { team: "Churchills",             p: 2, w: 0, l: 2, f: 6,  a: 12, pts: 6 },
    { team: "Smokeys Hot Shotz",      p: 2, w: 0, l: 2, f: 4,  a: 14, pts: 4 },
    { team: "Captain 'N",             p: 3, w: 0, l: 3, f: 4,  a: 23, pts: 4 },
    { team: "Penguin Potters",        p: 1, w: 0, l: 1, f: 3,  a: 6,  pts: 3 },
    { team: "Churchills Pink Ladies", p: 2, w: 0, l: 2, f: 2,  a: 16, pts: 2 }
  ],



  // ---------- PLAYERS ----------
  // One entry per frame a player has played, in order: "<week><S or D>-<W or L>"
  //   S = singles (these count towards the league player ranking and top player)
  //   D = doubles (only in our own Royal Dix table)
  // e.g. "3S-W" = won their week 3 singles frame, "3D-L" = lost their week 3 doubles frame.
  // The site works out played / won / win % / form from this list.
  players: [
    { ball: 1, name: "Tom",    full: "Tom Hughes",     captain: true, results: ["1S-W","1D-L","2S-W","2D-W","3S-L"] },
    { ball: 2, name: "Nic",    full: "Nic Light",      results: ["1S-L","1D-W","2S-W","2D-W","3S-W","3D-L"] },
    { ball: 3, name: "Dave",   results: ["3S-W","3D-W"] },
    { ball: 4, name: "Darren", full: "Darren Baillie", results: ["1S-W","1D-W","2S-W","2D-W"] },
    { ball: 5, name: "Ron",    results: [] },
    { ball: 6, name: "Göran",  full: "Göran Nielsen",  results: ["1S-L","1D-L","2S-L","2D-W","3S-L"] },
    { ball: 7, name: "Bob",    full: "Bob Whelan",     results: ["1S-W","1D-L","2S-W","2D-W","3S-L","3D-L"] },
    { ball: 8, name: "Michel", full: "Michel Catozzi", results: ["1S-L","1D-L","2S-W","2D-W","3S-W","3D-W"] },
    { ball: 9, name: "Alan",   results: [] },
    { ball: 11, name: "Alvaro", results: ["3D-L"] },
    { ball: 12, name: "Ana",    results: ["3D-L"] }
  ],

  // ---------- OFFICIAL LEAGUE PLAYER RANKING ----------
  // Copy this from the league site once it is published (singles frames only).
  // Keep the league's own order. gp = ranking games played, w = games won.
  // Rows for team "Royal Dix" are highlighted automatically.
  leagueRanking: {
    published: false,
    afterWeek: null,
    rows: [
      // { name: "Example Player", team: "Royal Dix", gp: 4, w: 3 }
    ]
  },

  // ---------- FIXTURES ----------
  // venue: "home" | "away" | "bye" | "break" | "tbc"
  // result: null until played, then league points e.g. { us: 6, them: 4 }
  fixtures: [
    { wk: "1",     date: "2026-10-15", venue: "away", opp: "Royal Oak",              result: { us: 4, them: 6 } },
    { wk: "2",     date: "2026-10-22", venue: "home", opp: "Captain 'N",             result: { us: 9, them: 1 } },
    { wk: "3",     date: "2026-10-29", venue: "home", opp: "Wobbly Dix",             result: { us: 4, them: 6 } },
    { wk: "4",     date: "2026-11-05", venue: "bye",  opp: "Rest week",              result: null },
    { wk: "5",     date: "2026-11-12", venue: "home", opp: "Boulevard",              result: null },
    { wk: "6",     date: "2026-11-19", venue: "away", opp: "Smokeys Men",            result: null },
    { wk: "7",     date: "2026-11-26", venue: "home", opp: "El Barquito",            result: null },
    { wk: "8",     date: "2026-12-03", venue: "away", opp: "Penguin Potters",        result: null },
    { wk: "9",     date: "2026-12-10", venue: "home", opp: "Smokeys Hot Shotz",      result: null },
    { wk: "10–12", date: "2026-12-17", venue: "break", opp: "Christmas break: 17, 24 and 31 Dec", result: null },
    { wk: "13",    date: "2027-01-07", venue: "home", opp: "Churchills",             result: null },
    { wk: "14",    date: "2027-01-14", venue: "away", opp: "Churchills Pink Ladies", result: null },
    { wk: "15",    date: "2027-01-21", venue: "home", opp: "Churchills Pink Ladies", result: null },
    { wk: "16",    date: "2027-01-28", venue: "away", opp: "Smokeys Hot Shotz",      result: null },
    { wk: "17+",   date: "2027-02-04", venue: "tbc",  opp: "Fixtures to be confirmed", result: null }
  ]
};
