import { NextResponse } from "next/server";
import { AppError, createSafeErrorResponse, ValidationError } from "@/lib/errors";

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  fields?: Record<string, string>;
  meta?: {
    fromCache?: boolean;
    total?: number;
    page?: number;
    limit?: number;
  };
  debug?: {
    originalMessage?: string;
    stack?: string;
  };
}

export class ApiResponseHandler {
  static success<T>(data: T, meta?: ApiResponse["meta"]): NextResponse {
    const response: ApiResponse<T> = {
      success: true,
      data,
      ...(meta && { meta }),
    };
    return NextResponse.json(response);
  }

  static error(error: Error, statusCode: number = 500): NextResponse {
    const appError = error instanceof AppError ? error : new AppError(error.message, statusCode);

    const safeResponse = createSafeErrorResponse(appError);

    const response: ApiResponse = {
      success: false,
      error: safeResponse.error.message,
      ...(safeResponse.debug && { debug: safeResponse.debug }),
    };

    if (error instanceof ValidationError) {
      response.fields = error.fields;
    }

    return NextResponse.json(response, {
      status: safeResponse.error.statusCode,
    });
  }

  static validationError(fields: Record<string, string>): NextResponse {
    const validationError = new ValidationError("Validation failed", fields);
    return ApiResponseHandler.error(validationError, 400);
  }
}
