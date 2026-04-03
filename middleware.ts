import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export const middleware = async (req: NextRequest) => {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  const isAuthenticated = Boolean(token?.sub);
  const isUserPanelRoute = req.nextUrl.pathname.startsWith("/user-panel");
  const isAuthRoute = req.nextUrl.pathname.startsWith("/login") || req.nextUrl.pathname.startsWith("/register");

  if (isUserPanelRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/user-panel", req.nextUrl));
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/user-panel/:path*", "/login", "/register"],
};
