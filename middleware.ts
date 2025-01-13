import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export { default } from "next-auth/middleware";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXT_AUTH_SECRET! });

  const currentUrl = req.nextUrl;

  if (
    !token &&
    (currentUrl.pathname === "/home" ||
      currentUrl.pathname === "/admin" ||
      currentUrl.pathname.startsWith("/watch") ||
      currentUrl.pathname.startsWith("/course"))
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (
    token &&
    currentUrl.pathname.startsWith("/admin") &&
    token.email !== process.env.ADMIN_EMAIL
  ) {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  if (token && currentUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/home", req.url));
  }
}

export const config = {
  matcher: ["/", "/home", "/admin", "/watch/:path*", "/course/:path*"],
};
