import { parseString } from "xml2js";
import { IBlogPost, IBlogAuthor, IMediumRssFeed } from "@/types/blog";
import { cacheService } from "./cacheService";
import { cachePerformanceMonitor } from "@/lib/utils/cachePerformance";
import { API_CONFIG } from "@/lib/config/api";

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
      console.log(`Fetching Medium feed from: ${feedUrl}`);

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
      console.log(`Received XML data length: ${xmlData.length}`);

      const feed = await this.parseMediumFeed(xmlData);

      if (!feed?.rss?.channel?.item) {
        console.warn(`No items found in feed for author ${author.username}`);
        return [];
      }

      const items = Array.isArray(feed.rss.channel.item) ? feed.rss.channel.item : [feed.rss.channel.item];
      console.log(`Found ${items.length} items in feed for ${author.username}`);

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
      console.error(`Failed to fetch posts for ${author.username}:`, error);
      return [];
    }
  }

  static async preloadBlogPosts(): Promise<void> {
    if (this.isPreloaded) {
      console.log("Blog posts already preloaded");
      return;
    }

    try {
      console.log("Preloading blog posts...");
      await this.updateCache();
      this.isPreloaded = true;
      console.log("Blog posts preloaded successfully");
    } catch (error) {
      console.error("Failed to preload blog posts:", error);
    }
  }

  static async updateCache() {
    if (this.isUpdating) return;

    try {
      this.isUpdating = true;
      console.log("Starting blog posts cache update...");

      const allPosts: IBlogPost[] = [];
      for (const author of authors) {
        const posts = await this.fetchMediumPosts(author);
        allPosts.push(...posts);
      }

      const sortedPosts = allPosts.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());

      await cacheService.setBlogPosts(sortedPosts, sortedPosts.length);
      console.log("Blog posts cache updated successfully");
    } catch (error) {
      console.error("Failed to update blog posts cache:", error);
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
      this.preloadBlogPosts().catch(console.error);
    }

    this.updateInterval = setInterval(() => {
      if (!this.isUpdating) {
        this.updateCache().catch(console.error);
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
      console.log("Getting all posts, checking cache first...");
      const cachedData = await cacheService.getBlogPosts();

      if (cachedData) {
        const responseTime = Date.now() - startTime;
        cachePerformanceMonitor.recordHit(responseTime);

        console.log(`Found cached data with ${cachedData.total} posts`);
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

      console.log("No cached data found, fetching from Medium...");
      const allPosts: IBlogPost[] = [];
      for (const author of authors) {
        console.log(`Fetching posts for author: ${author.username}`);
        const posts = await this.fetchMediumPosts(author);
        allPosts.push(...posts);
      }

      console.log(`Total posts fetched: ${allPosts.length}`);
      const sortedPosts = allPosts.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());

      await cacheService.setBlogPosts(sortedPosts, sortedPosts.length);
      console.log("Posts cached successfully");

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

      console.error("Failed to fetch blog posts:", error);
      throw error;
    }
  }

  private static triggerBackgroundRefresh() {
    const lastUpdate = cacheService.getLastUpdateTime();
    const thirtyMinutes = 30 * 60 * 1000;

    if (lastUpdate && Date.now() - lastUpdate > thirtyMinutes) {
      console.log("Cache is stale, triggering background refresh...");
      this.updateCache().catch(console.error);
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
