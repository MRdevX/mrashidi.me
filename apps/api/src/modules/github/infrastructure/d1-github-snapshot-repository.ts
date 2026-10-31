import { ContributionsSchema } from "@mrashidi/types";
import { z } from "zod";
import type { Db } from "#db/index.ts";
import { readSnapshot, writeSnapshot } from "#db/snapshots.ts";
import type { GitHubSnapshotRepository } from "../application/ports.ts";

const RepoActivitySchema = z.record(z.string(), z.object({ hash: z.string().min(1), committedAt: z.iso.datetime() }));

export function createD1GitHubSnapshotRepository(db: Db): GitHubSnapshotRepository {
  return {
    getContributions: () => readSnapshot(db, "github.contributions", ContributionsSchema),
    saveContributions: (contributions, fetchedAt) =>
      writeSnapshot(db, "github.contributions", contributions, fetchedAt),
    getRepoActivity: () => readSnapshot(db, "github.repo-activity", RepoActivitySchema),
    saveRepoActivity: (activity, fetchedAt) => writeSnapshot(db, "github.repo-activity", activity, fetchedAt),
  };
}
