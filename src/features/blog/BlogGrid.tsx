"use client";

import { BlogPostCard } from "./BlogPostCard";
import { BlogPostsGridMotion } from "./BlogPostsGridMotion";
import type { BlogPost } from "./types";

interface BlogGridProps {
  posts: BlogPost[];
}

export function BlogGrid({ posts }: BlogGridProps) {
  return (
    <BlogPostsGridMotion>
      {posts.map((post) => (
        <BlogPostCard key={post.url} post={post} />
      ))}
    </BlogPostsGridMotion>
  );
}
