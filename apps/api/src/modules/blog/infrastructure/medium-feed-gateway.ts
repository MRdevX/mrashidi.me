import { XMLParser } from "fast-xml-parser";
import type { FeedItem } from "../domain/blog-post.ts";
import type { FeedGateway } from "../domain/feed-gateway.ts";

const USER_AGENT = "Mozilla/5.0 (compatible; mrashidi-api/1.0)";
const BLOCK_ELEMENTS = "p, h1, h2, h3, h4, h5, h6, li, blockquote, figcaption, pre, br";
const ENTITIES: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };

interface RssItem {
  title?: string;
  link?: string;
  pubDate?: string;
  description?: string;
  "content:encoded"?: string;
}

const xml = new XMLParser({ isArray: (name) => name === "item", parseTagValue: false, trimValues: true });

function decodeEntities(text: string): string {
  return text.replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (match, entity: string) => {
    if (entity.startsWith("#x") || entity.startsWith("#X")) {
      return String.fromCodePoint(Number.parseInt(entity.slice(2), 16));
    }
    if (entity.startsWith("#")) {
      return String.fromCodePoint(Number(entity.slice(1)));
    }
    return ENTITIES[entity.toLowerCase()] ?? match;
  });
}

export async function readHtml(html: string): Promise<{ text: string; imageUrl?: string }> {
  let text = "";
  let imageUrl: string | undefined;
  const rewriter = new HTMLRewriter()
    .on("img", {
      element(img) {
        const src = img.getAttribute("src")?.trim();
        if (!imageUrl && src && /^https?:\/\//.test(src)) {
          imageUrl = src;
        }
      },
    })
    .on(BLOCK_ELEMENTS, {
      element() {
        text += " ";
      },
    })
    .onDocument({
      text(chunk) {
        text += chunk.text;
      },
    });
  await rewriter.transform(new Response(html)).text();
  return { text: decodeEntities(text).replace(/\s+/g, " ").trim(), imageUrl };
}

export function createMediumFeedGateway(fetcher: typeof fetch = fetch): FeedGateway {
  return {
    async items(feedUrl) {
      const res = await fetcher(feedUrl, {
        headers: { "User-Agent": USER_AGENT, Accept: "application/rss+xml, application/xml" },
      });
      if (!res.ok) {
        throw new Error(`Medium feed answered ${res.status}`);
      }
      const feed = xml.parse(await res.text()) as { rss?: { channel?: { item?: RssItem[] } } };
      if (!feed.rss?.channel) {
        throw new Error("Medium feed has no RSS channel");
      }
      const items = feed.rss.channel.item ?? [];
      return Promise.all(
        items
          .filter((item) => item.title && item.link && item.pubDate)
          .map(async (item): Promise<FeedItem> => {
            const { text, imageUrl } = await readHtml(item["content:encoded"] ?? item.description ?? "");
            return {
              title: decodeEntities(String(item.title)),
              url: String(item.link),
              publishedAt: new Date(String(item.pubDate)).toISOString(),
              imageUrl,
              text,
            };
          })
      );
    },
  };
}
