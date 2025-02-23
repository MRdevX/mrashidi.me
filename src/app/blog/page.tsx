"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { IBlogPost } from "@/types/blog";
import { blogService } from "@/services/blogService";

export default function Blog() {
  const [posts, setPosts] = useState<IBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const postsPerPage = 6;

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await blogService.getBlogPosts(page, postsPerPage);
      setPosts(response.posts);
      setTotalPosts(response.total);
      setError(null);
    } catch (err) {
      setError("Failed to fetch blog posts. Please try again later.");
      console.error("Error fetching blog posts:", err);
    } finally {
      setLoading(false);
    }
  }, [page, postsPerPage]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const totalPages = Math.ceil(totalPosts / postsPerPage);

  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto px-4">
        <motion.h1
          className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Blog Posts
        </motion.h1>

        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        ) : error ? (
          <motion.div
            className="text-center text-red-500 dark:text-red-400 py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {error}
          </motion.div>
        ) : (
          <>
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
                <motion.article
                  key={post.url}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0 },
                  }}
                  whileHover={{ scale: 1.02 }}
                >
                  {post.imageUrl && (
                    <div className="relative w-full h-48">
                      <Image
                        src={post.imageUrl}
                        alt={post.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h2 className="text-xl font-bold mb-3 text-gray-800 dark:text-white">{post.title}</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">{post.content}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(post.publishedAt).toLocaleDateString()}
                      </span>
                      <a
                        href={post.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium"
                      >
                        Read More →
                      </a>
                    </div>
                  </div>
                </motion.article>
              ))}
            </motion.div>

            {totalPages > 1 && (
              <div className="mt-12 flex justify-center space-x-4">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-gray-700 dark:text-gray-300">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
