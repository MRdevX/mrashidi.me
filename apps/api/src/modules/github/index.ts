import type { Background } from "#shared/snapshot-read-through.ts";
import { createGitHubQueries } from "./application/github-queries.ts";
import type { GitHubGateway, GitHubSnapshotRepository } from "./application/ports.ts";
import { createRefreshContributions, createRefreshRepoActivity } from "./application/refresh-github.ts";

export type { RepoCommit } from "./domain/repo-activity.ts";
export { githubRoutes } from "./http/github-routes.ts";
export { createD1GitHubSnapshotRepository } from "./infrastructure/d1-github-snapshot-repository.ts";
export { createGraphQLGitHubGateway } from "./infrastructure/graphql-github-gateway.ts";

export interface GitHubDependencies {
  repository: GitHubSnapshotRepository;
  gateway: GitHubGateway;
  profileUrl: () => Promise<string>;
  repoUrls: () => Promise<readonly string[]>;
  background: Background;
}

export function createGitHubContext({ repository, gateway, profileUrl, repoUrls, background }: GitHubDependencies) {
  const refreshContributions = createRefreshContributions(gateway, repository);
  const refreshRepoActivity = createRefreshRepoActivity(gateway, repository);
  return createGitHubQueries(
    repository,
    {
      contributions: async (now) => refreshContributions({ profileUrl: await profileUrl(), now }),
      repoActivity: async (now) => refreshRepoActivity({ repoUrls: await repoUrls(), now }),
    },
    background
  );
}
