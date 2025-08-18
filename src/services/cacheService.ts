import NodeCache from "node-cache";
import { IBlogPost } from "@/types/blog";

class CacheService {
  private cache: NodeCache;
  private readonly BLOG_POSTS_KEY = "blog_posts";
  private readonly BLOG_POSTS_TOTAL_KEY = "blog_posts_total";
  private readonly BLOG_LAST_UPDATE_KEY = "blog_last_update";
  private readonly CACHE_TTL = 60 * 60;

  constructor() {
    this.cache = new NodeCache({
      stdTTL: this.CACHE_TTL,
      checkperiod: this.CACHE_TTL * 0.2,
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
      this.cache.set(this.BLOG_LAST_UPDATE_KEY, Date.now());
    } catch (error) {
      console.error("Error setting blog posts in cache:", error);
    }
  }

  getLastUpdateTime(): number | null {
    try {
      return this.cache.get<number>(this.BLOG_LAST_UPDATE_KEY) || null;
    } catch (error) {
      console.error("Error getting last update time:", error);
      return null;
    }
  }
}

export const cacheService = new CacheService();
