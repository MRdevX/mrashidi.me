"use client";

import { useEffect, useState } from "react";
import useSWR, { preload } from "swr";
import { fetchBlogPage, POSTS_PER_PAGE } from "./fetchBlogPage";

if (typeof window !== "undefined") {
  preload(["blogPosts", 1, POSTS_PER_PAGE], () => fetchBlogPage(1, POSTS_PER_PAGE));
}

export function useBlogData(postsPerPage: number = POSTS_PER_PAGE) {
  const [page, setPage] = useState(1);

  const { data, error, isLoading, mutate } = useSWR(
    ["blogPosts", page, postsPerPage],
    ([, p, pp]) => fetchBlogPage(p, pp),
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
        preload(["blogPosts", page + 1, postsPerPage], () => fetchBlogPage(page + 1, postsPerPage));
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
