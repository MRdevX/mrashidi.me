import type { Contributions } from "@mrashidi/types";
import { contributionWindow } from "../domain/contribution-window.ts";
import type { RepoActivity } from "../domain/repo-activity.ts";
import { parseGitHubLogin, parseRepoRef, type RepoRef } from "../domain/repo-ref.ts";
import type { GitHubGateway, GitHubSnapshotRepository } from "./ports.ts";

export interface RefreshContributionsInput {
  profileUrl: string;
  now: Date;
}

export interface RefreshRepoActivityInput {
  repoUrls: readonly string[];
  now: Date;
}

export function createRefreshContributions(gateway: GitHubGateway, repository: GitHubSnapshotRepository) {
  return async ({ profileUrl, now }: RefreshContributionsInput): Promise<Contributions> => {
    const login = parseGitHubLogin(profileUrl);
    if (!login) {
      throw new Error(`Not a GitHub profile URL: ${profileUrl}`);
    }
    const contributions = await gateway.contributions(login, contributionWindow(now));
    await repository.saveContributions(contributions, now);
    return contributions;
  };
}

export function createRefreshRepoActivity(gateway: GitHubGateway, repository: GitHubSnapshotRepository) {
  return async ({ repoUrls, now }: RefreshRepoActivityInput): Promise<RepoActivity> => {
    const repos = [...new Set(repoUrls)].map(parseRepoRef).filter((ref): ref is RepoRef => ref !== null);
    const activity = await gateway.latestCommits(repos);
    await repository.saveRepoActivity(activity, now);
    return activity;
  };
}
