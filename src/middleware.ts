import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_COOKIE_NAME = "admin_token";
const STATIC_AUTH_TOKEN = "auth_valid_session_token_wedding2025";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  // 1. Allow login page unconditionally
  if (pathname === "/admin/login") {
    // If already authenticated, redirect to /admin directly
    if (token === STATIC_AUTH_TOKEN) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  // 2. Protect all other /admin routes
  if (pathname.startsWith("/admin")) {
    if (!token || token !== STATIC_AUTH_TOKEN) {
      const loginUrl = new URL("/admin/login", request.url);
      // Optional: keep track of redirect path
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
