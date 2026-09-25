import { neon, NeonQueryFunction } from "@neondatabase/serverless";

// Built lazily, on first actual query, rather than at module load — so
// `next build` (which imports every route to collect its metadata) doesn't
// blow up in environments where DATABASE_URL isn't set yet, e.g. before the
// Neon integration has been added on Vercel.
let client: NeonQueryFunction<false, false> | null = null;

function getClient(): NeonQueryFunction<false, false> {
  if (!client) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error(
        "DATABASE_URL is not set. Add a Postgres database (e.g. the Neon integration on Vercel, or a local .env.local) and set DATABASE_URL — see .env.example."
      );
    }
    client = neon(connectionString);
  }
  return client;
}

export const sql: NeonQueryFunction<false, false> = ((...args: Parameters<NeonQueryFunction<false, false>>) =>
  getClient()(...args)) as NeonQueryFunction<false, false>;

let schemaReady: Promise<void> | null = null;

/**
 * Creates all tables if they don't already exist. Safe to call on every
 * request — the promise is cached per server instance so the DDL only
 * actually runs once per cold start.
 */
export function ensureSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS players (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL DEFAULT '',
          goal_idxs INTEGER[] NOT NULL DEFAULT '{}',
          created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS player_progress (
          player_id TEXT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
          step_index INTEGER NOT NULL,
          done BOOLEAN NOT NULL DEFAULT true,
          updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
          PRIMARY KEY (player_id, step_index)
        )
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS player_goals (
          player_id TEXT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
          goal_index INTEGER NOT NULL,
          forged BOOLEAN NOT NULL DEFAULT true,
          updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
          PRIMARY KEY (player_id, goal_index)
        )
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS player_stash (
          player_id TEXT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
          material_name TEXT NOT NULL,
          have_qty INTEGER NOT NULL DEFAULT 0,
          updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
          PRIMARY KEY (player_id, material_name)
        )
      `;
    })();
  }
  return schemaReady;
}

// A player id is a client-generated UUID (see lib/identity.ts). Reject
// anything that doesn't look like one before it touches the database.
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isValidPlayerId(id: unknown): id is string {
  return typeof id === "string" && UUID_RE.test(id);
}
