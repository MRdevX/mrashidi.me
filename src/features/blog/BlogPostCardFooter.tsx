"use client";

import { ArrowRight } from "lucide-react";
import { useThemeConfig } from "@/hooks/useThemeConfig";

type BlogPostCardFooterProps = {
  publishedAt: string;
};

export function BlogPostCardFooter({ publishedAt }: BlogPostCardFooterProps) {
  const { getTextColor } = useThemeConfig();

  return (
    <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-gray-200 pt-3 dark:border-gray-700">
      <div className="flex min-w-0 flex-wrap items-center gap-3">
        <span className={`whitespace-nowrap text-sm ${getTextColor("muted")}`}>
          {new Date(publishedAt).toLocaleDateString()}
        </span>
        <span className="shrink-0 rounded-full bg-orange-500/10 px-2 py-1 text-xs text-orange-600 dark:text-orange-400">
          Blog Post
        </span>
      </div>
      <span className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-orange-500 transition-colors group-hover:text-orange-400">
        Read More
        <ArrowRight className="size-4 shrink-0" aria-hidden />
      </span>
    </div>
  );
}
