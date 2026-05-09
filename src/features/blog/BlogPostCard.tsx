"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useThemeConfig } from "@/hooks/useThemeConfig";
import { NewTabSrOnly } from "@/lib/a11y/new-tab-hint";
import type { BlogPost } from "./types";

interface BlogPostCardProps {
  post: BlogPost;
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  const { getTextColor, getCardPattern } = useThemeConfig();
  const [imageError, setImageError] = useState(false);

  return (
    <motion.article
      className={getCardPattern()}
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
      }}
      whileHover={{ scale: 1.02 }}
    >
      <Link
        href={post.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
      >
        {post.imageUrl && !imageError && (
          <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={() => setImageError(true)}
              unoptimized
            />
          </div>
        )}
        <div className="space-y-4 relative z-10">
          <h2 className="text-xl font-bold text-orange-500 group-hover:text-orange-400 transition-colors">
            {post.title}
          </h2>
          <p
            className={`${getTextColor("secondary")} group-hover:${getTextColor("primary")} transition-colors line-clamp-3`}
          >
            {post.content}
          </p>
          <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <span className={`text-sm ${getTextColor("muted")}`}>
                {new Date(post.publishedAt).toLocaleDateString()}
              </span>
              <span className="text-xs px-2 py-1 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400">
                Blog Post
              </span>
            </div>
            <span className="text-orange-500 group-hover:text-orange-400 transition-colors flex items-center gap-1 text-sm font-medium">
              Read More
              <ArrowRight className="w-4 h-4 shrink-0" aria-hidden />
            </span>
          </div>
        </div>
        <NewTabSrOnly />
      </Link>
    </motion.article>
  );
}
