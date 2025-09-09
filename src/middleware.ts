import { type NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Allow access to login page without authentication
  if (request.nextUrl.pathname === "/admin/login") {
    return NextResponse.next();
  }

  // For now, we'll handle authentication in the layout components
  // The middleware will be enhanced once we have proper Auth0 middleware support
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
