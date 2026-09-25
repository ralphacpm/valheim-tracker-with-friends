-- Wipes all player data for a fresh playthrough, without dropping tables
-- (so the app keeps working immediately after you run this).
--
-- Run it from the Neon SQL editor (or `psql "$DATABASE_URL" -f scripts/reset-db.sql`).
TRUNCATE TABLE player_stash, player_goals, player_progress, players RESTART IDENTITY CASCADE;
