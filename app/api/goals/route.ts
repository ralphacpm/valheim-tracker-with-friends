import { NextRequest, NextResponse } from "next/server";
import { ensureSchema, isValidPlayerId, sql } from "@/lib/db";
import { goals } from "@/lib/data";

// Toggles the "forged" state for one of a player's chosen weapons/staves.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const { playerId, goalIndex, forged } = body ?? {};

  if (!isValidPlayerId(playerId)) {
    return NextResponse.json({ error: "invalid playerId" }, { status: 400 });
  }
  if (
    !Number.isInteger(goalIndex) ||
    goalIndex < 0 ||
    goalIndex >= goals.length
  ) {
    return NextResponse.json({ error: "invalid goalIndex" }, { status: 400 });
  }

  await ensureSchema();

  if (forged) {
    await sql`
      INSERT INTO player_goals (player_id, goal_index, forged, updated_at)
      VALUES (${playerId}, ${goalIndex}, true, now())
      ON CONFLICT (player_id, goal_index) DO UPDATE
        SET forged = true, updated_at = now()
    `;
  } else {
    await sql`
      DELETE FROM player_goals
      WHERE player_id = ${playerId} AND goal_index = ${goalIndex}
    `;
  }

  return NextResponse.json({ ok: true });
}
