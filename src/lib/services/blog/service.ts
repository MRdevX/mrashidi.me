import { XMLParser } from "fast-xml-parser";
import ky from "ky";
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

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  textNodeName: "#text",
  parseAttributeValue: true,
  parseTagValue: true,
  trimValues: true,
});

export async function parseMediumFeed(xmlData: string): Promise<IMediumRssFeed> {
  try {
    const result = xmlParser.parse(xmlData) as IMediumRssFeed;

    if (!result?.rss?.channel) {
      throw new Error("Invalid RSS feed structure");
    }

    return result;
  } catch (error) {
    throw new Error(`Failed to parse RSS feed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

const mediumFeedClient = ky.create({
  timeout: 15000,
  headers: {
    "User-Agent": API_CONFIG.MEDIUM.USER_AGENT,
    Accept: API_CONFIG.MEDIUM.ACCEPT_HEADER,
    "Cache-Control": "no-cache",
  },
  retry: {
    limit: 1,
    methods: ["get"],
  },
});

async function fetchMediumFeed(url: string): Promise<string> {
  try {
    logger.info({
      operation: "fetchMediumFeed",
      message: "Attempting to fetch Medium RSS feed",
      url,
    });

    const xmlData = await mediumFeedClient(url).text();

    logger.info({
      operation: "fetchMediumFeed",
      message: "Successfully fetched Medium RSS feed",
      url,
    });

    return xmlData;
  } catch (error) {
    logger.error({
      operation: "fetchMediumFeed",
      message: "Failed to fetch Medium RSS feed",
      url,
      error: error instanceof Error ? error.message : String(error),
    });

    throw new Error(`Failed to fetch Medium feed: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
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

    const xmlData = await fetchMediumFeed(feedUrl);
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
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;

    logger.error({
      operation: "getAllPosts",
      message: "Failed to fetch blog posts",
      error: errorMessage,
      stack: errorStack,
      page,
      limit,
    });

    throw new Error(`Failed to fetch blog posts: ${errorMessage}`);
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
