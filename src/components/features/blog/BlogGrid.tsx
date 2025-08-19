"use client";

import { motion } from "framer-motion";
import { BlogPost } from "./types";
import { BlogPostCard } from "./BlogPostCard";

interface BlogGridProps {
  posts: BlogPost[];
}

export function BlogGrid({ posts }: BlogGridProps) {
  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 gap-8"
      initial="hidden"
      animate="show"
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
    >
      {posts.map((post) => (
        <BlogPostCard key={post.url} post={post} />
      ))}
    </motion.div>
  );
}
