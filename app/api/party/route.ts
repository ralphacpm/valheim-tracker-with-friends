import { NextResponse } from "next/server";
import { ensureSchema, sql } from "@/lib/db";
import { readinessStepCount } from "@/lib/data";

// Live roster: every player who has onboarded, with their "readiness" (%
// of "Before You Sail" prep steps done — NOT the whole Path, and NOT
// related to which goals they picked) and how many goals they've forged.
// Polled from the client every few seconds — this is the whole point of
// the rewrite.
export async function GET() {
  await ensureSchema();

  const rows = await sql`
    SELECT
      p.id,
      p.name,
      p.goal_idxs,
      COALESCE(prog.readiness_done, 0) AS readiness_done,
      COALESCE(forged.forged_count, 0) AS forged_count
    FROM players p
    LEFT JOIN (
      SELECT player_id, COUNT(*) AS readiness_done
      FROM player_progress
      WHERE done = true AND step_index < ${readinessStepCount}
      GROUP BY player_id
    ) prog ON prog.player_id = p.id
    LEFT JOIN (
      SELECT player_id, COUNT(*) AS forged_count
      FROM player_goals
      WHERE forged = true
      GROUP BY player_id
    ) forged ON forged.player_id = p.id
    WHERE p.name <> ''
    ORDER BY p.created_at ASC
  `;

  const members = rows.map((r) => ({
    id: r.id as string,
    name: r.name as string,
    goalCount: ((r.goal_idxs as number[]) || []).length,
    readinessDone: Number(r.readiness_done),
    readinessTotal: readinessStepCount,
    forgedCount: Number(r.forged_count),
  }));

  return NextResponse.json({ members });
}
