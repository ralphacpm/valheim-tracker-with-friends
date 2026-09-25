import { NextRequest, NextResponse } from "next/server";
import { PASSCODE_COOKIE } from "@/lib/identity";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const passcode = body?.passcode;
  const expected = process.env.PARTY_PASSCODE;

  if (!expected) {
    // Gate isn't configured — nothing to check against.
    return NextResponse.json({ ok: true });
  }

  if (typeof passcode !== "string" || passcode !== expected) {
    return NextResponse.json({ error: "wrong passcode" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(PASSCODE_COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  });
  return res;
}
