import { Skeleton } from "../Skeleton";

const PLACEHOLDER_KEYS = ["a", "b", "c", "d", "e", "f", "g", "h"] as const;

export function TechStackGridSkeleton() {
  return (
    <div className="content-section p-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {PLACEHOLDER_KEYS.map((id) => (
          <div key={`tech-skeleton-${id}`} className="flex flex-col items-center gap-2">
            <Skeleton className="h-12 w-12 rounded-lg" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}
