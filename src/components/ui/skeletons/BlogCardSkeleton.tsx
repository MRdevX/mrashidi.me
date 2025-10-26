import { Skeleton } from "../Skeleton";

export function BlogCardSkeleton() {
  return (
    <div className="glass-card p-6 flex flex-col gap-4 shadow-lg rounded-xl border border-orange-500/10">
      {/* Image placeholder */}
      <Skeleton className="w-full h-48 rounded-lg" />

      {/* Content */}
      <div className="space-y-4 relative z-10">
        {/* Title */}
        <Skeleton className="h-6 w-4/5" />

        {/* Description */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>

        {/* Footer with date and read more */}
        <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    </div>
  );
}
