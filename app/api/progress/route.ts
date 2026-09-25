import { NextRequest, NextResponse } from "next/server";
import { ensureSchema, isValidPlayerId, sql } from "@/lib/db";
import { steps } from "@/lib/data";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const { playerId, stepIndex, done } = body ?? {};

  if (!isValidPlayerId(playerId)) {
    return NextResponse.json({ error: "invalid playerId" }, { status: 400 });
  }
  if (
    !Number.isInteger(stepIndex) ||
    stepIndex < 0 ||
    stepIndex >= steps.length
  ) {
    return NextResponse.json({ error: "invalid stepIndex" }, { status: 400 });
  }

  await ensureSchema();

  if (done) {
    await sql`
      INSERT INTO player_progress (player_id, step_index, done, updated_at)
      VALUES (${playerId}, ${stepIndex}, true, now())
      ON CONFLICT (player_id, step_index) DO UPDATE
        SET done = true, updated_at = now()
    `;
  } else {
    await sql`
      DELETE FROM player_progress
      WHERE player_id = ${playerId} AND step_index = ${stepIndex}
    `;
  }

  return NextResponse.json({ ok: true });
}
