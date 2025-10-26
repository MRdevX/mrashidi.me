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

export const GET = apiMiddleware.create("generalApi").withCache(300, 600).buildWithPagination(handleBlogPosts);

export const OPTIONS = async () => {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400",
    },
  });
};
