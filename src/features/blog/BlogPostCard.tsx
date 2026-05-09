"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useThemeConfig } from "@/hooks/useThemeConfig";
import { NewTabSrOnly } from "@/lib/a11y/new-tab-hint";
import { PAGE_TRANSITION_EASE, pageItemVariants, reducedMotionPageItemVariants } from "@/lib/animations";
import type { BlogPost } from "./types";

interface BlogPostCardProps {
  post: BlogPost;
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  const { getTextColor, getCardPattern } = useThemeConfig();
  const [imageError, setImageError] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const cardVariants = prefersReducedMotion ? reducedMotionPageItemVariants : pageItemVariants;

  return (
    <motion.article
      className={`${getCardPattern()} flex h-full flex-col`}
      variants={cardVariants}
      whileHover={prefersReducedMotion ? undefined : { scale: 1.02 }}
      transition={{ duration: 0.26, ease: PAGE_TRANSITION_EASE }}
    >
      <Link
        href={post.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex h-full flex-1 flex-col rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900 transition-[transform,box-shadow] duration-200 ease-out min-h-0"
      >
        {post.imageUrl && !imageError && (
          <div className="relative mb-4 h-48 w-full shrink-0 overflow-hidden rounded-lg">
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
        <div className="relative z-10 flex min-h-0 flex-1 flex-col gap-4">
          <h2 className="line-clamp-2 shrink-0 text-xl font-bold text-orange-500 transition-colors group-hover:text-orange-400">
            {post.title}
          </h2>
          <div className="flex min-h-[3lh] min-w-0 flex-1 flex-col">
            <p
              className={`${getTextColor("secondary")} group-hover:${getTextColor("primary")} line-clamp-3 transition-colors`}
            >
              {post.content}
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-gray-200 pt-3 dark:border-gray-700">
            <div className="flex min-w-0 flex-wrap items-center gap-3">
              <span className={`whitespace-nowrap text-sm ${getTextColor("muted")}`}>
                {new Date(post.publishedAt).toLocaleDateString()}
              </span>
              <span className="shrink-0 text-xs px-2 py-1 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400">
                Blog Post
              </span>
            </div>
            <span className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-orange-500 transition-colors group-hover:text-orange-400">
              Read More
              <ArrowRight className="size-4 shrink-0" aria-hidden />
            </span>
          </div>
        </div>
        <NewTabSrOnly />
      </Link>
    </motion.article>
  );
}
