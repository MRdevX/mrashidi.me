import type { BlogPost } from "@mrashidi/types";
import { type Background, readThrough } from "#shared/snapshot-read-through.ts";
import { pageOf } from "../domain/blog-post.ts";
import type { BlogSnapshotRepository } from "../domain/blog-snapshot-repository.ts";

export function createBlogQueries(
  repository: BlogSnapshotRepository,
  refresh: (now: Date) => Promise<BlogPost[]>,
  background: Background,
  clock: () => Date = () => new Date()
) {
  return {
    async page(page: number, limit: number) {
      const posts = await readThrough({ read: repository.getPosts, refresh, now: clock(), background });
      return pageOf(posts, page, limit);
    },
  };
}

export type BlogQueries = ReturnType<typeof createBlogQueries>;
