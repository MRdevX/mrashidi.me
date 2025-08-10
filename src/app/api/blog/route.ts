import { NextRequest } from "next/server";
import { BlogService } from "@/services/blogService";
import { withPagination } from "@/lib/api/middleware";
import { ApiResponseHandler } from "@/lib/api/response";

async function handleBlogPosts(request: NextRequest, pagination: { page: number; limit: number }) {
  const result = await BlogService.getAllPosts(pagination.page, pagination.limit);

  return ApiResponseHandler.success(result.posts, {
    fromCache: result.fromCache,
    total: result.total,
    page: pagination.page,
    limit: pagination.limit,
  });
}

export const GET = withPagination(handleBlogPosts);
