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

export async function fetchMediumPosts(author: IBlogAuthor): Promise<IBlogPost[]> {
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
      throw new Error(`Failed to fetch feed: ${response.status} ${response.statusText}`);
    }

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

export async function getAllPosts(page: number, limit: number) {
  try {
    const posts = await fetchAllPosts();
    const startIndex = (page - 1) * limit;
    const paginatedPosts = posts.slice(startIndex, startIndex + limit);

    return { posts: paginatedPosts, total: posts.length, fromCache: false };
  } catch (error) {
    logger.error({
      operation: "getAllPosts",
      error: error instanceof Error ? error.message : String(error),
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
