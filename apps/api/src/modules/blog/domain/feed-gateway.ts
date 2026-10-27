import type { FeedItem } from "./blog-post.ts";

export interface FeedGateway {
  items(feedUrl: string): Promise<FeedItem[]>;
}
