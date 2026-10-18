import { timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { APIError, handleError, logError } from "@/lib/errors";
import { checkRateLimit, getClientIdentifier, type RateLimiterType } from "@/lib/services/rate-limit";
import { extractPaginationParams, type PaginationParams } from "@/lib/utils/pagination";
import { handleCorsPreflight, isCorsPreflight, withCors } from "./cors";
import { createErrorResponse } from "./response";
import { addSecurityHeaders } from "./securityHeaders";
import type { ApiHandler } from "./types";

type PaginationHandler = (request: NextRequest, pagination: PaginationParams) => Promise<NextResponse>;
type ValidationHandler<T = unknown> = (request: NextRequest, validatedData: T) => Promise<NextResponse>;

function cacheMiddleware(ttl: number, staleWhileRevalidate?: number): (handler: ApiHandler) => ApiHandler {
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

function securityHeadersMiddleware(handler: ApiHandler): ApiHandler {
  return async (request: NextRequest) => {
    const response = await handler(request);
    return addSecurityHeaders(response);
  };
}

function rateLimitMiddleware(rateLimiterType: RateLimiterType): (handler: ApiHandler) => ApiHandler {
  return (handler: ApiHandler): ApiHandler => {
    return async (request: NextRequest) => {
      const identifier = getClientIdentifier(request);
      const rateLimitResult = await checkRateLimit(rateLimiterType, identifier);
      const rateLimitHeaders = {
        "X-RateLimit-Limit": rateLimitResult.limit.toString(),
        "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
        "X-RateLimit-Reset": rateLimitResult.reset.toISOString(),
      };

      if (!rateLimitResult.success) {
        const retryAfter = Math.ceil((rateLimitResult.reset.getTime() - Date.now()) / 1000);
        return addSecurityHeaders(
          NextResponse.json(
            {
              error: "Rate limit exceeded",
              message: "Too many requests. Please try again later.",
              retryAfter,
            },
            {
              status: 429,
              headers: { "Retry-After": retryAfter.toString(), ...rateLimitHeaders },
            }
          )
        );
      }

      const response = await handler(request);
      for (const [name, value] of Object.entries(rateLimitHeaders)) {
        response.headers.set(name, value);
      }
      return response;
    };
  };
}

function tokensMatch(expected: string, provided: string): boolean {
  const expectedBuffer = Buffer.from(expected, "utf8");
  const providedBuffer = Buffer.from(provided, "utf8");
  return expectedBuffer.length === providedBuffer.length && timingSafeEqual(expectedBuffer, providedBuffer);
}

function authMiddleware(token: string | (() => string)): (handler: ApiHandler) => ApiHandler {
  return (handler: ApiHandler): ApiHandler => {
    return async (request: NextRequest) => {
      const expected = typeof token === "function" ? token() : token;
      const match = /^Bearer\s+([\s\S]+)$/i.exec(request.headers.get("authorization") ?? "");
      const provided = match?.[1]?.trim();

      if (!expected || !provided || !tokensMatch(expected, provided)) {
        throw new APIError("Unauthorized", 401);
      }

      return await handler(request);
    };
  };
}

function validationMiddleware<T>(validator: (data: unknown) => T): (handler: ValidationHandler<T>) => ApiHandler {
  return (handler: ValidationHandler<T>): ApiHandler => {
    return async (request: NextRequest) => {
      const body = await request.json();
      const validatedData = validator(body);
      return await handler(request, validatedData);
    };
  };
}

function paginationMiddleware(handler: PaginationHandler): ApiHandler {
  return async (request: NextRequest) => {
    const pagination = extractPaginationParams(request);
    return await handler(request, pagination);
  };
}

function errorHandlingMiddleware(handler: ApiHandler): ApiHandler {
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

class MiddlewareChain {
  private rateLimiterType?: RateLimiterType;
  private hasCors = false;
  private cacheTtl?: number;
  private cacheStaleWhileRevalidate?: number;
  private authToken?: string | (() => string);
  private validator?: (data: unknown) => unknown;
  private hasPagination = false;

  constructor(rateLimiterType?: RateLimiterType) {
    this.rateLimiterType = rateLimiterType;
  }

  cors(): this {
    this.hasCors = true;
    return this;
  }

  cache(ttl: number, staleWhileRevalidate?: number): this {
    this.cacheTtl = ttl;
    this.cacheStaleWhileRevalidate = staleWhileRevalidate;
    return this;
  }

  auth(token: string | (() => string)): this {
    this.authToken = token;
    return this;
  }

  validate<T>(validator: (data: unknown) => T): this {
    this.validator = validator;
    return this;
  }

  pagination(): this {
    this.hasPagination = true;
    return this;
  }

  build<T = unknown>(handler: ApiHandler | PaginationHandler | ValidationHandler<T>): ApiHandler {
    let wrappedHandler: ApiHandler;

    if (this.hasPagination) {
      wrappedHandler = paginationMiddleware(handler as PaginationHandler);
    } else if (this.validator) {
      wrappedHandler = validationMiddleware(this.validator as (data: unknown) => T)(handler as ValidationHandler<T>);
    } else {
      wrappedHandler = handler as ApiHandler;
    }

    // Wrapped inside out, so the last wrapper runs first: rate limiting runs before auth so failed
    // token guesses are throttled, and error handling is outermost so it catches every layer.
    if (this.authToken) {
      wrappedHandler = authMiddleware(this.authToken)(wrappedHandler);
    }

    if (this.rateLimiterType) {
      wrappedHandler = rateLimitMiddleware(this.rateLimiterType)(wrappedHandler);
    }

    wrappedHandler = securityHeadersMiddleware(wrappedHandler);

    if (this.cacheTtl !== undefined) {
      wrappedHandler = cacheMiddleware(this.cacheTtl, this.cacheStaleWhileRevalidate)(wrappedHandler);
    }

    if (this.hasCors) {
      wrappedHandler = withCors(wrappedHandler);
    }

    wrappedHandler = errorHandlingMiddleware(wrappedHandler);

    return wrappedHandler;
  }
}

export function createMiddleware(rateLimiterType?: RateLimiterType): MiddlewareChain {
  return new MiddlewareChain(rateLimiterType);
}

export function corsPreflight(request: NextRequest): NextResponse | null {
  if (isCorsPreflight(request)) {
    return handleCorsPreflight(request);
  }
  return null;
}
