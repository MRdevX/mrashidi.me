import { BlogCardSkeleton } from "@/components/ui/skeletons/BlogCardSkeleton";

export function BlogLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }, (_, i) => (
        <BlogCardSkeleton key={`blog-skeleton-${Date.now()}-${i}`} />
      ))}
    </div>
  );
}
