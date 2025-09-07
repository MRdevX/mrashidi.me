"use client";

import { useCallback } from "react";
import type { BlogData, BlogResponse } from "@/features/blog/types";
import { logger } from "@/lib/core";

export function useBlogPreload() {
  const preloadBlogPosts = useCallback(async (page: number = 1, postsPerPage: number = 6) => {
    try {
      const response = await fetch(`/api/blog?page=${page}&limit=${postsPerPage}`);
      const data: BlogResponse = await response.json();
      return data.success ? ({ posts: data.data, total: data.meta?.total || 0 } as BlogData) : null;
    } catch (error) {
      logger.error({ operation: "useBlogPreload", error: String(error) });
      return null;
    }
  }, []);

  return {
    preloadBlogPosts,
    preloadFirstPage: () => preloadBlogPosts(1, 6),
  };
}
