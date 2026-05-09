import { BlogCardSkeleton } from "@/components/ui/skeletons/BlogCardSkeleton";
import { BlogPostsGrid } from "./BlogPostsGrid";

const SKELETON_PLACEHOLDER_KEYS = ["a", "b", "c", "d", "e", "f"] as const;

export function BlogLoading() {
  return (
    <BlogPostsGrid>
      {SKELETON_PLACEHOLDER_KEYS.map((id) => (
        <BlogCardSkeleton key={`blog-skeleton-${id}`} />
      ))}
    </BlogPostsGrid>
  );
}
