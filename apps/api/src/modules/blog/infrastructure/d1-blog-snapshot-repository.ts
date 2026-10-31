import { BlogPostSchema } from "@mrashidi/types";
import { z } from "zod";
import type { Db } from "#db/index.ts";
import { readSnapshot, writeSnapshot } from "#db/snapshots.ts";
import type { BlogSnapshotRepository } from "../application/ports.ts";

export function createD1BlogSnapshotRepository(db: Db): BlogSnapshotRepository {
  return {
    getPosts: () => readSnapshot(db, "blog.posts", z.array(BlogPostSchema)),
    savePosts: (posts, fetchedAt) => writeSnapshot(db, "blog.posts", posts, fetchedAt),
  };
}
