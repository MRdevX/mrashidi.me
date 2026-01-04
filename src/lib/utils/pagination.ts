import type { NextRequest } from "next/server";
import { API_CONFIG } from "@/lib/core";

export interface PaginationParams {
  page: number;
  limit: number;
}

export function extractPaginationParams(request: NextRequest): PaginationParams {
  const searchParams = request.nextUrl.searchParams;
  let page = parseInt(searchParams.get("page") || API_CONFIG.PAGINATION.DEFAULT_PAGE.toString(), 10);
  let limit = parseInt(searchParams.get("limit") || API_CONFIG.PAGINATION.DEFAULT_LIMIT.toString(), 10);

  if (Number.isNaN(page)) {
    page = API_CONFIG.PAGINATION.DEFAULT_PAGE;
  }
  if (Number.isNaN(limit)) {
    limit = API_CONFIG.PAGINATION.DEFAULT_LIMIT;
  }

  return {
    page: Math.max(1, page),
    limit: Math.min(API_CONFIG.PAGINATION.MAX_LIMIT, Math.max(1, limit)),
  };
}
