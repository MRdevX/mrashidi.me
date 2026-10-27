import type { Contributions } from "@mrashidi/types";
import type { Timed } from "#shared/snapshot-read-through.ts";
import type { RepoActivity } from "./repo-activity.ts";

export interface GitHubSnapshotRepository {
  getContributions(): Promise<Timed<Contributions> | null>;
  saveContributions(contributions: Contributions, fetchedAt: Date): Promise<void>;
  getRepoActivity(): Promise<Timed<RepoActivity> | null>;
  saveRepoActivity(activity: RepoActivity, fetchedAt: Date): Promise<void>;
}
