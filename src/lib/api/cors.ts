import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { reflectedCorsOrigin } from "@/lib/api/cors-allowlist";
import { API_CONFIG } from "@/lib/core";

/** Vary ACAO responses when reflecting origin (shared caches). */
const CORS_VARY = "Origin";

function mergeVaryHeader(existing: string | null, directives: string): string {
  const parts = [
    ...(existing
      ?.split(",")
      .map((part) => part.trim())
      .filter(Boolean) ?? []),
    ...directives
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean),
  ];
  return [...new Set(parts)].sort().join(", ");
}

export function buildCorsHeaders(origin: string | null): Record<string, string> | undefined {
  const { ALLOWED_METHODS, ALLOWED_HEADERS, MAX_AGE } = API_CONFIG.CORS;

  const allowedOrigin = reflectedCorsOrigin(origin);
  if (!allowedOrigin) {
    return undefined;
  }

  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    Vary: CORS_VARY,
    "Access-Control-Allow-Methods": ALLOWED_METHODS.join(", "),
    "Access-Control-Allow-Headers": ALLOWED_HEADERS.join(", "),
    "Access-Control-Max-Age": MAX_AGE.toString(),
  };
}

export function handleCorsPrelight(request: NextRequest): NextResponse {
  const origin = request.headers.get("origin");
  const corsHeaders = buildCorsHeaders(origin);

  if (!corsHeaders) {
    return new NextResponse(null, {
      status: 403,
    });
  }

  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export function withCors(handler: (request: NextRequest) => Promise<NextResponse>) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const origin = request.headers.get("origin");
    const response = await handler(request);

    const corsHeaders = buildCorsHeaders(origin);
    if (!corsHeaders) {
      return response;
    }

    for (const [key, value] of Object.entries(corsHeaders)) {
      if (key === "Vary") {
        response.headers.set(key, mergeVaryHeader(response.headers.get("vary"), value));
      } else {
        response.headers.set(key, value);
      }
    }

    return response;
  };
}

export function isCorsPrelight(request: NextRequest): boolean {
  return request.method === "OPTIONS" && request.headers.get("origin") !== null;
}
