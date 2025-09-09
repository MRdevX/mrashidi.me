import { type NextRequest, NextResponse } from "next/server";
import { auth0 } from "./lib/auth0";

export async function middleware(request: NextRequest) {
  // Handle Auth0 API routes
  if (request.nextUrl.pathname.startsWith("/api/auth")) {
    return auth0.middleware(request);
  }

  // Let the admin layout handle authentication
  // This prevents double authentication checks
  return NextResponse.next();
}

export const config = {
  matcher: ["/api/auth/:path*"],
};
