import { BlogPostSchema } from "@mrashidi/types";
import { z } from "zod";
import type { Db } from "#db/index.ts";
import { readTimedSnapshot, writeSnapshot } from "#db/snapshots.ts";
import type { BlogSnapshotRepository } from "../domain/blog-snapshot-repository.ts";

export function createD1BlogSnapshotRepository(db: Db): BlogSnapshotRepository {
  return {
    async getSnapshot() {
      const snapshot = await readTimedSnapshot(db, "blog.posts", z.array(BlogPostSchema));
      return snapshot && { posts: snapshot.data, fetchedAt: snapshot.fetchedAt };
    },
    savePosts: (posts, fetchedAt) => writeSnapshot(db, "blog.posts", posts, fetchedAt),
  };
}
