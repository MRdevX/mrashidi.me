import { Skeleton } from "../Skeleton";

export function BlogCardSkeleton() {
  return (
    <div className="feature-card relative isolate z-0 flex h-full min-h-0 flex-col">
      <div className="relative z-10 flex min-h-0 flex-1 flex-col gap-4">
        <Skeleton className="h-48 w-full shrink-0 rounded-lg" />
        <Skeleton className="h-6 w-4/5 shrink-0" />

        <div className="flex min-h-[3lh] flex-1 flex-col space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>

        <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-gray-200 pt-3 dark:border-gray-700">
          <div className="flex flex-wrap items-center gap-3">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <Skeleton className="h-4 w-20 shrink-0" />
        </div>
      </div>
    </div>
  );
}
