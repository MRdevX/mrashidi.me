import type { BlogPost, BlogPostPage } from "@mrashidi/types";

export const EXCERPT_LENGTH = 280;

export interface FeedItem {
  title: string;
  url: string;
  publishedAt: string;
  imageUrl?: string;
  text: string;
}

export function toExcerpt(text: string): string {
  const flat = text.replace(/\s+/g, " ").trim();
  if (flat.length <= EXCERPT_LENGTH) {
    return flat;
  }
  const cut = flat.slice(0, EXCERPT_LENGTH);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > 0 ? cut.slice(0, lastSpace) : cut).replace(/[\s.,;:!?-]+$/, "")}…`;
}

export function toBlogPosts(items: readonly FeedItem[]): BlogPost[] {
  return items
    .map(({ text, imageUrl, ...item }) => ({ ...item, ...(imageUrl ? { imageUrl } : {}), excerpt: toExcerpt(text) }))
    .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
}

export function pageOf(posts: readonly BlogPost[], page: number, limit: number): BlogPostPage {
  const start = (page - 1) * limit;
  return { posts: posts.slice(start, start + limit), total: posts.length };
}

export function mediumFeedUrl(profileUrl: string): string | null {
  try {
    const url = new URL(profileUrl);
    if (url.hostname === "medium.com") {
      const handle = url.pathname.split("/").find((segment) => segment.startsWith("@"));
      return handle ? `https://medium.com/feed/${handle}` : null;
    }
    return url.hostname.endsWith(".medium.com") ? `${url.origin}/feed` : null;
  } catch {
    return null;
  }
}

export const SNAPSHOT_MAX_AGE_MS = 6 * 60 * 60 * 1000;

export function isStale(fetchedAt: Date, now: Date): boolean {
  return now.getTime() - fetchedAt.getTime() >= SNAPSHOT_MAX_AGE_MS;
}
