# Mistlands Progression Tracker

A shared Valheim progression tracker for a 6-person crew heading into the
Mistlands biome — from Yagluth's death to The Queen. Rebuilt from a
single-file `localStorage`-only page into a real Next.js app with a shared
Postgres database, so **Party Status actually works** across everyone's
devices.

## Stack

- **Next.js (App Router)** — pages, API routes, everything in one app.
- **Postgres via Neon** (the `@neondatabase/serverless` driver) — the
  successor to the old "Vercel Postgres" product; add it from the Vercel
  dashboard's Storage tab (Marketplace Database Providers → Neon) and it
  wires up `DATABASE_URL` automatically.
- **SWR** — polls `/api/party` every 4 seconds so everyone's progress bars
  stay live without a websocket.
- Plain CSS (ported from the original page's `<style>` block) + Tailwind's
  base layer, so the Viking/carved-stone theme matches the original
  pixel-for-pixel.

## Identity model

There's no real auth. On first visit, each browser generates a random
UUID (stored in `localStorage`), which becomes that player's id. Onboarding
asks for a name and which weapons/staves they're targeting, then upserts a
`players` row keyed by that UUID. The id is also written to an httpOnly
cookie as a backup, so a browser that clears `localStorage` but keeps
cookies (or vice versa) can still be reconciled. If someone loses both,
they just re-onboard — an acceptable failure mode for a friend-group tool.

Optionally, set `PARTY_PASSCODE` to gate the whole app behind a single
shared passcode (`/unlock`) so it's not fully public to anyone with the
link.

## Data model

- `players` — id (client UUID), name, goal_idxs (which weapons/staves they
  picked at onboarding).
- `player_progress` — one row per (player, step) they've checked off.
- `player_goals` — one row per (player, weapon) they've marked as forged.
- `player_stash` — one row per (player, material) with how many they have.

The step list, weapon/staff recipes, and material sourcing notes are
static data in `lib/data.ts` — they aren't stored in the database. The
first `readinessStepCount` entries of `steps` are the "Before You Sail"
prep steps; that's the scope "readiness" in Party Status is computed over
(see `app/api/party/route.ts`) — it's independent of which goals a player
picked or forged.

There's no separate "Gear to Forge" checklist — the harvesting tools that
used to live there (Black Metal Axe, Pickaxe, Dvergr Extractor, Wisplight)
are tracked once, as steps in "Before You Sail" / "In the Mistlands",
rather than duplicated in a second sidebar list.

## Running locally

```bash
npm install
cp .env.example .env.local   # fill in DATABASE_URL (and PARTY_PASSCODE if you want it)
npm run dev
```

Open http://localhost:3000. Tables are created automatically on first
request (`ensureSchema()` in `lib/db.ts`) — no separate migration step.

## Deploying to Vercel

1. Push this repo to GitHub and import it in Vercel.
2. In the project's **Storage** tab, add a Neon Postgres database
   (Marketplace Database Providers → Neon) — this sets `DATABASE_URL`
   automatically. Or connect any other Postgres and set `DATABASE_URL`
   yourself in **Settings → Environment Variables**.
3. Optionally set `PARTY_PASSCODE` as an environment variable.
4. Deploy. The first request creates the tables.

## Starting a fresh playthrough

To wipe everyone's progress (new playthrough, same app):

```bash
psql "$DATABASE_URL" -f scripts/reset-db.sql
```

or paste `scripts/reset-db.sql` into the Neon SQL editor. This clears all
players, progress, forged goals, and stash — the tables themselves stay in
place, so nobody needs to re-deploy. Everyone's browser will show the
onboarding screen again next time they open the page.

Browser identity (the player UUID) lives in `localStorage`, so clearing
the shared database won't reset that — ask everyone to hit **Reset
Checklist** on the page, or clear site data in their browser, if you want
a truly clean slate.
