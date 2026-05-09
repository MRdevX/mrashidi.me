"use client";

import { Pagination } from "@/components/ui";
import { BlogError } from "./BlogError";
import { BlogGrid } from "./BlogGrid";
import { BlogLoading } from "./BlogLoading";
import type { BlogPost } from "./types";

type BlogPostsSectionProps = {
  posts: BlogPost[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
  error: unknown;
  onRetry: () => void;
};

export function BlogPostsSection({
  posts,
  currentPage,
  totalPages,
  onPageChange,
  isLoading,
  error,
  onRetry,
}: BlogPostsSectionProps) {
  if (isLoading) {
    return <BlogLoading />;
  }
  if (error) {
    return <BlogError onRetry={onRetry} />;
  }
  return (
    <>
      <BlogGrid posts={posts} />
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
    </>
  );
}
