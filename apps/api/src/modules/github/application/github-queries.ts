import type { Contributions } from "@mrashidi/types";
import { type Background, readThrough } from "#shared/snapshot-read-through.ts";
import type { RepoActivity } from "../domain/repo-activity.ts";
import type { GitHubSnapshotRepository } from "./ports.ts";

export interface GitHubRefresh {
  contributions(now: Date): Promise<Contributions>;
  repoActivity(now: Date): Promise<RepoActivity>;
}

export function createGitHubQueries(
  repository: GitHubSnapshotRepository,
  refresh: GitHubRefresh,
  background: Background,
  clock: () => Date = () => new Date()
) {
  return {
    contributions: () =>
      readThrough({
        read: repository.getContributions,
        refresh: refresh.contributions,
        now: clock(),
        background,
      }),
    async repoActivity(): Promise<RepoActivity> {
      try {
        return await readThrough({
          read: repository.getRepoActivity,
          refresh: refresh.repoActivity,
          now: clock(),
          background,
        });
      } catch (error) {
        console.error(error);
        return {};
      }
    },
  };
}

export type GitHubQueries = ReturnType<typeof createGitHubQueries>;
