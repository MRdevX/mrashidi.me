import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function CardShell({ title, children, className }: { title?: string; children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "mt-3 rounded-lg border border-primary/20 bg-white/60 p-3 dark:border-primary/25 dark:bg-white/[0.03]",
        className
      )}
    >
      {title ? (
        <p className="mb-2 font-terminal text-[11px] uppercase tracking-wider text-brand-text ">{title}</p>
      ) : null}
      {children}
    </div>
  );
}

export function CardSkeleton({ label }: { label: string }) {
  return (
    <div
      role="status"
      aria-label={label}
      className="mt-3 h-16 animate-pulse rounded-lg border border-primary/10 bg-primary/5 motion-reduce:animate-none"
    />
  );
}

export const cardButtonClass =
  "inline-flex min-h-11 items-center gap-2 rounded-md border border-gray-200 bg-white px-3 text-sm font-medium text-gray-800 transition-colors hover:border-primary/60 hover:text-brand-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 ";
