"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { blogService } from "@/services/blogService";
import useSWR from "swr";

export default function Blog() {
  const [page, setPage] = useState(1);
  const postsPerPage = 6;

  const fetcher = (page: number, postsPerPage: number) => blogService.getBlogPosts(page, postsPerPage);

  const { data, error, isLoading } = useSWR(["blogPosts", page, postsPerPage], ([, p, pp]) => fetcher(p, pp));

  const posts = data?.posts || [];
  const totalPosts = data?.total || 0;
  const totalPages = Math.ceil(totalPosts / postsPerPage);

  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-4xl mx-auto px-4">
        <motion.h1
          className="text-4xl font-bold mb-8 text-orange-500 font-cyberpunk glow-text"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Blog Posts
        </motion.h1>

        {isLoading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        ) : error ? (
          <motion.div className="text-center text-red-500 py-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            Failed to fetch blog posts. Please try again later.
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
                  className="feature-card group"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0 },
                  }}
                  whileHover={{ scale: 1.02 }}
                >
                  {post.imageUrl && (
                    <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
                      <Image
                        src={post.imageUrl}
                        alt={post.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  )}
                  <div className="space-y-4 relative z-10">
                    <Link href={post.url} target="_blank" rel="noopener noreferrer" className="block">
                      <h2 className="text-xl font-bold text-orange-500 group-hover:text-orange-400 transition-colors">
                        {post.title}
                      </h2>
                    </Link>
                    <p className="text-gray-400 group-hover:text-gray-300 transition-colors line-clamp-3">{post.content}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">{new Date(post.publishedAt).toLocaleDateString()}</span>
                      <Link
                        href={post.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-500 hover:text-orange-400 transition-colors flex items-center gap-1"
                      >
                        Read More
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </Link>
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
                  className={`neon-button ${page === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-gray-400">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className={`neon-button ${page === totalPages ? "opacity-50 cursor-not-allowed" : ""}`}
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
