import { NextRequest, NextResponse } from "next/server";
import { ensureSchema, isValidPlayerId, sql } from "@/lib/db";

// Returns everything needed to hydrate this browser's own state:
// profile (name + chosen goals), which steps are done, which goals are
// forged, and material stash quantities.
export async function GET(req: NextRequest) {
  const playerId = req.nextUrl.searchParams.get("playerId");
  if (!isValidPlayerId(playerId)) {
    return NextResponse.json({ error: "invalid playerId" }, { status: 400 });
  }

  await ensureSchema();

  const [players, progressRows, goalRows, stashRows] = await Promise.all([
    sql`SELECT id, name, goal_idxs FROM players WHERE id = ${playerId}`,
    sql`SELECT step_index FROM player_progress WHERE player_id = ${playerId} AND done = true`,
    sql`SELECT goal_index FROM player_goals WHERE player_id = ${playerId} AND forged = true`,
    sql`SELECT material_name, have_qty FROM player_stash WHERE player_id = ${playerId}`,
  ]);

  const player = players[0] ?? null;

  return NextResponse.json({
    player: player
      ? { id: player.id, name: player.name, goalIdxs: player.goal_idxs }
      : null,
    doneSteps: progressRows.map((r) => r.step_index as number),
    forgedGoals: goalRows.map((r) => r.goal_index as number),
    stash: Object.fromEntries(
      stashRows.map((r) => [r.material_name as string, r.have_qty as number])
    ),
  });
}
