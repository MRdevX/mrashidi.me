import type { BlogPost } from "@mrashidi/types";
import type { Timed } from "#shared/snapshot-read-through.ts";

export interface BlogSnapshotRepository {
  getPosts(): Promise<Timed<BlogPost[]> | null>;
  savePosts(posts: readonly BlogPost[], fetchedAt: Date): Promise<void>;
}
