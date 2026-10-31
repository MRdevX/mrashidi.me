import { ContentNotFoundError } from "#shared/content-not-found-error.ts";
import { describeCatalog } from "../domain/catalog.ts";
import { toProjectEntry } from "../domain/project-entry.ts";
import type { ProjectRepository, RepoActivityReader } from "./ports.ts";

export function createProjectQueries(repository: ProjectRepository, activity: RepoActivityReader) {
  return {
    async list() {
      const [projects, commits] = await Promise.all([repository.list(), activity.latestCommits()]);
      return projects.map((project) => toProjectEntry(project, commits));
    },
    overview: async () => describeCatalog(await repository.list()),
    async bySlug(slug: string) {
      const [project, commits] = await Promise.all([repository.getBySlug(slug), activity.latestCommits()]);
      if (!project) {
        throw new ContentNotFoundError(`Project "${slug}"`);
      }
      return toProjectEntry(project, commits);
    },
  };
}

export type ProjectQueries = ReturnType<typeof createProjectQueries>;
