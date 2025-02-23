import { parseString } from "xml2js";
import { IBlogPost, IBlogAuthor, IMediumRssFeed } from "@/types/blog";

class BlogService {
  private readonly authors: IBlogAuthor[];
  private readonly cacheTimeout = 1000 * 60 * 15; // 15 minutes
  private cachedPosts: IBlogPost[] = [];
  private lastFetchTime: number = 0;

  constructor() {
    this.authors = [
      {
        username: "mrdevx",
        name: "Mahdi Rashidi",
        mediumUrl: "https://mrdevx.medium.com",
      },
    ];
  }

  async getBlogPosts(page: number = 1, limit: number = 10): Promise<{ posts: IBlogPost[]; total: number }> {
    try {
      await this.updateCacheIfNeeded();

      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedPosts = this.cachedPosts.slice(startIndex, endIndex);

      return {
        posts: paginatedPosts,
        total: this.cachedPosts.length,
      };
    } catch (error) {
      console.error("Failed to fetch blog posts:", error);
      throw error;
    }
  }

  private async updateCacheIfNeeded(): Promise<void> {
    const now = Date.now();
    if (now - this.lastFetchTime < this.cacheTimeout && this.cachedPosts.length > 0) {
      return;
    }

    try {
      const allPosts: IBlogPost[] = [];

      for (const author of this.authors) {
        const posts = await this.fetchMediumPosts(author);
        if (posts && posts.length > 0) {
          allPosts.push(...posts);
        }
      }

      if (allPosts.length > 0) {
        this.cachedPosts = allPosts.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
        this.lastFetchTime = now;
      } else {
        console.warn("No blog posts were fetched from any author");
      }
    } catch (error) {
      console.error("Failed to update blog posts cache:", error);
      if (this.cachedPosts.length > 0) {
        console.log("Returning cached posts due to fetch error");
        return;
      }
      throw error;
    }
  }

  private async fetchMediumPosts(author: IBlogAuthor): Promise<IBlogPost[]> {
    try {
      const feedUrl = `${author.mediumUrl}/feed`;
      const response = await fetch(feedUrl);
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

  private parseMediumFeed(xmlData: string): Promise<IMediumRssFeed> {
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

  private cleanHtmlContent(html: string): string {
    if (!html) return "";
    return html
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/\n\s*\n/g, "\n")
      .trim();
  }

  private extractImageUrl(html: string): string | undefined {
    if (!html) return undefined;
    const imgMatch = html.match(/<img[^>]+src="([^">]+)"/);
    return imgMatch ? imgMatch[1] : undefined;
  }
}

export const blogService = new BlogService();
