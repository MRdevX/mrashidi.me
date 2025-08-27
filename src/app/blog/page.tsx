"use client";

import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { BlogContainer, BlogError, BlogGrid, BlogLoading, BlogPagination, useBlogData } from "@/features/blog";
import { fadeInVariants } from "@/lib/animations";

export default function Blog() {
  const { posts, totalPages, currentPage, isLoading, error, setPage } = useBlogData(6);

  return (
    <BlogContainer>
      <motion.div initial="hidden" animate="visible" variants={fadeInVariants} transition={{ duration: 0.5 }}>
        <div className="flex items-center gap-3 mb-8">
          <BookOpen className="w-8 h-8 text-orange-500" />
          <h1 className="text-4xl font-bold text-orange-500 font-cyberpunk glow-text">Blog Posts</h1>
        </div>
      </motion.div>

      <div className="glass-card p-8">
        {isLoading ? (
          <BlogLoading />
        ) : error ? (
          <BlogError />
        ) : (
          <>
            <BlogGrid posts={posts} />
            <BlogPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </div>
    </BlogContainer>
  );
}
