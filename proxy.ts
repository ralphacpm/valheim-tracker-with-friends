import { NextRequest, NextResponse } from "next/server";
import { PASSCODE_COOKIE } from "@/lib/identity";

// Gates the whole app behind a shared party passcode, when PARTY_PASSCODE
// is set. Leave it unset to keep the app open to anyone with the link.
export function proxy(req: NextRequest) {
  const expected = process.env.PARTY_PASSCODE;
  if (!expected) return NextResponse.next();

  const { pathname } = req.nextUrl;
  const isExempt =
    pathname === "/unlock" ||
    pathname === "/api/passcode" ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon");

  if (isExempt) return NextResponse.next();

  const ok = req.cookies.get(PASSCODE_COOKIE)?.value === "1";
  if (ok) return NextResponse.next();

  if (pathname.startsWith("/api")) {
    return NextResponse.json({ error: "locked" }, { status: 401 });
  }

  const url = req.nextUrl.clone();
  url.pathname = "/unlock";
  url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
