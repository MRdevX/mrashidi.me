import { NextRequest } from "next/server";

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface RequestValidator<T> {
  validate(data: unknown): T;
}

export class RequestHandler {
  static getPaginationParams(request: NextRequest): PaginationParams {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    return {
      page: Math.max(1, page),
      limit: Math.min(100, Math.max(1, limit)),
    };
  }

  static async getJsonBody<T>(request: NextRequest): Promise<T> {
    try {
      return await request.json();
    } catch (_error) {
      throw new Error("Invalid JSON body");
    }
  }

  static validateRequiredFields<T extends Record<string, unknown>>(data: T, requiredFields: (keyof T)[]): void {
    const missingFields = requiredFields.filter((field) => !data[field]);

    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
    }
  }
}
