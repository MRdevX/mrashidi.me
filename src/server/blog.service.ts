import { parseString } from "xml2js";
import { API_CONFIG } from "@/lib/config/api";
import { logger } from "@/lib/logger";
import { cachePerformanceMonitor } from "@/lib/utils/cachePerformance";
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
let updateInterval: NodeJS.Timeout | null = null;
let isPreloaded = false;

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

export async function preloadBlogPosts(): Promise<void> {
  if (isPreloaded) {
    logger.debug({ operation: "preloadBlogPosts", status: "already_preloaded" });
    return;
  }

  try {
    logger.info({ operation: "preloadBlogPosts", status: "started" });
    isPreloaded = true;

    const allPosts: IBlogPost[] = [];
    for (const author of authors) {
      const posts = await fetchMediumPosts(author);
      allPosts.push(...posts);
    }

    const sortedPosts = allPosts.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());

    await cacheService.setBlogPosts(sortedPosts, sortedPosts.length);
    logger.info({
      operation: "preloadBlogPosts",
      status: "completed",
      postsCount: sortedPosts.length,
    });
  } catch (error) {
    isPreloaded = false;
    logger.error({
      operation: "preloadBlogPosts",
      status: "failed",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

export async function updateCache(): Promise<void> {
  if (isUpdating) {
    return;
  }

  try {
    isUpdating = true;
    logger.info({ operation: "updateCache", status: "started" });

    const allPosts: IBlogPost[] = [];
    for (const author of authors) {
      const posts = await fetchMediumPosts(author);
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

  if (updateInterval) {
    clearInterval(updateInterval);
  }

  if (process.env.NODE_ENV === "development") {
    preloadBlogPosts().catch((error) => {
      logger.error({
        operation: "startCacheUpdateInterval",
        message: "Failed to preload blog posts",
        error: error instanceof Error ? error.message : String(error),
      });
    });
  }

  updateInterval = setInterval(() => {
    if (!isUpdating) {
      updateCache().catch((error) => {
        logger.error({
          operation: "startCacheUpdateInterval",
          message: "Failed to update cache",
          error: error instanceof Error ? error.message : String(error),
        });
      });
    }
  }, CACHE_UPDATE_INTERVAL);

  setInterval(() => {
    cachePerformanceMonitor.logMetrics();
  }, 10 * 60 * 1000);
}

export async function getAllPosts(page: number, limit: number) {
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

      triggerBackgroundRefresh();

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
      const posts = await fetchMediumPosts(author);
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

function triggerBackgroundRefresh(): void {
  const lastUpdate = cacheService.getLastUpdateTime();
  const thirtyMinutes = 30 * 60 * 1000;

  if (lastUpdate && Date.now() - lastUpdate > thirtyMinutes) {
    logger.debug({
      operation: "triggerBackgroundRefresh",
      message: "Cache is stale, triggering background refresh",
    });
    updateCache().catch((error) => {
      logger.error({
        operation: "triggerBackgroundRefresh",
        message: "Failed to update cache",
        error: error instanceof Error ? error.message : String(error),
      });
    });
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
  preloadBlogPosts: () => preloadBlogPosts(),
};
