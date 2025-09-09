import type { NextRequest } from "next/server";
import { withPagination, withRateLimit } from "@/lib/api/middleware";
import { createSuccessResponse } from "@/lib/api/response";
import { getAllPosts } from "@/server/blog.service";

async function handleBlogPosts(_request: NextRequest, pagination: { page: number; limit: number }) {
  const result = await getAllPosts(pagination.page, pagination.limit);

  const response = createSuccessResponse(result.posts, {
    fromCache: result.fromCache,
    total: result.total,
    page: pagination.page,
    limit: pagination.limit,
  });

  response.headers.set("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");
  response.headers.set("Vary", "Accept-Encoding");

  return response;
}

export const GET = withRateLimit("generalApi")(withPagination(handleBlogPosts));
