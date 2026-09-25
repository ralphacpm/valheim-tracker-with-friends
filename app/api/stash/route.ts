import { NextRequest, NextResponse } from "next/server";
import { ensureSchema, isValidPlayerId, sql } from "@/lib/db";

// Sets how many of a material a player currently has on hand.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const { playerId, material, qty } = body ?? {};

  if (!isValidPlayerId(playerId)) {
    return NextResponse.json({ error: "invalid playerId" }, { status: 400 });
  }
  if (typeof material !== "string" || !material.trim() || material.length > 60) {
    return NextResponse.json({ error: "invalid material" }, { status: 400 });
  }
  const safeQty = Math.max(0, Math.round(Number(qty) || 0));

  await ensureSchema();

  if (safeQty === 0) {
    await sql`
      DELETE FROM player_stash
      WHERE player_id = ${playerId} AND material_name = ${material}
    `;
  } else {
    await sql`
      INSERT INTO player_stash (player_id, material_name, have_qty, updated_at)
      VALUES (${playerId}, ${material}, ${safeQty}, now())
      ON CONFLICT (player_id, material_name) DO UPDATE
        SET have_qty = EXCLUDED.have_qty, updated_at = now()
    `;
  }

  return NextResponse.json({ ok: true });
}
