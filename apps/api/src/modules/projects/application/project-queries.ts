import { ContentNotFoundError } from "#shared/content-not-found-error.ts";
import { describeCatalog } from "../domain/catalog.ts";
import { toProjectEntry } from "../domain/project-entry.ts";
import type { ProjectRepository } from "../domain/project-repository.ts";

export function createProjectQueries(repository: ProjectRepository) {
  return {
    list: async () => (await repository.list()).map(toProjectEntry),
    overview: async () => describeCatalog(await repository.list()),
    async bySlug(slug: string) {
      const project = await repository.getBySlug(slug);
      if (!project) {
        throw new ContentNotFoundError(`Project "${slug}"`);
      }
      return toProjectEntry(project);
    },
  };
}

export type ProjectQueries = ReturnType<typeof createProjectQueries>;
