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
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    const errorName = error instanceof Error ? error.name : "UnknownError";

    logger.error({
      operation: "handleBlogPosts",
      error: errorMessage,
      errorName,
      stack: errorStack,
      pagination,
      timestamp: new Date().toISOString(),
      url: error instanceof Error && "url" in error ? (error as any).url : undefined,
    });

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch blog posts",
        details: process.env.NODE_ENV === "development" ? errorMessage : "Internal server error",
        posts: [],
        total: 0,
        page: pagination.page,
        limit: pagination.limit,
        fromCache: false,
      },
      { status: 500 }
    );
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
