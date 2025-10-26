import { Skeleton } from "../Skeleton";

export function TerminalSkeleton() {
  return (
    <div className="terminal-window w-full h-96 content-section overflow-hidden rounded-lg flex flex-col">
      {/* Terminal header */}
      <div className="flex items-center gap-2 p-3 border-b border-orange-500/20">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <Skeleton className="h-4 w-32 ml-4" />
      </div>

      {/* Terminal content */}
      <div className="flex-1 p-4 space-y-3">
        {/* Command lines */}
        <div className="flex items-center gap-2">
          <span className="text-green-400 font-mono">$</span>
          <Skeleton className="h-4 w-48" />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-green-400 font-mono">$</span>
          <Skeleton className="h-4 w-32" />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-green-400 font-mono">$</span>
          <Skeleton className="h-4 w-40" />
        </div>

        {/* Loading indicator */}
        <div className="flex items-center gap-2 mt-4">
          <span className="text-orange-400 font-mono">Loading</span>
          <div className="flex gap-1">
            <div className="w-1 h-1 bg-orange-400 rounded-full animate-pulse"></div>
            <div className="w-1 h-1 bg-orange-400 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
            <div className="w-1 h-1 bg-orange-400 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
          </div>
        </div>

        {/* Additional content lines */}
        <div className="space-y-2 mt-6">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
      </div>
    </div>
  );
}
