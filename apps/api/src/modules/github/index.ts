import { createDb } from "#db/index.ts";
import { createGitHubQueries } from "./application/github-queries.ts";
import { createRefreshGitHub } from "./application/refresh-github.ts";
import { createD1GitHubSnapshotRepository } from "./infrastructure/d1-github-snapshot-repository.ts";
import { createGraphQLGitHubGateway } from "./infrastructure/graphql-github-gateway.ts";

export type { GitHubQueries } from "./application/github-queries.ts";
export type { RefreshGitHub, RefreshGitHubInput } from "./application/refresh-github.ts";
export type { RepoActivity, RepoCommit } from "./domain/repo-activity.ts";
export { githubRoutes } from "./http/github-routes.ts";

export function createGitHubContext(db: D1Database) {
  return createGitHubQueries(createD1GitHubSnapshotRepository(createDb(db)));
}

export function createGitHubRefresh(db: D1Database, token: string) {
  return createRefreshGitHub(createGraphQLGitHubGateway(token), createD1GitHubSnapshotRepository(createDb(db)));
}
