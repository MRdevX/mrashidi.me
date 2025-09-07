import NodeCache from "node-cache";
import { logger } from "@/lib/core";

export class CacheService {
  private cache: NodeCache;
  private readonly CACHE_TTL = 60 * 60;

  constructor() {
    this.cache = new NodeCache({
      stdTTL: this.CACHE_TTL,
      checkperiod: this.CACHE_TTL * 0.2,
    });
  }

  get<T>(key: string): T | undefined {
    try {
      return this.cache.get<T>(key);
    } catch (error) {
      logger.error({
        operation: "cache.get",
        key,
        error: error instanceof Error ? error.message : String(error),
      });
      return undefined;
    }
  }

  set<T>(key: string, value: T, ttl?: number): void {
    try {
      if (ttl !== undefined) {
        this.cache.set(key, value, ttl);
      } else {
        this.cache.set(key, value);
      }
    } catch (error) {
      logger.error({
        operation: "cache.set",
        key,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  getBlogPosts<T>(): { posts: T[]; total: number } | null {
    const posts = this.get<T[]>("blog_posts");
    const total = this.get<number>("blog_posts_total");

    if (!posts || total === undefined) {
      return null;
    }

    return { posts, total };
  }

  setBlogPosts<T>(posts: T[], total: number): void {
    this.set("blog_posts", posts);
    this.set("blog_posts_total", total);
    this.set("blog_last_update", Date.now());
  }

  getLastUpdateTime(): number | null {
    return this.get<number>("blog_last_update") || null;
  }
}

export const cacheService = new CacheService();
