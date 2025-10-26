import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { API_CONFIG } from "@/lib/core";

/**
 * Get CORS headers based on the request origin
 */
export function getCorsHeaders(origin?: string | null): Record<string, string> {
  const { ALLOWED_ORIGINS, ALLOWED_METHODS, ALLOWED_HEADERS, MAX_AGE } = API_CONFIG.CORS;

  const isAllowedOrigin = origin && ALLOWED_ORIGINS.includes(origin);
  const allowOrigin = isAllowedOrigin ? origin : ALLOWED_ORIGINS[0];

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": ALLOWED_METHODS.join(", "),
    "Access-Control-Allow-Headers": ALLOWED_HEADERS.join(", "),
    "Access-Control-Max-Age": MAX_AGE.toString(),
  };
}

/**
 * Handle CORS preflight requests (OPTIONS)
 */
export function handleCorsPrelight(request: NextRequest): NextResponse {
  const origin = request.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);

  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

/**
 * Middleware wrapper to add CORS headers to responses
 */
export function withCors(handler: (request: NextRequest) => Promise<NextResponse>) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const origin = request.headers.get("origin");
    const response = await handler(request);

    const corsHeaders = getCorsHeaders(origin);
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  };
}

/**
 * Check if a request is a CORS preflight request
 */
export function isCorsPrelight(request: NextRequest): boolean {
  return request.method === "OPTIONS" && request.headers.get("origin") !== null;
}
