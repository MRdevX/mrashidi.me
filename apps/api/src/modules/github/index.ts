import type { Bindings } from "#bindings";
import { createDb } from "#db/index.ts";
import { createProfileContext } from "#modules/profile/index.ts";
import type { Background } from "#shared/snapshot-read-through.ts";
import { createGitHubQueries } from "./application/github-queries.ts";
import { createRefreshContributions, createRefreshRepoActivity } from "./application/refresh-github.ts";
import { createD1GitHubSnapshotRepository } from "./infrastructure/d1-github-snapshot-repository.ts";
import { createGraphQLGitHubGateway } from "./infrastructure/graphql-github-gateway.ts";

export type { RepoCommit } from "./domain/repo-activity.ts";
export { githubRoutes } from "./http/github-routes.ts";

export function createGitHubContext(env: Bindings, background: Background, repoUrls: () => Promise<readonly string[]>) {
  const repository = createD1GitHubSnapshotRepository(createDb(env.DB));
  const gateway = createGraphQLGitHubGateway(env.GH_API_TOKEN);
  const refreshContributions = createRefreshContributions(gateway, repository);
  const refreshRepoActivity = createRefreshRepoActivity(gateway, repository);
  return createGitHubQueries(
    repository,
    {
      contributions: async (now) =>
        refreshContributions({ profileUrl: (await createProfileContext(env.DB).profile()).social.github, now }),
      repoActivity: async (now) => refreshRepoActivity({ repoUrls: await repoUrls(), now }),
    },
    background
  );
}
