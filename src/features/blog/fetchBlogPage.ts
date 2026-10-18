import { logger } from "@/lib/core";
import type { BlogData, BlogResponse } from "./types";

export const POSTS_PER_PAGE = 6;

export async function fetchBlogPage(page: number, postsPerPage: number): Promise<BlogData> {
  const response = await fetch(`/api/blog?page=${page}&limit=${postsPerPage}`);
  const data: BlogResponse = await response.json();

  if (!data.success) {
    throw new Error("Failed to fetch blog posts");
  }

  return {
    posts: data.data,
    total: data.meta?.total || 0,
  };
}

export async function preloadFirstBlogPage(): Promise<void> {
  try {
    await fetchBlogPage(1, POSTS_PER_PAGE);
  } catch (error) {
    logger.error({ operation: "preloadFirstBlogPage", error: String(error) });
  }
}
