"use client";

import { useEffect, useState } from "react";
import useSWR, { preload } from "swr";
import type { BlogData, BlogResponse } from "./types";

const preloadBlogData = async (page: number, postsPerPage: number): Promise<BlogData> => {
  const response = await fetch(`/api/blog?page=${page}&limit=${postsPerPage}`);
  const data: BlogResponse = await response.json();

  if (!data.success) {
    throw new Error("Failed to fetch blog posts");
  }

  return {
    posts: data.data,
    total: data.meta?.total || 0,
  };
};

if (typeof window !== "undefined") {
  preload(["blogPosts", 1, 6], () => preloadBlogData(1, 6));
}

export function useBlogData(postsPerPage: number = 6) {
  const [page, setPage] = useState(1);

  const { data, error, isLoading, mutate } = useSWR(
    ["blogPosts", page, postsPerPage],
    ([, p, pp]) => preloadBlogData(p, pp),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 5 * 60 * 1000,
      errorRetryCount: 3,
      errorRetryInterval: 1000,
    }
  );

  useEffect(() => {
    if (data?.total) {
      const totalPages = Math.ceil(data.total / postsPerPage);
      if (page < totalPages) {
        preload(["blogPosts", page + 1, postsPerPage], () => preloadBlogData(page + 1, postsPerPage));
      }
    }
  }, [page, postsPerPage, data?.total]);

  const posts = data?.posts || [];
  const totalPosts = data?.total || 0;
  const totalPages = Math.ceil(totalPosts / postsPerPage);

  return {
    posts,
    totalPosts,
    totalPages,
    currentPage: page,
    isLoading,
    error,
    setPage,
    mutate,
  };
}
