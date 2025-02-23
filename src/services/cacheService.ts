import NodeCache from "node-cache";
import { IBlogPost } from "@/types/blog";

class CacheService {
  private cache: NodeCache;
  private readonly BLOG_POSTS_KEY = "blog_posts";
  private readonly BLOG_POSTS_TOTAL_KEY = "blog_posts_total";
  private readonly CACHE_TTL = 60 * 60; // 1 hour in seconds

  constructor() {
    this.cache = new NodeCache({
      stdTTL: this.CACHE_TTL,
      checkperiod: this.CACHE_TTL * 0.2, // Check for expired keys at 20% of TTL
    });
  }

  async getBlogPosts(): Promise<{ posts: IBlogPost[]; total: number } | null> {
    try {
      const posts = this.cache.get<IBlogPost[]>(this.BLOG_POSTS_KEY);
      const total = this.cache.get<number>(this.BLOG_POSTS_TOTAL_KEY);

      if (!posts || total === undefined) return null;

      return { posts, total };
    } catch (error) {
      console.error("Error getting blog posts from cache:", error);
      return null;
    }
  }

  async setBlogPosts(posts: IBlogPost[], total: number): Promise<void> {
    try {
      this.cache.set(this.BLOG_POSTS_KEY, posts);
      this.cache.set(this.BLOG_POSTS_TOTAL_KEY, total);
    } catch (error) {
      console.error("Error setting blog posts in cache:", error);
    }
  }
}

// Create a singleton instance
export const cacheService = new CacheService();
