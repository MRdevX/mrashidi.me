"use client";

import { BlogHeader, BlogGrid, BlogPagination, BlogLoading, BlogError, BlogContainer, useBlogData } from "@/features/blog";

export default function Blog() {
  const { posts, totalPages, currentPage, isLoading, error, setPage } = useBlogData(6);

  return (
    <BlogContainer>
      <BlogHeader />

      {isLoading ? (
        <BlogLoading />
      ) : error ? (
        <BlogError />
      ) : (
        <>
          <BlogGrid posts={posts} />
          <BlogPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </BlogContainer>
  );
}
