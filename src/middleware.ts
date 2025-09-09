import { type NextRequest, NextResponse } from "next/server";
import { auth0 } from "./lib/auth0";

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api/auth")) {
    return auth0.middleware(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/auth/:path*"],
};
