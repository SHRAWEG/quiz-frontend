import { NextRequest, NextResponse } from "next/server";
import { LOCAL_STORAGE_KEYS } from "./constants/local-storage-keys";

export function middleware(req: NextRequest) {
  console.log("Middleware enter");
  const user = req.cookies.get(LOCAL_STORAGE_KEYS.USER);

  console.log("PATH NAME : ", req.nextUrl.pathname);
  console.log("cookies : ", user);
  const isAuthPage = ["/login", "/signup"].includes(req.nextUrl.pathname);
  const isProtectedPage = ["/"].includes(req.nextUrl.pathname);

  console.log("con 1 : ", isAuthPage && user);
  console.log("con 2 : ", isProtectedPage && !user);
  if (isAuthPage && user) {
    console.log("Middleware exit 1");
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (isProtectedPage && !user) {
    console.log("Middleware exit 2");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  console.log("Middleware exit");
  return NextResponse.next(); // Allow access
}

export const config = {
  matcher: ["/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)"],
};
