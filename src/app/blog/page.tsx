"use client";

import { BookOpen } from "lucide-react";
import { PageHeader, PageSection } from "@/components/ui";
import { BlogContainer, BlogError, BlogGrid, BlogLoading, BlogPagination, useBlogData } from "@/features/blog";

export default function Blog() {
  const { posts, totalPages, currentPage, isLoading, error, setPage } = useBlogData(6);

  return (
    <BlogContainer>
      <PageHeader icon={BookOpen} title="Blog Posts" />

      <PageSection>
        <div className="content-section">
          {isLoading ? (
            <BlogLoading />
          ) : error ? (
            <BlogError onRetry={() => window.location.reload()} />
          ) : (
            <>
              <BlogGrid posts={posts} />
              <BlogPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
            </>
          )}
        </div>
      </PageSection>
    </BlogContainer>
  );
}
