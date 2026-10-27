import { ContributionsSchema } from "@mrashidi/types";
import type { Db } from "#db/index.ts";
import { readSnapshot, writeSnapshot } from "#db/snapshots.ts";
import type { GitHubSnapshotRepository } from "../domain/github-snapshot-repository.ts";
import { RepoActivitySchema } from "../domain/repo-activity.ts";

export function createD1GitHubSnapshotRepository(db: Db): GitHubSnapshotRepository {
  return {
    getContributions: () => readSnapshot(db, "github.contributions", ContributionsSchema),
    saveContributions: (contributions, fetchedAt) =>
      writeSnapshot(db, "github.contributions", contributions, fetchedAt),
    getRepoActivity: () => readSnapshot(db, "github.repo-activity", RepoActivitySchema),
    saveRepoActivity: (activity, fetchedAt) => writeSnapshot(db, "github.repo-activity", activity, fetchedAt),
  };
}
