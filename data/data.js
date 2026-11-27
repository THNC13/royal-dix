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
  lastUpdated: "2026-11-27",
  leagueAfterWeek: 7,

  // ---------- LEAGUE TABLE ----------
  // Keep rows in the same order as the official table (the site does not re-sort).
  // p = matches played, w = matches won, l = matches lost,
  // f = frames for, a = frames against, pts = league points
  league: [
    { team: "Royal Oak",               p: 7, w: 6, l: 1, f: 45, a: 18, pts: 51 },
    { team: "Smokeys Men",             p: 7, w: 6, l: 1, f: 43, a: 20, pts: 49 },
    { team: "Churchills",              p: 7, w: 5, l: 2, f: 40, a: 23, pts: 45 },
    { team: "El Barquito",             p: 6, w: 5, l: 1, f: 33, a: 21, pts: 38 },
    { team: "Boulevard",               p: 7, w: 3, l: 4, f: 31, a: 32, pts: 34 },
    { team: "Royal Dix",               p: 6, w: 2, l: 4, f: 29, a: 25, pts: 31, us: true },
    { team: "Wobbly Dix",              p: 6, w: 3, l: 3, f: 27, a: 27, pts: 30 },
    { team: "Penguin Potters",         p: 6, w: 3, l: 3, f: 26, a: 28, pts: 29 },
    { team: "Captain 'N",              p: 6, w: 1, l: 5, f: 17, a: 37, pts: 18 },
    { team: "Smokeys Hot Shotz",       p: 6, w: 1, l: 5, f: 13, a: 41, pts: 14 },
    { team: "Churchills Pink Ladies",  p: 6, w: 0, l: 6, f: 11, a: 43, pts: 11 }
  ],





  // ---------- PLAYERS ----------
  // One entry per frame a player has played, in order: "<week><S or D>-<W or L>"
  //   S = singles (these count towards the league player ranking and top player)
  //   D = doubles (only in our own Royal Dix table)
  // e.g. "3S-W" = won their week 3 singles frame, "3D-L" = lost their week 3 doubles frame.
  // The site works out played / won / win % / form from this list.
  players: [
    { ball: 1, name: "Tom",    full: "Tom Hughes",     captain: true, results: ["1S-W","1D-L","2S-W","2D-W","3S-L","5S-L","5D-W","6D-L","7S-W","7D-W"] },
    { ball: 2, name: "Nic",    full: "Nic Light",      results: ["1S-L","1D-W","2S-W","2D-W","3S-W","3D-L","5S-W","5D-W","6S-L","6D-L","7S-L","7D-W"] },
    { ball: 3, name: "Dave",   results: ["3S-W","3D-W","5S-W","6S-W","6D-W","7S-L","7D-L"] },
    { ball: 4, name: "Darren", full: "Darren Baillie", results: ["1S-W","1D-W","2S-W","2D-W","5S-W","7S-W","7D-W"] },
    { ball: 5, name: "Ron",    results: [] },
    { ball: 6, name: "Göran",  full: "Göran Nielsen",  results: ["1S-L","1D-L","2S-L","2D-W","3S-L","5D-L","6S-W","7S-L"] },
    { ball: 7, name: "Bob",    full: "Bob Whelan",     results: ["1S-W","1D-L","2S-W","2D-W","3S-L","3D-L","5S-L","5D-W","6S-L","6D-L","7S-L","7D-L"] },
    { ball: 8, name: "Michel", full: "Michel Catozzi", results: ["1S-L","1D-L","2S-W","2D-W","3S-W","3D-W","5S-L","5D-W","6S-W","6D-W"] },
    { ball: 9, name: "Alan",   results: [] },
    { ball: 11, name: "Alvaro", results: ["3D-L","5D-L","7D-W"] },
    { ball: 12, name: "Ana",    results: ["3D-L","6S-L","6D-L"] }
  ],

  // ---------- OFFICIAL LEAGUE PLAYER RANKING ----------
  // Copy this from the league site once it is published (singles frames only).
  // Keep the league's own order. gp = ranking games played, w = games won.
  // Rows for team "Royal Dix" are highlighted automatically.
  leagueRanking: {
    published: true,
    computed: true,   // built from the published week-by-week results, until the league posts its own player ranking
    afterWeek: 7,
    rows: [
      { name: "Darren Baillie", team: "Royal Dix", gp: 4, w: 4 },
      { name: "Brian Mcgill", team: "Smokeys Men", gp: 1, w: 1 },
      { name: "Dave Moulds", team: "Churchills", gp: 1, w: 1 },
      { name: "Jan Galløv", team: "Captain 'N", gp: 1, w: 1 },
      { name: "Jay Cochrane", team: "Wobbly Dix", gp: 1, w: 1 },
      { name: "Kevin Pegram", team: "Royal Oak", gp: 1, w: 1 },
      { name: "Mirjam Van Harskamp", team: "Smokeys Hot Shotz", gp: 1, w: 1 },
      { name: "Peter Olsen", team: "Boulevard", gp: 1, w: 1 },
      { name: "Robbie Tester", team: "Smokeys Men", gp: 1, w: 1 },
      { name: "Kenny Hiron", team: "Royal Oak", gp: 7, w: 6 },
      { name: "Mateo Álvarez", team: "Smokeys Men", gp: 7, w: 6 },
      { name: "Alan Craine", team: "Penguin Potters", gp: 6, w: 5 },
      { name: "Dave English", team: "Churchills", gp: 6, w: 5 },
      { name: "Graham Dodsworth", team: "Royal Oak", gp: 6, w: 5 },
      { name: "Jim Edmunds", team: "El Barquito", gp: 6, w: 5 },
      { name: "John Williams", team: "Churchills", gp: 6, w: 5 },
      { name: "Steve Lewis", team: "Wobbly Dix", gp: 6, w: 5 },
      { name: "Steve Pote", team: "Royal Oak", gp: 6, w: 5 },
      { name: "Tanja Levälampi", team: "Wobbly Dix", gp: 6, w: 5 },
      { name: "Deb Rogers", team: "El Barquito", gp: 5, w: 4 },
      { name: "Dave Cross", team: "Royal Dix", gp: 4, w: 3 },
      { name: "Mark Walsh", team: "El Barquito", gp: 4, w: 3 },
      { name: "Martyn Hirst", team: "Boulevard", gp: 4, w: 3 },
      { name: "Andy Warrilow", team: "Royal Oak", gp: 7, w: 5 },
      { name: "Kev Mulligan", team: "Smokeys Men", gp: 7, w: 5 },
      { name: "Pekka Lohi", team: "Churchills", gp: 7, w: 5 },
      { name: "Ash Melvin", team: "Penguin Potters", gp: 6, w: 4 },
      { name: "Damien Mcgeoghegan", team: "Smokeys Men", gp: 6, w: 4 },
      { name: "Harry Demopoulos", team: "El Barquito", gp: 6, w: 4 },
      { name: "Kim Jensen", team: "Boulevard", gp: 6, w: 4 },
      { name: "Stuart Weeks", team: "Smokeys Men", gp: 6, w: 4 },
      { name: "Chris Thompson", team: "Churchills", gp: 3, w: 2 },
      { name: "Karl Martin", team: "El Barquito", gp: 3, w: 2 },
      { name: "Michael K Sørensen", team: "Captain 'N", gp: 3, w: 2 },
      { name: "Paul Hansford", team: "Smokeys Men", gp: 3, w: 2 },
      { name: "Rodolfo Espinosa Carvajal", team: "El Barquito", gp: 3, w: 2 },
      { name: "Sebastian Mellberg", team: "Smokeys Men", gp: 3, w: 2 },
      { name: "Stig Klitgaard", team: "Boulevard", gp: 3, w: 2 },
      { name: "Michel Catozzi", team: "Royal Dix", gp: 5, w: 3 },
      { name: "Tom Hughes", team: "Royal Dix", gp: 5, w: 3 },
      { name: "Colin Murdoch", team: "Royal Oak", gp: 7, w: 4 },
      { name: "Glyn Skeggs", team: "Churchills", gp: 7, w: 4 },
      { name: "Kurt Petersen", team: "Boulevard", gp: 7, w: 4 },
      { name: "Mike Kenny", team: "Royal Oak", gp: 7, w: 4 },
      { name: "Nic Light", team: "Royal Dix", gp: 6, w: 3 },
      { name: "Alexander Smedegaard", team: "Captain 'N", gp: 4, w: 2 },
      { name: "Andrea Durst", team: "Wobbly Dix", gp: 4, w: 2 },
      { name: "Ben Morgan", team: "Churchills Pink Ladies", gp: 4, w: 2 },
      { name: "Sean Darragh", team: "Smokeys Men", gp: 4, w: 2 },
      { name: "Sue Conner Dow", team: "Smokeys Hot Shotz", gp: 4, w: 2 },
      { name: "Thomas Ebert Sorensen", team: "Captain 'N", gp: 4, w: 2 },
      { name: "Tommy McGill", team: "Smokeys Men", gp: 4, w: 2 },
      { name: "Alfredo Vega", team: "Wobbly Dix", gp: 2, w: 1 },
      { name: "Kristian Kaae", team: "Boulevard", gp: 2, w: 1 },
      { name: "Sari Virtanen", team: "Wobbly Dix", gp: 2, w: 1 },
      { name: "Tobias Liedicke", team: "Captain 'N", gp: 2, w: 1 },
      { name: "Steve Flint", team: "Churchills", gp: 7, w: 3 },
      { name: "Edmee De Jong", team: "Smokeys Hot Shotz", gp: 5, w: 2 },
      { name: "Graham Cox", team: "Penguin Potters", gp: 5, w: 2 },
      { name: "Mia Ahrentorp", team: "Smokeys Hot Shotz", gp: 5, w: 2 },
      { name: "Nasrin Bijvoets", team: "Smokeys Hot Shotz", gp: 5, w: 2 },
      { name: "Pete Attrill", team: "Wobbly Dix", gp: 5, w: 2 },
      { name: "Sophie Martin", team: "El Barquito", gp: 5, w: 2 },
      { name: "Wendy Witney", team: "Penguin Potters", gp: 5, w: 2 },
      { name: "Bob Whelan", team: "Royal Dix", gp: 6, w: 2 },
      { name: "Paul Stedman", team: "Penguin Potters", gp: 6, w: 2 },
      { name: "Sam Shirmin", team: "Churchills Pink Ladies", gp: 6, w: 2 },
      { name: "Allan Pedersen", team: "Boulevard", gp: 3, w: 1 },
      { name: "Belinda Ottaway", team: "Wobbly Dix", gp: 3, w: 1 },
      { name: "Bernie Griffin", team: "Churchills Pink Ladies", gp: 3, w: 1 },
      { name: "Mejgan Mirani", team: "Churchills Pink Ladies", gp: 3, w: 1 },
      { name: "Nancy Hovik", team: "Smokeys Hot Shotz", gp: 3, w: 1 },
      { name: "Ole Christensen", team: "Captain 'N", gp: 3, w: 1 },
      { name: "Phil Roscoe", team: "Penguin Potters", gp: 3, w: 1 },
      { name: "Johannes Hoj", team: "Boulevard", gp: 7, w: 2 },
      { name: "Catherine Coombes", team: "Smokeys Hot Shotz", gp: 4, w: 1 },
      { name: "Geoff Pease", team: "Penguin Potters", gp: 4, w: 1 },
      { name: "Peter Bondersen", team: "Captain 'N", gp: 4, w: 1 },
      { name: "Peter Løvnes", team: "Captain 'N", gp: 4, w: 1 },
      { name: "Trevor Dunn", team: "El Barquito", gp: 4, w: 1 },
      { name: "Göran Nielsen", team: "Royal Dix", gp: 5, w: 1 },
      { name: "Stevie Ellis", team: "Churchills Pink Ladies", gp: 5, w: 1 },
      { name: "Ville Sorkkila", team: "Churchills", gp: 5, w: 1 },
      { name: "Alex Thibau", team: "Boulevard", gp: 6, w: 1 },
      { name: "Jayne Thompson", team: "Churchills Pink Ladies", gp: 5, w: 0 },
      { name: "Annette Ferris", team: "Churchills Pink Ladies", gp: 4, w: 0 },
      { name: "Lynne Mardle", team: "Churchills Pink Ladies", gp: 4, w: 0 },
      { name: "Ansku Karlsson", team: "Wobbly Dix", gp: 3, w: 0 },
      { name: "Johnny K Sørensen", team: "Captain 'N", gp: 3, w: 0 },
      { name: "Martin Holm", team: "Captain 'N", gp: 3, w: 0 },
      { name: "Mick Riisersen", team: "Captain 'N", gp: 3, w: 0 },
      { name: "Vera Wubs", team: "Smokeys Hot Shotz", gp: 3, w: 0 },
      { name: "Claire Lerigo", team: "Smokeys Hot Shotz", gp: 2, w: 0 },
      { name: "Sarah Mcgeoghegan", team: "Smokeys Hot Shotz", gp: 2, w: 0 },
      { name: "Steve Barker", team: "Wobbly Dix", gp: 2, w: 0 },
      { name: "Ana Ramos", team: "Royal Dix", gp: 1, w: 0 },
      { name: "Bjarne Krogh", team: "Boulevard", gp: 1, w: 0 },
      { name: "David Asghedom", team: "Boulevard", gp: 1, w: 0 },
      { name: "Debbie Klockmann", team: "Captain 'N", gp: 1, w: 0 },
      { name: "Don Collin", team: "Penguin Potters", gp: 1, w: 0 },
      { name: "Geordie Northend", team: "Royal Oak", gp: 1, w: 0 },
      { name: "Jeanette Mat", team: "Churchills Pink Ladies", gp: 1, w: 0 },
      { name: "Mads Jacob Sørensen", team: "Captain 'N", gp: 1, w: 0 },
      { name: "Mary Lawes", team: "Smokeys Hot Shotz", gp: 1, w: 0 },
      { name: "Michael Kop", team: "Boulevard", gp: 1, w: 0 },
      { name: "Mike Johnson", team: "Wobbly Dix", gp: 1, w: 0 },
      { name: "Paula Metcalfe", team: "Churchills Pink Ladies", gp: 1, w: 0 },
      { name: "Ramona Svensson", team: "Wobbly Dix", gp: 1, w: 0 },
      { name: "Shelly Barne", team: "Smokeys Hot Shotz", gp: 1, w: 0 }
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
    { wk: "5",     date: "2026-11-12", venue: "home", opp: "Boulevard",              result: { us: 6, them: 4 } },
    { wk: "6",     date: "2026-11-19", venue: "away", opp: "Smokeys Men",            result: { us: 4, them: 6 } },
    { wk: "7",     date: "2026-11-26", venue: "home", opp: "El Barquito",            result: { us: 4, them: 6 } },
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
