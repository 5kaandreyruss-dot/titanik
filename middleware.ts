import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "titanik_session";
const PROTECTED_PREFIXES = ["/menu", "/play", "/profile", "/achievements", "/leaderboard", "/archive", "/premium", "/admin"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/menu/:path*", "/play/:path*", "/profile/:path*", "/achievements/:path*", "/leaderboard/:path*", "/archive/:path*", "/premium/:path*", "/admin/:path*"],
};
