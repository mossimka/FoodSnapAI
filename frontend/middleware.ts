import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;

  const protectedPaths = ["/profile"];
  const currentPath = request.nextUrl.pathname;

  const isProtected = protectedPaths.some((path) => currentPath.startsWith(path));

  if (isProtected && !token) {
    const signInUrl = new URL("/signin", request.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*"],
};
