import type { Contributions } from "@mrashidi/types";
import type { RepoActivity } from "./repo-activity.ts";

export interface GitHubSnapshotRepository {
  getContributions(): Promise<Contributions | null>;
  saveContributions(contributions: Contributions, fetchedAt: Date): Promise<void>;
  getRepoActivity(): Promise<RepoActivity | null>;
  saveRepoActivity(activity: RepoActivity, fetchedAt: Date): Promise<void>;
}
