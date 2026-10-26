"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { blogGridContainerVariants, reducedMotionBlogGridContainerVariants } from "@/lib/animations";
import { cn } from "@/lib/utils";
import { blogPostsGridClassName } from "./blogGridLayout";

type BlogPostsGridMotionProps = {
  children: ReactNode;
  className?: string;
};

export function BlogPostsGridMotion({ children, className }: BlogPostsGridMotionProps) {
  const prefersReducedMotion = useReducedMotion();
  const containerVariants = prefersReducedMotion ? reducedMotionBlogGridContainerVariants : blogGridContainerVariants;

  return (
    <motion.div
      className={cn(blogPostsGridClassName, className)}
      initial="hidden"
      animate="show"
      variants={containerVariants}
    >
      {children}
    </motion.div>
  );
}
