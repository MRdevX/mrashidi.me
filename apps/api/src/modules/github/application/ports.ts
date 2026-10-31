import type { Contributions } from "@mrashidi/types";
import type { Timed } from "#shared/snapshot-read-through.ts";
import type { ContributionWindow } from "../domain/contribution-window.ts";
import type { RepoActivity } from "../domain/repo-activity.ts";
import type { RepoRef } from "../domain/repo-ref.ts";

export interface GitHubGateway {
  latestCommits(repos: readonly RepoRef[]): Promise<RepoActivity>;
  contributions(login: string, window: ContributionWindow): Promise<Contributions>;
}

export interface GitHubSnapshotRepository {
  getContributions(): Promise<Timed<Contributions> | null>;
  saveContributions(contributions: Contributions, fetchedAt: Date): Promise<void>;
  getRepoActivity(): Promise<Timed<RepoActivity> | null>;
  saveRepoActivity(activity: RepoActivity, fetchedAt: Date): Promise<void>;
}
