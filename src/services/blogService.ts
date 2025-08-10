import { parseString } from "xml2js";
import { IBlogPost, IBlogAuthor, IMediumRssFeed } from "@/types/blog";
import { cacheService } from "./cacheService";
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
      const response = await fetch(feedUrl, {
        headers: {
          "User-Agent": API_CONFIG.MEDIUM.USER_AGENT,
          Accept: API_CONFIG.MEDIUM.ACCEPT_HEADER,
        },
        next: { revalidate: API_CONFIG.CACHE.BLOG_REVALIDATE },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch feed: ${response.status}`);
      }

      const xmlData = await response.text();
      const feed = await this.parseMediumFeed(xmlData);

      if (!feed?.rss?.channel?.item) {
        console.warn(`No items found in feed for author ${author.username}`);
        return [];
      }

      const items = Array.isArray(feed.rss.channel.item) ? feed.rss.channel.item : [feed.rss.channel.item];

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

    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }

    this.updateInterval = setInterval(() => this.updateCache(), CACHE_UPDATE_INTERVAL);

    this.updateCache().catch(console.error);
  }

  static async getAllPosts(page: number, limit: number) {
    try {
      const cachedData = await cacheService.getBlogPosts();

      if (cachedData) {
        const { posts, total } = cachedData;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedPosts = posts.slice(startIndex, endIndex);

        return {
          posts: paginatedPosts,
          total,
          fromCache: true,
        };
      }

      const allPosts: IBlogPost[] = [];
      for (const author of authors) {
        const posts = await this.fetchMediumPosts(author);
        allPosts.push(...posts);
      }

      const sortedPosts = allPosts.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());

      await cacheService.setBlogPosts(sortedPosts, sortedPosts.length);

      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedPosts = sortedPosts.slice(startIndex, endIndex);

      return {
        posts: paginatedPosts,
        total: sortedPosts.length,
        fromCache: false,
      };
    } catch (error) {
      console.error("Failed to fetch blog posts:", error);
      throw error;
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
};
