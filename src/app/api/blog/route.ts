import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { apiMiddleware } from "@/lib/api/middleware";
import { createSuccessResponse } from "@/lib/api/response";
import { logger } from "@/lib/core";
import { getAllPosts } from "@/services/blog.service";

export const runtime = "nodejs";

async function handleBlogPosts(_request: NextRequest, pagination: { page: number; limit: number }) {
  try {
    logger.info({
      operation: "handleBlogPosts",
      message: "Handling blog posts request",
      pagination,
    });

    const result = await getAllPosts(pagination.page, pagination.limit);

    logger.info({
      operation: "handleBlogPosts",
      message: "Successfully processed blog posts request",
      postCount: result.posts.length,
      total: result.total,
      pagination,
    });

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
      stack: error instanceof Error ? error.stack : undefined,
      pagination,
    });

    return createSuccessResponse([], {
      fromCache: false,
      total: 0,
      page: pagination.page,
      limit: pagination.limit,
    });
  }
}

export const GET = apiMiddleware
  .create("generalApi")
  .withCache(300, 600)
  .withCors()
  .buildWithPagination(handleBlogPosts);

export const OPTIONS = async (request: NextRequest) => {
  const preflightResponse = apiMiddleware.corsPrelight(request);
  return preflightResponse || new NextResponse(null, { status: 200 });
};
