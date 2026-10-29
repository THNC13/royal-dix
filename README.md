# Royal Dix site

A plain website (no build step) with a small optional "rules assistant" function.

```
index.html          team page (fixtures, league table, player rankings, squad)
rules.html          rules page + rule finder
data/data.js        THE FILE YOU EDIT EACH WEEK
data/rules.json     the rules (used by the page and by the assistant)
functions/api/ask.js  the rules assistant (Cloudflare Pages Function)
css/ js/ assets/    look, behaviour, badge
```

## 1. Put it on GitHub (no coding tools needed)
1. Sign in at github.com, click **+** (top right) > **New repository**. Name it `royal-dix`, keep it **Private** if you like, click **Create repository**.
2. Unzip `royal-dix-site.zip` on your computer.
3. On the new repo page click **uploading an existing file**.
4. Drag in the **contents** of the unzipped folder (`index.html`, `rules.html`, and the `css`, `js`, `data`, `assets`, `functions` folders), not the zip itself. Wait for the upload to finish.
5. Click **Commit changes**.

## 2. Put it live on Cloudflare Pages
1. Cloudflare dashboard > **Workers & Pages** > **Create** > **Pages** > **Connect to Git**.
2. Authorise GitHub and pick the `royal-dix` repo > **Begin setup**.
3. Framework preset: **None**. Build command: leave empty. Build output directory: leave empty (or `/` if it insists).
4. **Save and Deploy**. After a minute you get an address like `royal-dix.pages.dev`.
5. Optional: **Custom domains** tab to use your own domain.

If Cloudflare creates it as a **Worker** instead of a Pages project (its newer "Import a repository" flow does this), that also works: `wrangler.jsonc`, `src/worker.js` and `.assetsignore` in this repo tell it to publish the site files and run the rules assistant. Leave the build command empty and keep the default deploy command (`npx wrangler deploy`).

From now on, every change you commit on GitHub goes live by itself in about a minute.

## 3. Switch on the rules assistant (optional)
The Rules page works without this (search + all rules). The "Ask the rules assistant" button needs a key:
1. Create an account at console.anthropic.com (this is separate from a Claude chat subscription and is pay-as-you-go), add a little credit, and set a low monthly spend limit.
2. Create an API key and copy it.
3. In Cloudflare: your Pages project > **Settings** > **Variables and Secrets** > add:
   - `ANTHROPIC_API_KEY` = your key (type: **Secret**)
   - `TEAM_CODE` = any word the team will use (type: **Secret**). Stops strangers using up your credit. Share it only with the team.
4. **Deployments** > the latest one > **Retry deployment** so the new settings load.
5. Open the Rules page, ask a question, enter the team code when asked. It's remembered on that phone.

Never paste the key into any file in the repo.

## Weekly update
On GitHub open `data/data.js`, click the pencil icon, change the numbers, then **Commit changes**.

- **league**: update each team's `p w l f a pts`. Keep the rows in the same order as the official table.
- **players**: add each frame to the end of the player's `results` list, in order: `"3S-W"` = week 3 singles, won. `"3D-L"` = week 3 doubles, lost. Singles drive the league-style ranking; doubles feed our own table.
- **leagueRanking**: when the league publishes its player ranking, set `published: true` and copy the rows in the league's order (`name`, `team`, `gp`, `w`). Royal Dix rows highlight themselves.
- **new player**: add a line to `players` with the next ball number (the rack on the page fills in by itself).
- **fixtures**: set `result: { us: 6, them: 4 }` (league points) once played.
- **lastUpdated** and **leagueAfterWeek**: bump the date and week number.

Or just send the screenshots and have Claude prepare the updated `data.js`.

## Pages and match day

Every tab is its own page: `index.html` (home), `players.html`, `league-ranking.html`, `table.html`, `fixtures.html`, `team.html`, `rules.html`.
The tabs, the match-day ticker and the footer are built by `js/common.js`, so they are the same everywhere.

Match day is automatic: if a fixture in `data/data.js` has today's date and no result yet, a pop-up appears (once per visit) and then drops into a scrolling red ticker along the top of every page. To test it, add `?today=2026-10-29` to any page address.

## Memories (photo album)

`photos.html` lets anyone with the link add photos; they are shrunk on the phone and stored in a Cloudflare **KV** namespace bound as `PHOTOS` (see `src/photos.js`).
To switch it on: Cloudflare dashboard, Storage & Databases, KV, create a namespace called `royal-dix-photos`, then add this to `wrangler.jsonc` (using its ID):

    "kv_namespaces": [{ "binding": "PHOTOS", "id": "<namespace id>" }]

Whoever adds a photo can delete it from the same phone (a private token is kept in the browser). The `TEAM_CODE` secret lets a captain delete any photo.

## Rules assistant: free or paid

By default the assistant uses Cloudflare's free built-in AI (`ai` binding in `wrangler.jsonc`), with a daily free allowance and no key.
For better answers, add an `ANTHROPIC_API_KEY` secret in Cloudflare and it will use Claude instead. Add a `TEAM_CODE` secret to make people type a code first.
