import { ContentNotFoundError } from "#shared/content-not-found-error.ts";
import { pageOf } from "../domain/blog-post.ts";
import type { BlogSnapshotRepository } from "../domain/blog-snapshot-repository.ts";

export function createBlogQueries(repository: BlogSnapshotRepository) {
  return {
    async page(page: number, limit: number) {
      const posts = await repository.getPosts();
      if (!posts) {
        throw new ContentNotFoundError("Blog posts");
      }
      return pageOf(posts, page, limit);
    },
  };
}

export type BlogQueries = ReturnType<typeof createBlogQueries>;
