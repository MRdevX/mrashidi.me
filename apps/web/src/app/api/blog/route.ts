import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getAllPosts } from "@/features/blog/server";
import { corsPreflight, createMiddleware } from "@/lib/api/middleware";
import { createSuccessResponse } from "@/lib/api/response";

export const runtime = "nodejs";

async function handleBlogPosts(_request: NextRequest, pagination: { page: number; limit: number }) {
  const result = await getAllPosts(pagination.page, pagination.limit);

  return createSuccessResponse(result.posts, {
    fromCache: result.fromCache,
    total: result.total,
    page: pagination.page,
    limit: pagination.limit,
  });
}

export const GET = createMiddleware("generalApi").cache(300, 600).cors().pagination().build(handleBlogPosts);

export const OPTIONS = async (request: NextRequest) => {
  const preflightResponse = corsPreflight(request);
  return preflightResponse || new NextResponse(null, { status: 200 });
};
