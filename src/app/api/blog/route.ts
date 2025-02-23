import { NextResponse } from "next/server";
import { parseString } from "xml2js";
import { IBlogPost, IBlogAuthor, IMediumRssFeed } from "@/types/blog";

const authors: IBlogAuthor[] = [
  {
    username: "mrdevx",
    name: "Mahdi Rashidi",
    mediumUrl: "https://mrdevx.medium.com",
  },
];

async function parseMediumFeed(xmlData: string): Promise<IMediumRssFeed> {
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

function cleanHtmlContent(html: string): string {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/\n\s*\n/g, "\n")
    .trim();
}

function extractImageUrl(html: string): string | undefined {
  if (!html) return undefined;
  const imgMatch = html.match(/<img[^>]+src="([^">]+)"/);
  return imgMatch ? imgMatch[1] : undefined;
}

async function fetchMediumPosts(author: IBlogAuthor): Promise<IBlogPost[]> {
  try {
    const feedUrl = `${author.mediumUrl}/feed`;
    const response = await fetch(feedUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; BlogFetcher/1.0)",
        Accept: "application/xml",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch feed: ${response.status}`);
    }

    const xmlData = await response.text();
    const feed = await parseMediumFeed(xmlData);

    if (!feed?.rss?.channel?.item) {
      console.warn(`No items found in feed for author ${author.username}`);
      return [];
    }

    const items = Array.isArray(feed.rss.channel.item) ? feed.rss.channel.item : [feed.rss.channel.item];

    return items.map((item) => ({
      title: item.title || "Untitled",
      content: cleanHtmlContent(item["content:encoded"] || ""),
      url: item.link,
      publishedAt: new Date(item.pubDate),
      imageUrl: extractImageUrl(item["content:encoded"] || ""),
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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    const allPosts: IBlogPost[] = [];
    for (const author of authors) {
      const posts = await fetchMediumPosts(author);
      allPosts.push(...posts);
    }

    // Sort posts by date
    const sortedPosts = allPosts.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());

    // Calculate pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPosts = sortedPosts.slice(startIndex, endIndex);

    return NextResponse.json({
      posts: paginatedPosts,
      total: sortedPosts.length,
    });
  } catch (error) {
    console.error("Failed to fetch blog posts:", error);
    return NextResponse.json({ error: "Failed to fetch blog posts" }, { status: 500 });
  }
}
