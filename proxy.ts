import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

// The session as Auth.js wrote it: on an https site its cookie is `__Secure-authjs.session-token`, on
// http `authjs.session-token`. Behind a proxy (Coolify) the request reaching the app is http, so its
// URL cannot tell which one: both are tried.
const getSessionToken = async (req: NextRequest) => {
  const secret = process.env.AUTH_SECRET;

  return (
    (await getToken({ req, secret, secureCookie: true })) ??
    (await getToken({ req, secret, secureCookie: false }))
  );
};

export const proxy = async (req: NextRequest) => {
  const token = await getSessionToken(req);
  const isAuthenticated = Boolean(token?.sub);
  const isUserPanelRoute = req.nextUrl.pathname.startsWith("/user-panel");
  const isAuthRoute =
    req.nextUrl.pathname.startsWith("/login") ||
    req.nextUrl.pathname.startsWith("/register");

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
