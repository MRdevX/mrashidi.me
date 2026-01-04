import type { NextRequest } from "next/server";
import { API_CONFIG } from "@/lib/core";

export interface PaginationParams {
  page: number;
  limit: number;
}

export function extractPaginationParams(request: NextRequest): PaginationParams {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || API_CONFIG.PAGINATION.DEFAULT_PAGE.toString(), 10);
  const limit = parseInt(searchParams.get("limit") || API_CONFIG.PAGINATION.DEFAULT_LIMIT.toString(), 10);

  return {
    page: Math.max(1, page),
    limit: Math.min(API_CONFIG.PAGINATION.MAX_LIMIT, Math.max(1, limit)),
  };
}
