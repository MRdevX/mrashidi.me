import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { APIError, handleError, logError } from "@/lib/errors";
import { checkRateLimit, getClientIdentifier, type RateLimiterType } from "@/lib/services/rate-limit";
import { extractPaginationParams, type PaginationParams } from "@/lib/utils/pagination";
import { handleCorsPrelight, isCorsPrelight, withCors } from "./cors";
import { createErrorResponse } from "./response";
import { addSecurityHeaders } from "./securityHeaders";
import type { ApiHandler } from "./types";

type PaginationHandler = (request: NextRequest, pagination: PaginationParams) => Promise<NextResponse>;
type ValidationHandler<T> = (request: NextRequest, validatedData: T) => Promise<NextResponse>;

function composeMiddleware(
  ...middlewares: Array<(handler: ApiHandler) => ApiHandler>
): (handler: ApiHandler) => ApiHandler {
  return (handler: ApiHandler) => {
    return middlewares.reduceRight((acc, middleware) => middleware(acc), handler);
  };
}

export function withErrorHandling(handler: ApiHandler): ApiHandler {
  return async (request: NextRequest) => {
    try {
      return await handler(request);
    } catch (error) {
      const appError = handleError(error);
      logError(appError, "API");
      const errorResponse = createErrorResponse(appError, appError.statusCode || 500);
      return addSecurityHeaders(errorResponse);
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
  handler: (request: NextRequest, pagination: PaginationParams) => Promise<NextResponse>
): ApiHandler {
  return withErrorHandling(async (request: NextRequest) => {
    const pagination = extractPaginationParams(request);
    return await handler(request, pagination);
  });
}

export function withPaginationCore(
  handler: (request: NextRequest, pagination: PaginationParams) => Promise<NextResponse>
): ApiHandler {
  return async (request: NextRequest) => {
    const pagination = extractPaginationParams(request);
    return await handler(request, pagination);
  };
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

function createBaseMiddleware(rateLimiterType: RateLimiterType) {
  return composeMiddleware(withSecurityHeaders, withRateLimit(rateLimiterType), withErrorHandling);
}

class MiddlewareBuilder {
  private middlewares: Array<(handler: ApiHandler) => ApiHandler> = [];
  private cacheTtl?: number;
  private cacheStaleWhileRevalidate?: number;
  private hasCors = false;

  constructor(rateLimiterType: RateLimiterType) {
    this.middlewares.push(withSecurityHeaders, withRateLimit(rateLimiterType), withErrorHandling);
  }

  withCors() {
    this.hasCors = true;
    return this;
  }

  withCache(ttl: number, staleWhileRevalidate?: number) {
    this.cacheTtl = ttl;
    this.cacheStaleWhileRevalidate = staleWhileRevalidate;
    return this;
  }

  withPagination() {
    return this;
  }

  build(handler: ApiHandler): ApiHandler {
    const middlewares: Array<(handler: ApiHandler) => ApiHandler> = [];

    if (this.hasCors) {
      middlewares.push(withCors);
    }

    if (this.cacheTtl !== undefined) {
      middlewares.push(withCacheHeaders(this.cacheTtl, this.cacheStaleWhileRevalidate));
    }

    middlewares.push(...this.middlewares);

    return composeMiddleware(...middlewares)(handler);
  }

  buildWithPagination(handler: PaginationHandler): ApiHandler {
    const paginationWrapped = withPaginationCore(handler);
    return this.build(paginationWrapped);
  }
}

export const apiMiddleware = {
  basic: (rateLimiterType: RateLimiterType) => (handler: ApiHandler) => createBaseMiddleware(rateLimiterType)(handler),

  withValidation:
    <T>(rateLimiterType: RateLimiterType, validator: (data: unknown) => T) =>
    (handler: ValidationHandler<T>) =>
      createBaseMiddleware(rateLimiterType)(withValidation(handler, validator)),

  withPagination: (rateLimiterType: RateLimiterType) => (handler: PaginationHandler) =>
    createBaseMiddleware(rateLimiterType)(withPagination(handler)),

  withAuth: (rateLimiterType: RateLimiterType, token: string) => (handler: ApiHandler) =>
    createBaseMiddleware(rateLimiterType)(withAuth(token)(handler)),

  withCache: (rateLimiterType: RateLimiterType, ttl: number, staleWhileRevalidate?: number) => (handler: ApiHandler) =>
    composeMiddleware(
      withCacheHeaders(ttl, staleWhileRevalidate),
      withSecurityHeaders,
      withRateLimit(rateLimiterType),
      withErrorHandling
    )(handler),

  withCors: (rateLimiterType: RateLimiterType) => (handler: ApiHandler) =>
    composeMiddleware(withCors, withSecurityHeaders, withRateLimit(rateLimiterType), withErrorHandling)(handler),

  simple: (handler: ApiHandler) => composeMiddleware(withSecurityHeaders, withErrorHandling)(handler),

  corsPrelight: (request: NextRequest) => {
    if (isCorsPrelight(request)) {
      return handleCorsPrelight(request);
    }
    return null;
  },

  create: (rateLimiterType: RateLimiterType) => new MiddlewareBuilder(rateLimiterType),
};
