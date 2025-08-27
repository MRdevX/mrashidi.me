"use client";

import { useCallback } from "react";
import type { BlogData, BlogResponse } from "@/features/blog/types";
import { logger } from "@/lib/logger";

export function useBlogPreload() {
  const preloadBlogPosts = useCallback(async (page: number = 1, postsPerPage: number = 6) => {
    try {
      const response = await fetch(`/api/blog?page=${page}&limit=${postsPerPage}`);
      const data: BlogResponse = await response.json();

      if (!data.success) {
        throw new Error("Failed to preload blog posts");
      }

      return {
        posts: data.data,
        total: data.meta?.total || 0,
      } as BlogData;
    } catch (error) {
      logger.error({
        operation: "useBlogPreload",
        error: error instanceof Error ? error.message : String(error),
      });
      return null;
    }
  }, []);

  const preloadFirstPage = useCallback(() => {
    return preloadBlogPosts(1, 6);
  }, [preloadBlogPosts]);

  return {
    preloadBlogPosts,
    preloadFirstPage,
  };
}
