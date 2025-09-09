import type { NextRequest, NextResponse } from "next/server";

export function addSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set("X-Content-Type-Options", "nosniff");

  response.headers.set("X-XSS-Protection", "1; mode=block");

  response.headers.set("X-Frame-Options", "DENY");

  response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");

  response.headers.set("Content-Security-Policy", "default-src 'none'; frame-ancestors 'none';");

  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  return response;
}

export function withSecurityHeaders<T extends NextRequest>(handler: (request: T) => Promise<NextResponse>) {
  return async (request: T): Promise<NextResponse> => {
    const response = await handler(request);
    return addSecurityHeaders(response);
  };
}
