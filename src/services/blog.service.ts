import { parseString } from "xml2js";
import { API_CONFIG, logger } from "@/lib/core";
import { cleanHtmlContent, extractImageUrl } from "@/lib/utils/string";
import type { IBlogAuthor, IBlogPost, IMediumRssFeed } from "@/types/blog";

const authors: IBlogAuthor[] = [
  {
    username: "mrdevx",
    name: "Mahdi Rashidi",
    mediumUrl: "https://mrdevx.medium.com",
  },
];

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

async function fetchWithTimeout(url: string, options: RequestInit, timeoutMs: number = 10000): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<Response> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetchWithTimeout(url, options);

      if (response.ok) {
        return response;
      }

      if (response.status >= 400 && response.status < 500) {
        throw new Error(`Client error: ${response.status} ${response.statusText}`);
      }

      if (attempt === maxRetries) {
        throw new Error(`Server error after ${maxRetries + 1} attempts: ${response.status} ${response.statusText}`);
      }

      const delay = baseDelay * 2 ** attempt;
      await new Promise((resolve) => setTimeout(resolve, delay));
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt === maxRetries) {
        break;
      }

      if (lastError.name === "AbortError") {
        break;
      }

      const delay = baseDelay * 2 ** attempt;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError ?? new Error("Unknown error occurred during fetch");
}

export async function fetchMediumPosts(author: IBlogAuthor): Promise<IBlogPost[]> {
  try {
    const feedUrl = `${author.mediumUrl}/feed`;

    logger.info({
      operation: "fetchMediumPosts",
      author: author.username,
      message: "Attempting to fetch Medium posts",
      url: feedUrl,
    });

    const response = await fetchWithRetry(feedUrl, {
      headers: {
        "User-Agent": API_CONFIG.MEDIUM.USER_AGENT,
        Accept: API_CONFIG.MEDIUM.ACCEPT_HEADER,
      },
      next: { revalidate: API_CONFIG.CACHE.BLOG_REVALIDATE },
    });

    const xmlData = await response.text();

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

    logger.info({
      operation: "fetchMediumPosts",
      author: author.username,
      message: "Successfully fetched Medium posts",
      postCount: posts.length,
    });

    return posts;
  } catch (error) {
    logger.error({
      operation: "fetchMediumPosts",
      author: author.username,
      error: error instanceof Error ? error.message : String(error),
      errorName: error instanceof Error ? error.name : undefined,
      stack: error instanceof Error ? error.stack : undefined,
    });

    return [];
  }
}

async function fetchAllPosts(): Promise<IBlogPost[]> {
  const allPosts: IBlogPost[] = [];
  let hasErrors = false;

  for (const author of authors) {
    try {
      const posts = await fetchMediumPosts(author);
      allPosts.push(...posts);
    } catch (error) {
      hasErrors = true;
      logger.error({
        operation: "fetchAllPosts",
        author: author.username,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  if (hasErrors && allPosts.length === 0) {
    logger.warn({
      operation: "fetchAllPosts",
      message: "No posts could be fetched from any author",
    });
  }

  return allPosts.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
}

export async function getAllPosts(page: number, limit: number) {
  try {
    logger.info({
      operation: "getAllPosts",
      message: "Starting to fetch blog posts",
      page,
      limit,
    });

    const posts = await fetchAllPosts();
    const startIndex = (page - 1) * limit;
    const paginatedPosts = posts.slice(startIndex, startIndex + limit);

    logger.info({
      operation: "getAllPosts",
      message: "Successfully fetched blog posts",
      totalPosts: posts.length,
      paginatedPosts: paginatedPosts.length,
      page,
      limit,
    });

    return { posts: paginatedPosts, total: posts.length, fromCache: false };
  } catch (error) {
    logger.error({
      operation: "getAllPosts",
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    return { posts: [], total: 0, fromCache: false };
  }
}

export const blogService = {
  getBlogPosts: async (page: number = 1, limit: number = 10) => {
    const result = await getAllPosts(page, limit);
    return {
      posts: result.posts,
      total: result.total,
    };
  },
};
