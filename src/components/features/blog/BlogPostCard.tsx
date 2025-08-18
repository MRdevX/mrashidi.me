"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { BlogPost } from "./types";

interface BlogPostCardProps {
  post: BlogPost;
}

export default function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <motion.article
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
          <h2 className="text-xl font-bold text-orange-500 group-hover:text-orange-400 transition-colors">{post.title}</h2>
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
  );
}
