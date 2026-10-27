import { ContentNotFoundError } from "#shared/content-not-found-error.ts";
import type { GitHubSnapshotRepository } from "../domain/github-snapshot-repository.ts";

export function createGitHubQueries(repository: GitHubSnapshotRepository) {
  return {
    async contributions() {
      const contributions = await repository.getContributions();
      if (!contributions) {
        throw new ContentNotFoundError("GitHub contributions");
      }
      return contributions;
    },
    repoActivity: async () => (await repository.getRepoActivity()) ?? {},
  };
}

export type GitHubQueries = ReturnType<typeof createGitHubQueries>;
