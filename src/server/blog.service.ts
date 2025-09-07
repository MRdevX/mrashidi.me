import { parseString } from "xml2js";
import { API_CONFIG, logger } from "@/lib/core";
import type { IBlogAuthor, IBlogPost, IMediumRssFeed } from "@/types/blog";
import { cacheService } from "./cache.service";

const authors: IBlogAuthor[] = [
  {
    username: "mrdevx",
    name: "Dee Rashidi",
    mediumUrl: "https://mrdevx.medium.com",
  },
];

const CACHE_UPDATE_INTERVAL = API_CONFIG.CACHE.BLOG_UPDATE_INTERVAL;
let isUpdating = false;

export async function parseMediumFeed(xmlData: string): Promise<IMediumRssFeed> {
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

export function cleanHtmlContent(html: string): string {
  if (!html) {
    return "";
  }
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/\n\s*\n/g, "\n")
    .trim();
}

export function extractImageUrl(html: string): string | undefined {
  if (!html) {
    return undefined;
  }
  const imgMatch = html.match(/<img[^>]+src="([^">]+)"/);
  return imgMatch ? imgMatch[1] : undefined;
}

export async function fetchMediumPosts(author: IBlogAuthor): Promise<IBlogPost[]> {
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

    const feed = await parseMediumFeed(xmlData);

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

    const posts: IBlogPost[] = items.map((item: Record<string, unknown>) => {
      const content = (item["content:encoded"] as string) || (item.description as string) || "";
      const cleanContent = cleanHtmlContent(content);
      const imageUrl = extractImageUrl(content);

      return {
        title: item.title as string,
        content: cleanContent,
        url: item.link as string,
        publishedAt: new Date(item.pubDate as string),
        imageUrl,
        author: {
          name: author.name,
          username: author.username,
          mediumUrl: author.mediumUrl,
        },
      };
    });

    logger.debug({
      operation: "fetchMediumPosts",
      author: author.username,
      postsCount: posts.length,
    });

    return posts;
  } catch (error) {
    logger.error({
      operation: "fetchMediumPosts",
      author: author.username,
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}

async function fetchAllPosts(): Promise<IBlogPost[]> {
  const allPosts: IBlogPost[] = [];

  for (const author of authors) {
    try {
      const posts = await fetchMediumPosts(author);
      allPosts.push(...posts);
    } catch (error) {
      logger.error({
        operation: "fetchAllPosts",
        author: author.username,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return allPosts.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
}

async function updateCache(): Promise<void> {
  if (isUpdating) {
    return;
  }

  try {
    isUpdating = true;
    const posts = await fetchAllPosts();
    cacheService.setBlogPosts(posts, posts.length);
    logger.info({ operation: "updateCache", postsCount: posts.length });
  } catch (error) {
    logger.error({
      operation: "updateCache",
      error: error instanceof Error ? error.message : String(error),
    });
  } finally {
    isUpdating = false;
  }
}

export function startCacheUpdateInterval(): void {
  if (typeof window !== "undefined" || process.env.NODE_ENV === "test") {
    return;
  }

  if (process.env.NODE_ENV !== "development") {
    return;
  }

  updateCache().catch((error) => {
    logger.error({
      operation: "startCacheUpdateInterval",
      error: error instanceof Error ? error.message : String(error),
    });
  });

  setInterval(() => {
    if (!isUpdating) {
      updateCache().catch((error) => {
        logger.error({
          operation: "startCacheUpdateInterval",
          error: error instanceof Error ? error.message : String(error),
        });
      });
    }
  }, CACHE_UPDATE_INTERVAL);
}

export async function getAllPosts(page: number, limit: number) {
  try {
    const cachedData = cacheService.getBlogPosts<IBlogPost>();

    if (cachedData) {
      const { posts, total } = cachedData;
      const startIndex = (page - 1) * limit;
      const paginatedPosts = posts.slice(startIndex, startIndex + limit);

      const lastUpdate = cacheService.getLastUpdateTime();
      const thirtyMinutes = 30 * 60 * 1000;
      if (lastUpdate && Date.now() - lastUpdate > thirtyMinutes) {
        updateCache().catch(() => {});
      }

      return { posts: paginatedPosts, total, fromCache: true };
    }

    const posts = await fetchAllPosts();
    cacheService.setBlogPosts(posts, posts.length);

    const startIndex = (page - 1) * limit;
    const paginatedPosts = posts.slice(startIndex, startIndex + limit);

    return { posts: paginatedPosts, total: posts.length, fromCache: false };
  } catch (error) {
    logger.error({
      operation: "getAllPosts",
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}

startCacheUpdateInterval();

export const blogService = {
  getBlogPosts: async (page: number = 1, limit: number = 10) => {
    const result = await getAllPosts(page, limit);
    return {
      posts: result.posts,
      total: result.total,
    };
  },
};
