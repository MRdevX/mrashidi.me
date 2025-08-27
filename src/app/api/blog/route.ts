import type { NextRequest } from "next/server";
import { withPagination } from "@/lib/api/middleware";
import { ApiResponseHandler } from "@/lib/api/response";
import { BlogService } from "@/server/blog.service";

async function handleBlogPosts(_request: NextRequest, pagination: { page: number; limit: number }) {
  const result = await BlogService.getAllPosts(pagination.page, pagination.limit);

  const response = ApiResponseHandler.success(result.posts, {
    fromCache: result.fromCache,
    total: result.total,
    page: pagination.page,
    limit: pagination.limit,
  });

  response.headers.set("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");
  response.headers.set("Vary", "Accept-Encoding");

  return response;
}

export const GET = withPagination(handleBlogPosts);
