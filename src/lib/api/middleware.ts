import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { API_CONFIG } from "@/lib/core";
import { APIError, handleError, logError } from "@/lib/errors";
import { checkRateLimit, getClientIdentifier, type RateLimiterType } from "@/services/rate-limit.service";
import { createErrorResponse } from "./response";
import { addSecurityHeaders } from "./securityHeaders";
import type { ApiHandler } from "./types";

export function withErrorHandling(handler: ApiHandler): ApiHandler {
  return async (request: NextRequest) => {
    try {
      return await handler(request);
    } catch (error) {
      const appError = handleError(error);
      logError(appError, "API");
      return createErrorResponse(appError, appError.statusCode || 500);
    }
  };
}

export function withAuth(expectedToken: string): (handler: ApiHandler) => ApiHandler {
  return (handler: ApiHandler): ApiHandler => {
    return withErrorHandling(async (request: NextRequest) => {
      const authHeader = request.headers.get("authorization");
      if (!expectedToken || authHeader !== `Bearer ${expectedToken}`) {
        throw new APIError("Unauthorized", 401);
      }
      return await handler(request);
    });
  };
}

export function withValidation<T>(
  handler: (request: NextRequest, validatedData: T) => Promise<NextResponse>,
  validator: (data: unknown) => T
): ApiHandler {
  return withErrorHandling(async (request: NextRequest) => {
    const body = await request.json();
    const validatedData = validator(body);
    return await handler(request, validatedData);
  });
}

export function withPagination(
  handler: (request: NextRequest, pagination: { page: number; limit: number }) => Promise<NextResponse>
): ApiHandler {
  return withErrorHandling(async (request: NextRequest) => {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || API_CONFIG.PAGINATION.DEFAULT_PAGE.toString(), 10);
    const limit = parseInt(searchParams.get("limit") || API_CONFIG.PAGINATION.DEFAULT_LIMIT.toString(), 10);

    return await handler(request, {
      page: Math.max(1, page),
      limit: Math.min(API_CONFIG.PAGINATION.MAX_LIMIT, Math.max(1, limit)),
    });
  });
}

export function withRateLimit(rateLimiterType: RateLimiterType): (handler: ApiHandler) => ApiHandler {
  return (handler: ApiHandler): ApiHandler => {
    return withErrorHandling(async (request: NextRequest) => {
      const identifier = getClientIdentifier(request);
      const rateLimitResult = await checkRateLimit(rateLimiterType, identifier);

      if (!rateLimitResult.success) {
        return addSecurityHeaders(
          NextResponse.json(
            {
              error: "Rate limit exceeded",
              message: "Too many requests. Please try again later.",
              retryAfter: Math.ceil((rateLimitResult.reset.getTime() - Date.now()) / 1000),
            },
            {
              status: 429,
              headers: {
                "Retry-After": Math.ceil((rateLimitResult.reset.getTime() - Date.now()) / 1000).toString(),
                "X-RateLimit-Limit": rateLimitResult.limit.toString(),
                "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
                "X-RateLimit-Reset": rateLimitResult.reset.toISOString(),
              },
            }
          )
        );
      }

      const response = await handler(request);

      response.headers.set("X-RateLimit-Limit", rateLimitResult.limit.toString());
      response.headers.set("X-RateLimit-Remaining", rateLimitResult.remaining.toString());
      response.headers.set("X-RateLimit-Reset", rateLimitResult.reset.toISOString());

      return addSecurityHeaders(response);
    });
  };
}

export function withSecurityHeaders(handler: ApiHandler): ApiHandler {
  return async (request: NextRequest) => {
    const response = await handler(request);
    return addSecurityHeaders(response);
  };
}

export function withCacheHeaders(ttl: number, staleWhileRevalidate?: number): (handler: ApiHandler) => ApiHandler {
  return (handler: ApiHandler): ApiHandler => {
    return async (request: NextRequest) => {
      const response = await handler(request);

      const cacheControl = `public, s-maxage=${ttl}${staleWhileRevalidate ? `, stale-while-revalidate=${staleWhileRevalidate}` : ""}`;
      response.headers.set("Cache-Control", cacheControl);
      response.headers.set("Vary", "Accept-Encoding");

      return response;
    };
  };
}

export const apiMiddleware = {
  basic: (rateLimiterType: RateLimiterType) => (handler: ApiHandler) =>
    withSecurityHeaders(withRateLimit(rateLimiterType)(withErrorHandling(handler))),

  withValidation:
    <T>(rateLimiterType: RateLimiterType, validator: (data: unknown) => T) =>
    (handler: (request: NextRequest, validatedData: T) => Promise<NextResponse>) =>
      withSecurityHeaders(withRateLimit(rateLimiterType)(withValidation(handler, validator))),

  withPagination:
    (rateLimiterType: RateLimiterType) =>
    (handler: (request: NextRequest, pagination: { page: number; limit: number }) => Promise<NextResponse>) =>
      withSecurityHeaders(withRateLimit(rateLimiterType)(withPagination(handler))),

  withAuth: (rateLimiterType: RateLimiterType, token: string) => (handler: ApiHandler) =>
    withSecurityHeaders(withRateLimit(rateLimiterType)(withAuth(token)(withErrorHandling(handler)))),

  withCache: (rateLimiterType: RateLimiterType, ttl: number, staleWhileRevalidate?: number) => (handler: ApiHandler) =>
    withCacheHeaders(
      ttl,
      staleWhileRevalidate
    )(withSecurityHeaders(withRateLimit(rateLimiterType)(withErrorHandling(handler)))),

  simple: (handler: ApiHandler) => withSecurityHeaders(withErrorHandling(handler)),
};
