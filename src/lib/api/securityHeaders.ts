import type { NextRequest, NextResponse } from "next/server";

export function addSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set("X-Content-Type-Options", "nosniff");

  response.headers.set("X-XSS-Protection", "1; mode=block");

  response.headers.set("X-Frame-Options", "DENY");

  response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");

  response.headers.set("Content-Security-Policy", "default-src 'none'; frame-ancestors 'none';");

  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  response.headers.set("Access-Control-Max-Age", "86400");

  return response;
}

export function withSecurityHeaders<T extends NextRequest>(handler: (request: T) => Promise<NextResponse>) {
  return async (request: T): Promise<NextResponse> => {
    const response = await handler(request);
    return addSecurityHeaders(response);
  };
}
