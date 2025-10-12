import type { NextRequest } from "next/server";
import { apiMiddleware } from "@/lib/api/middleware";
import { createSuccessResponse } from "@/lib/api/response";
import { getAllPosts } from "@/services/blog.service";

async function handleBlogPosts(_request: NextRequest, pagination: { page: number; limit: number }) {
  const result = await getAllPosts(pagination.page, pagination.limit);

  return createSuccessResponse(result.posts, {
    fromCache: result.fromCache,
    total: result.total,
    page: pagination.page,
    limit: pagination.limit,
  });
}

export const GET = apiMiddleware.withCache(
  "generalApi",
  300,
  600
)(apiMiddleware.withPagination("generalApi")(handleBlogPosts));
