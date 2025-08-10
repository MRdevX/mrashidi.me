import { NextResponse } from "next/server";
import { ValidationError } from "@/lib/errors";

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
    const response: ApiResponse = {
      success: false,
      error: error.message,
    };

    if (error instanceof ValidationError) {
      response.fields = error.fields;
    }

    return NextResponse.json(response, { status: statusCode });
  }

  static validationError(fields: Record<string, string>): NextResponse {
    const response: ApiResponse = {
      success: false,
      error: "Validation failed",
      fields,
    };
    return NextResponse.json(response, { status: 400 });
  }
}
