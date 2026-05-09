import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { blogPostsGridClassName } from "./blogGridLayout";

type BlogPostsGridProps = {
  children: ReactNode;
  className?: string;
};

export function BlogPostsGrid({ children, className }: BlogPostsGridProps) {
  return <div className={cn(blogPostsGridClassName, className)}>{children}</div>;
}
