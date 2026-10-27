import type { BlogPost } from "@mrashidi/types";

export interface BlogSnapshotRepository {
  getPosts(): Promise<BlogPost[] | null>;
  savePosts(posts: readonly BlogPost[], fetchedAt: Date): Promise<void>;
}
