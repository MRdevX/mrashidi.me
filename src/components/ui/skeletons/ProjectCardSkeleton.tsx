import { Skeleton } from "../Skeleton";

export function ProjectCardSkeleton() {
  return (
    <div className="glass-card p-6 flex flex-col gap-4 shadow-lg rounded-xl border border-orange-500/10">
      {/* Header with title and badges */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-5 w-16 rounded-md" />
            <Skeleton className="h-5 w-20 rounded-md" />
          </div>
        </div>
        <div className="flex flex-col gap-1 text-right">
          <Skeleton className="h-5 w-12 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      </div>

      {/* Content section */}
      <div className="flex flex-col gap-1">
        <div className="flex flex-wrap gap-2 items-center text-sm mb-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>

      {/* Tech stack */}
      <div className="flex flex-wrap gap-2 mt-3">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-18 rounded-full" />
        <Skeleton className="h-6 w-14 rounded-full" />
        <Skeleton className="h-6 w-22 rounded-full" />
        <Skeleton className="h-6 w-12 rounded-full" />
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 mt-4">
        <Skeleton className="h-8 w-20 rounded" />
        <Skeleton className="h-8 w-16 rounded" />
      </div>
    </div>
  );
}
