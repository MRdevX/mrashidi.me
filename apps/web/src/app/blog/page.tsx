"use client";

import { PageHeader, PageSection, PageWrapper } from "@/components/ui";
import { BlogPostsSection, useBlogData } from "@/features/blog";

export default function Blog() {
  const { posts, totalPages, currentPage, isLoading, error, setPage, mutate } = useBlogData(6);

  return (
    <PageWrapper>
      <PageHeader iconName="BookOpen" title="Blog Posts" />

      <PageSection>
        <div className="content-section">
          <BlogPostsSection
            posts={posts}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
            isLoading={isLoading}
            error={error}
            onRetry={() => void mutate()}
          />
        </div>
      </PageSection>
    </PageWrapper>
  );
}
