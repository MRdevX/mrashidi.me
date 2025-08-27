import type { NextRequest, NextResponse } from "next/server";
import { API_CONFIG } from "@/lib/config/api";
import { ErrorHandler } from "@/lib/errors";
import { ApiResponseHandler } from "./response";

export type ApiHandler = (request: NextRequest) => Promise<NextResponse>;

export function withErrorHandling(handler: ApiHandler): ApiHandler {
  return async (request: NextRequest) => {
    try {
      return await handler(request);
    } catch (error) {
      const appError = ErrorHandler.handle(error);
      ErrorHandler.log(appError, "API");
      return ApiResponseHandler.error(appError, appError.statusCode || 500);
    }
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
