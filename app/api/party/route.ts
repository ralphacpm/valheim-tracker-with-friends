import { NextResponse } from "next/server";
import { ensureSchema, sql } from "@/lib/db";
import { steps } from "@/lib/data";

// Live roster: every player who has onboarded, with their % of steps done
// and how many goals they've forged. Polled from the client every few
// seconds — this is the whole point of the rewrite.
export async function GET() {
  await ensureSchema();

  const rows = await sql`
    SELECT
      p.id,
      p.name,
      p.goal_idxs,
      COALESCE(prog.steps_done, 0) AS steps_done,
      COALESCE(forged.forged_count, 0) AS forged_count
    FROM players p
    LEFT JOIN (
      SELECT player_id, COUNT(*) AS steps_done
      FROM player_progress
      WHERE done = true
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
    stepsDone: Number(r.steps_done),
    stepsTotal: steps.length,
    forgedCount: Number(r.forged_count),
  }));

  return NextResponse.json({ members });
}
