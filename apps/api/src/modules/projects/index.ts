import type { Bindings } from "#bindings";
import { createDb } from "#db/index.ts";
import { createGitHubContext } from "#modules/github/index.ts";
import type { Background } from "#shared/snapshot-read-through.ts";
import type { ProjectRepository } from "./application/ports.ts";
import { createProjectQueries } from "./application/project-queries.ts";
import { createD1ProjectRepository } from "./infrastructure/d1-project-repository.ts";

export type { ProjectQueries } from "./application/project-queries.ts";
export { projectRoutes } from "./http/project-routes.ts";

const repoUrlsOf = (repository: ProjectRepository) => async () =>
  (await repository.list()).flatMap((project) => (project.githubUrl ? [project.githubUrl] : []));

export function createProjectRepoUrls(db: D1Database) {
  return repoUrlsOf(createD1ProjectRepository(createDb(db)));
}

export function createProjectContext(env: Bindings, background: Background) {
  const repository = createD1ProjectRepository(createDb(env.DB));
  const github = createGitHubContext(env, background, repoUrlsOf(repository));
  return createProjectQueries(repository, { latestCommits: github.repoActivity });
}
