import { isStale, pageOf } from "../domain/blog-post.ts";
import type { BlogSnapshot, BlogSnapshotRepository } from "../domain/blog-snapshot-repository.ts";

export function createBlogQueries(
  repository: BlogSnapshotRepository,
  refresh: (now: Date) => Promise<void>,
  clock: () => Date = () => new Date()
) {
  async function freshSnapshot(): Promise<BlogSnapshot> {
    const now = clock();
    const snapshot = await repository.getSnapshot();
    if (snapshot && !isStale(snapshot.fetchedAt, now)) {
      return snapshot;
    }
    try {
      await refresh(now);
    } catch (error) {
      if (!snapshot) {
        throw error;
      }
      console.error(error);
      return snapshot;
    }
    return (await repository.getSnapshot()) ?? { posts: [], fetchedAt: now };
  }

  return {
    async page(page: number, limit: number) {
      return pageOf((await freshSnapshot()).posts, page, limit);
    },
  };
}

export type BlogQueries = ReturnType<typeof createBlogQueries>;
