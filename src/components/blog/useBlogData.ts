import { useState } from "react";
import useSWR from "swr";
import { BlogResponse, BlogData } from "./types";

export function useBlogData(postsPerPage: number = 6) {
  const [page, setPage] = useState(1);

  const fetcher = async (page: number, postsPerPage: number): Promise<BlogData> => {
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

  const { data, error, isLoading } = useSWR(["blogPosts", page, postsPerPage], ([, p, pp]) => fetcher(p, pp));

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
  };
}
