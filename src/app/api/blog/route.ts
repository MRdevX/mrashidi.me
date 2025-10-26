import type { NextRequest } from "next/server";
import { apiMiddleware } from "@/lib/api/middleware";
import { createErrorResponse, createSuccessResponse } from "@/lib/api/response";
import { logger } from "@/lib/core";
import { getAllPosts } from "@/services/blog.service";

async function handleBlogPosts(_request: NextRequest, pagination: { page: number; limit: number }) {
  try {
    const result = await getAllPosts(pagination.page, pagination.limit);

    return createSuccessResponse(result.posts, {
      fromCache: result.fromCache,
      total: result.total,
      page: pagination.page,
      limit: pagination.limit,
    });
  } catch (error) {
    logger.error({
      operation: "handleBlogPosts",
      error: error instanceof Error ? error.message : String(error),
      pagination,
    });

    return createErrorResponse(new Error("Failed to fetch blog posts"), 500);
  }
}

export const GET = apiMiddleware.create("generalApi").withCache(300, 600).buildWithPagination(handleBlogPosts);
