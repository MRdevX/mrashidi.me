import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { corsPreflight, createMiddleware } from "@/lib/api/middleware";
import { createSuccessResponse } from "@/lib/api/response";
import { getBlogPosts } from "@/lib/content/server";

async function handleBlogPosts(_request: NextRequest, pagination: { page: number; limit: number }) {
  const { posts, total } = await getBlogPosts(pagination.page, pagination.limit);

  return createSuccessResponse(posts, {
    total,
    page: pagination.page,
    limit: pagination.limit,
  });
}

export const GET = createMiddleware("generalApi").cache(300, 600).cors().pagination().build(handleBlogPosts);

export const OPTIONS = async (request: NextRequest) => {
  const preflightResponse = corsPreflight(request);
  return preflightResponse || new NextResponse(null, { status: 200 });
};
