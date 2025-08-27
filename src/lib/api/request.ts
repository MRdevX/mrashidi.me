import type { NextRequest } from "next/server";

export interface PaginationParams {
  page: number;
  limit: number;
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
    } catch {
      throw new Error("Invalid JSON body");
    }
  }
}
