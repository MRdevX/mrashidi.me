import type { BlogPost } from "@mrashidi/types";
import type { Timed } from "#shared/snapshot-read-through.ts";
import type { FeedItem } from "../domain/blog-post.ts";

export interface BlogSnapshotRepository {
  getPosts(): Promise<Timed<BlogPost[]> | null>;
  savePosts(posts: readonly BlogPost[], fetchedAt: Date): Promise<void>;
}

export interface FeedGateway {
  items(feedUrl: string): Promise<FeedItem[]>;
}
