import { BlogCardSkeleton } from "@/components/ui/skeletons/BlogCardSkeleton";

export function BlogLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      {["a", "b", "c", "d", "e", "f"].map((id) => (
        <BlogCardSkeleton key={`blog-skeleton-${id}`} />
      ))}
    </div>
  );
}
