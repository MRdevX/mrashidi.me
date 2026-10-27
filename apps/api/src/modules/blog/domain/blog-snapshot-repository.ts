import type { BlogPost } from "@mrashidi/types";

export interface BlogSnapshot {
  posts: BlogPost[];
  fetchedAt: Date;
}

export interface BlogSnapshotRepository {
  getSnapshot(): Promise<BlogSnapshot | null>;
  savePosts(posts: readonly BlogPost[], fetchedAt: Date): Promise<void>;
}
