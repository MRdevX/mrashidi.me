import { NextResponse } from "next/server";
import { parseString } from "xml2js";
import { IBlogPost, IBlogAuthor, IMediumRssFeed } from "@/types/blog";
import { cacheService } from "@/services/cacheService";

const authors: IBlogAuthor[] = [
  {
    username: "mrdevx",
    name: "Mahdi Rashidi",
    mediumUrl: "https://mrdevx.medium.com",
  },
];

const CACHE_UPDATE_INTERVAL = 1000 * 60 * 60; // 1 hour in milliseconds

class BlogService {
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
          "User-Agent": "Mozilla/5.0 (compatible; BlogFetcher/1.0)",
          Accept: "application/xml",
        },
        next: { revalidate: 3600 }, // Cache the fetch for 1 hour
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

      // Sort posts by date
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
    // Only start if we're on the server and not in a test environment
    if (typeof window !== "undefined" || process.env.NODE_ENV === "test") {
      return;
    }

    // Clear any existing interval
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }

    // Set new interval
    this.updateInterval = setInterval(() => this.updateCache(), CACHE_UPDATE_INTERVAL);

    // Initial update
    this.updateCache().catch(console.error);
  }

  static async getAllPosts(page: number, limit: number) {
    try {
      // Try to get posts from cache
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

      // If cache miss, fetch fresh data
      const allPosts: IBlogPost[] = [];
      for (const author of authors) {
        const posts = await this.fetchMediumPosts(author);
        allPosts.push(...posts);
      }

      // Sort posts by date
      const sortedPosts = allPosts.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());

      // Update cache with new data
      await cacheService.setBlogPosts(sortedPosts, sortedPosts.length);

      // Return paginated results
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

// Initialize the cache update interval
BlogService.startCacheUpdateInterval();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    const result = await BlogService.getAllPosts(page, limit);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to fetch blog posts:", error);
    return NextResponse.json({ error: "Failed to fetch blog posts" }, { status: 500 });
  }
}
