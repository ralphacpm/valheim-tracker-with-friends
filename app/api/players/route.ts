import { NextRequest, NextResponse } from "next/server";
import { ensureSchema, isValidPlayerId, sql } from "@/lib/db";
import { PLAYER_ID_COOKIE } from "@/lib/identity";

// Upserts a player's identity (name + chosen goals). Called once on
// onboarding submit, and whenever the player edits their profile.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const { playerId, name, goalIdxs } = body ?? {};

  if (!isValidPlayerId(playerId)) {
    return NextResponse.json({ error: "invalid playerId" }, { status: 400 });
  }

  await ensureSchema();

  const safeName = typeof name === "string" ? name.slice(0, 30) : "";
  const safeGoalIdxs = Array.isArray(goalIdxs)
    ? goalIdxs.filter((n) => Number.isInteger(n)).slice(0, 50)
    : [];

  const rows = await sql`
    INSERT INTO players (id, name, goal_idxs, updated_at)
    VALUES (${playerId}, ${safeName}, ${safeGoalIdxs}, now())
    ON CONFLICT (id) DO UPDATE
      SET name = EXCLUDED.name,
          goal_idxs = EXCLUDED.goal_idxs,
          updated_at = now()
    RETURNING id, name, goal_idxs
  `;

  const res = NextResponse.json({ player: rows[0] });
  // Persist the id server-side too, so a browser that keeps cookies but
  // clears localStorage (or vice versa) can still be reconciled.
  res.cookies.set(PLAYER_ID_COOKIE, playerId, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  });
  return res;
}
