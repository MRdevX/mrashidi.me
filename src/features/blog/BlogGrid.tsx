"use client";

import { motion, useReducedMotion } from "framer-motion";
import { blogGridContainerVariants, reducedMotionBlogGridContainerVariants } from "@/lib/animations";
import { BlogPostCard } from "./BlogPostCard";
import type { BlogPost } from "./types";

interface BlogGridProps {
  posts: BlogPost[];
}

export function BlogGrid({ posts }: BlogGridProps) {
  const prefersReducedMotion = useReducedMotion();
  const containerVariants = prefersReducedMotion ? reducedMotionBlogGridContainerVariants : blogGridContainerVariants;

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
      initial="hidden"
      animate="show"
      variants={containerVariants}
    >
      {posts.map((post) => (
        <BlogPostCard key={post.url} post={post} />
      ))}
    </motion.div>
  );
}
