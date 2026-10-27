import { eq } from "drizzle-orm";
import type { z } from "zod";
import type { Db } from "./index.ts";
import { snapshots } from "./schema.ts";

export type SnapshotKey = "blog.posts" | "github.contributions" | "github.repo-activity";

export async function readSnapshot<T>(db: Db, key: SnapshotKey, schema: z.ZodType<T>): Promise<T | null> {
  const row = await db.query.snapshots.findFirst({ where: eq(snapshots.key, key) });
  return row ? schema.parse(row.data) : null;
}

export async function writeSnapshot(db: Db, key: SnapshotKey, data: unknown, fetchedAt: Date): Promise<void> {
  await db
    .insert(snapshots)
    .values({ key, data, fetchedAt })
    .onConflictDoUpdate({ target: snapshots.key, set: { data, fetchedAt } });
}
