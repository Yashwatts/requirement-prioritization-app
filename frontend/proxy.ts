import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE_NAME = "requirement-prioritization-session";

const PUBLIC_ROUTES = ["/login"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);
  let hasValidSession = false;

  if (sessionCookie?.value) {
    try {
      const parsedSession = JSON.parse(decodeURIComponent(sessionCookie.value));
      if (parsedSession?.expiresAt && parsedSession.expiresAt > Date.now()) {
        hasValidSession = true;
      }
    } catch {
      hasValidSession = Boolean(sessionCookie.value);
    }
  }

  if (pathname === "/") {
    const target = hasValidSession ? "/dashboard" : "/login";
    return NextResponse.redirect(new URL(target, request.url));
  }

  if (!hasValidSession && !isPublicRoute) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    if (sessionCookie) {
      response.cookies.delete(SESSION_COOKIE_NAME);
    }
    return response;
  }

  if (hasValidSession && isPublicRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|login-background|.*\\.svg$|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.ico$|.*\\.webp$).*)",
  ],
};
