import { parseString } from "xml2js";
import { IBlogPost, IBlogAuthor, IMediumRssFeed } from "@/types/blog";
import { cacheService } from "./cacheService";
import { cachePerformanceMonitor } from "@/lib/utils/cachePerformance";
import { API_CONFIG } from "@/lib/config/api";
import { logger } from "@/lib/utils/logger";

const authors: IBlogAuthor[] = [
  {
    username: "mrdevx",
    name: "Mahdi Rashidi",
    mediumUrl: "https://mrdevx.medium.com",
  },
];

const CACHE_UPDATE_INTERVAL = API_CONFIG.CACHE.BLOG_UPDATE_INTERVAL;

export class BlogService {
  private static isUpdating = false;
  private static updateInterval: NodeJS.Timeout | null = null;
  private static isPreloaded = false;

  static async parseMediumFeed(xmlData: string): Promise<IMediumRssFeed> {
    return new Promise((resolve, reject) => {
      parseString(xmlData, { explicitArray: false }, (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        if (!result?.rss?.channel) {
          reject(new Error("Invalid RSS feed structure"));
          return;
        }

        resolve(result);
      });
    });
  }

  static cleanHtmlContent(html: string): string {
    if (!html) return "";
    return html
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/\n\s*\n/g, "\n")
      .trim();
  }

  static extractImageUrl(html: string): string | undefined {
    if (!html) return undefined;
    const imgMatch = html.match(/<img[^>]+src="([^">]+)"/);
    return imgMatch ? imgMatch[1] : undefined;
  }

  static async fetchMediumPosts(author: IBlogAuthor): Promise<IBlogPost[]> {
    try {
      const feedUrl = `${author.mediumUrl}/feed`;
      logger.debug({
        operation: "fetchMediumPosts",
        author: author.username,
        feedUrl,
      });

      const response = await fetch(feedUrl, {
        headers: {
          "User-Agent": API_CONFIG.MEDIUM.USER_AGENT,
          Accept: API_CONFIG.MEDIUM.ACCEPT_HEADER,
        },
        next: { revalidate: API_CONFIG.CACHE.BLOG_REVALIDATE },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch feed: ${response.status} ${response.statusText}`);
      }

      const xmlData = await response.text();
      logger.debug({
        operation: "fetchMediumPosts",
        author: author.username,
        xmlDataLength: xmlData.length,
      });

      const feed = await this.parseMediumFeed(xmlData);

      if (!feed?.rss?.channel?.item) {
        logger.warn({
          operation: "fetchMediumPosts",
          author: author.username,
          message: "No items found in feed",
        });
        return [];
      }

      const items = Array.isArray(feed.rss.channel.item) ? feed.rss.channel.item : [feed.rss.channel.item];
      logger.debug({
        operation: "fetchMediumPosts",
        author: author.username,
        itemsCount: items.length,
      });

      return items.map((item) => ({
        title: item.title || "Untitled",
        content: this.cleanHtmlContent(item["content:encoded"] || ""),
        url: item.link,
        publishedAt: new Date(item.pubDate),
        imageUrl: this.extractImageUrl(item["content:encoded"] || ""),
        author: {
          username: author.username,
          name: author.name,
          mediumUrl: author.mediumUrl,
        },
      }));
    } catch (error) {
      logger.error({
        operation: "fetchMediumPosts",
        author: author.username,
        error: error instanceof Error ? error.message : String(error),
      });
      return [];
    }
  }

  static async preloadBlogPosts(): Promise<void> {
    if (this.isPreloaded) {
      logger.debug({ operation: "preloadBlogPosts", message: "Already preloaded" });
      return;
    }

    try {
      logger.info({ operation: "preloadBlogPosts", status: "started" });
      await this.updateCache();
      this.isPreloaded = true;
      logger.info({ operation: "preloadBlogPosts", status: "completed" });
    } catch (error) {
      logger.error({
        operation: "preloadBlogPosts",
        status: "failed",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  static async updateCache() {
    if (this.isUpdating) return;

    try {
      this.isUpdating = true;
      logger.info({ operation: "updateCache", status: "started" });

      const allPosts: IBlogPost[] = [];
      for (const author of authors) {
        const posts = await this.fetchMediumPosts(author);
        allPosts.push(...posts);
      }

      const sortedPosts = allPosts.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());

      await cacheService.setBlogPosts(sortedPosts, sortedPosts.length);
      logger.info({
        operation: "updateCache",
        status: "completed",
        postsCount: sortedPosts.length,
      });
    } catch (error) {
      logger.error({
        operation: "updateCache",
        status: "failed",
        error: error instanceof Error ? error.message : String(error),
      });
    } finally {
      this.isUpdating = false;
    }
  }

  static startCacheUpdateInterval() {
    if (typeof window !== "undefined" || process.env.NODE_ENV === "test") {
      return;
    }

    if (process.env.NODE_ENV !== "development") {
      return;
    }

    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }

    if (process.env.NODE_ENV === "development") {
      this.preloadBlogPosts().catch((error) => {
        logger.error({
          operation: "startCacheUpdateInterval",
          message: "Failed to preload blog posts",
          error: error instanceof Error ? error.message : String(error),
        });
      });
    }

    this.updateInterval = setInterval(() => {
      if (!this.isUpdating) {
        this.updateCache().catch((error) => {
          logger.error({
            operation: "startCacheUpdateInterval",
            message: "Failed to update cache",
            error: error instanceof Error ? error.message : String(error),
          });
        });
      }
    }, CACHE_UPDATE_INTERVAL);

    setInterval(
      () => {
        cachePerformanceMonitor.logMetrics();
      },
      10 * 60 * 1000
    );
  }

  static async getAllPosts(page: number, limit: number) {
    const startTime = Date.now();

    try {
      logger.debug({ operation: "getAllPosts", status: "checking_cache" });
      const cachedData = await cacheService.getBlogPosts();

      if (cachedData) {
        const responseTime = Date.now() - startTime;
        cachePerformanceMonitor.recordHit(responseTime);

        logger.debug({
          operation: "getAllPosts",
          status: "cache_hit",
          postsCount: cachedData.total,
        });

        const { posts, total } = cachedData;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedPosts = posts.slice(startIndex, endIndex);

        this.triggerBackgroundRefresh();

        return {
          posts: paginatedPosts,
          total,
          fromCache: true,
        };
      }

      logger.debug({ operation: "getAllPosts", status: "cache_miss" });
      const allPosts: IBlogPost[] = [];
      for (const author of authors) {
        logger.debug({
          operation: "getAllPosts",
          status: "fetching_author",
          author: author.username,
        });
        const posts = await this.fetchMediumPosts(author);
        allPosts.push(...posts);
      }

      logger.debug({
        operation: "getAllPosts",
        status: "fetched_all",
        totalPosts: allPosts.length,
      });

      const sortedPosts = allPosts.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());

      await cacheService.setBlogPosts(sortedPosts, sortedPosts.length);
      logger.debug({ operation: "getAllPosts", status: "cached_successfully" });

      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedPosts = sortedPosts.slice(startIndex, endIndex);

      const responseTime = Date.now() - startTime;
      cachePerformanceMonitor.recordMiss(responseTime);

      return {
        posts: paginatedPosts,
        total: sortedPosts.length,
        fromCache: false,
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      cachePerformanceMonitor.recordMiss(responseTime);

      logger.error({
        operation: "getAllPosts",
        status: "failed",
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  private static triggerBackgroundRefresh() {
    const lastUpdate = cacheService.getLastUpdateTime();
    const thirtyMinutes = 30 * 60 * 1000;

    if (lastUpdate && Date.now() - lastUpdate > thirtyMinutes) {
      logger.debug({
        operation: "triggerBackgroundRefresh",
        message: "Cache is stale, triggering background refresh",
      });
      this.updateCache().catch((error) => {
        logger.error({
          operation: "triggerBackgroundRefresh",
          message: "Failed to update cache",
          error: error instanceof Error ? error.message : String(error),
        });
      });
    }
  }
}

BlogService.startCacheUpdateInterval();

export const blogService = {
  getBlogPosts: async (page: number = 1, limit: number = 10) => {
    const result = await BlogService.getAllPosts(page, limit);
    return {
      posts: result.posts,
      total: result.total,
    };
  },
  preloadBlogPosts: () => BlogService.preloadBlogPosts(),
};
