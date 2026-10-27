import { contributionWindow } from "../domain/contribution-window.ts";
import type { GitHubGateway } from "../domain/github-gateway.ts";
import type { GitHubSnapshotRepository } from "../domain/github-snapshot-repository.ts";
import { parseGitHubLogin, parseRepoRef, type RepoRef } from "../domain/repo-ref.ts";

export interface RefreshGitHubInput {
  profileUrl: string;
  repoUrls: readonly string[];
  now: Date;
}

export function createRefreshGitHub(gateway: GitHubGateway, repository: GitHubSnapshotRepository) {
  async function refreshContributions(profileUrl: string, now: Date) {
    const login = parseGitHubLogin(profileUrl);
    if (!login) {
      throw new Error(`Not a GitHub profile URL: ${profileUrl}`);
    }
    await repository.saveContributions(await gateway.contributions(login, contributionWindow(now)), now);
  }

  async function refreshRepoActivity(repoUrls: readonly string[], now: Date) {
    const repos = [...new Set(repoUrls)].map(parseRepoRef).filter((ref): ref is RepoRef => ref !== null);
    await repository.saveRepoActivity(await gateway.latestCommits(repos), now);
  }

  return async ({ profileUrl, repoUrls, now }: RefreshGitHubInput): Promise<void> => {
    const results = await Promise.allSettled([
      refreshContributions(profileUrl, now),
      refreshRepoActivity(repoUrls, now),
    ]);
    const failures = results.flatMap((result) => (result.status === "rejected" ? [result.reason] : []));
    if (failures.length > 0) {
      throw new AggregateError(failures, "GitHub refresh failed");
    }
  };
}

export type RefreshGitHub = ReturnType<typeof createRefreshGitHub>;
