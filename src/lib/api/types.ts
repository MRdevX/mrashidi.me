import type { NextRequest, NextResponse } from "next/server";

export type ApiHandler = (request: NextRequest) => Promise<NextResponse>;

export interface PaginationParams {
  page: number;
  limit: number;
}

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
