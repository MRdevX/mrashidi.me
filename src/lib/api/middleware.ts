import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { APIError, handleError, logError } from "@/lib/errors";
import { checkRateLimit, getClientIdentifier, type RateLimiterType } from "@/lib/services/rate-limit";
import { extractPaginationParams, type PaginationParams } from "@/lib/utils/pagination";
import { handleCorsPrelight, isCorsPrelight, withCors } from "./cors";
import { createErrorResponse } from "./response";
import { addSecurityHeaders } from "./securityHeaders";
import type { ApiHandler } from "./types";

export type PaginationHandler = (request: NextRequest, pagination: PaginationParams) => Promise<NextResponse>;
export type ValidationHandler<T = unknown> = (request: NextRequest, validatedData: T) => Promise<NextResponse>;

function corsMiddleware(handler: ApiHandler): ApiHandler {
  return withCors(handler);
}

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

      return response;
    };
  };
}

function authMiddleware(token: string | (() => string)): (handler: ApiHandler) => ApiHandler {
  return (handler: ApiHandler): ApiHandler => {
    return async (request: NextRequest) => {
      const actualToken = typeof token === "function" ? token() : token;
      const authHeader = request.headers.get("authorization");
      if (!actualToken || authHeader !== `Bearer ${actualToken}`) {
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
      wrappedHandler = corsMiddleware(wrappedHandler);
    }

    wrappedHandler = errorHandlingMiddleware(wrappedHandler);

    return wrappedHandler;
  }
}

export function createMiddleware(rateLimiterType?: RateLimiterType): MiddlewareChain {
  return new MiddlewareChain(rateLimiterType);
}

export function corsPrelight(request: NextRequest): NextResponse | null {
  if (isCorsPrelight(request)) {
    return handleCorsPrelight(request);
  }
  return null;
}
