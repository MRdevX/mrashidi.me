"use client";

import { ArrowRight } from "lucide-react";
import { getThemeConfig } from "@/config/theme.config";

type BlogPostCardFooterProps = {
  publishedAt: string;
};

export function BlogPostCardFooter({ publishedAt }: BlogPostCardFooterProps) {
  const { getTextColor } = getThemeConfig();

  return (
    <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-gray-200 pt-3 dark:border-gray-700">
      <div className="flex min-w-0 flex-wrap items-center gap-3">
        <span className={`whitespace-nowrap text-sm ${getTextColor("muted")}`}>
          {new Date(publishedAt).toLocaleDateString()}
        </span>
        <span className="shrink-0 rounded-full bg-primary/10 px-2 py-1 text-xs text-brand-text ">Blog Post</span>
      </div>
      <span className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-brand-text">
        Read More
        <ArrowRight className="size-4 shrink-0" aria-hidden />
      </span>
    </div>
  );
}
