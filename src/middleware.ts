import { NextRequest, NextResponse } from "next/server";
import { COOKIE_KEYS } from "./constants/local-storage-keys";

export function middleware(req: NextRequest) {
  const token = req.cookies.get(COOKIE_KEYS.TOKEN);

  const isAuthPage = ["/login", "/signup"].includes(req.nextUrl.pathname);
  const isProtectedPage = ["/"].includes(req.nextUrl.pathname);

  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (isProtectedPage && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next(); // Allow access
}

export const config = {
  matcher: ["/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)"],
};
