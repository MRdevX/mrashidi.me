import { ContentNotFoundError } from "#shared/content-not-found-error.ts";
import type { ProjectRepository } from "../domain/project-repository.ts";

export function createProjectQueries(repository: ProjectRepository) {
  return {
    list: () => repository.list(),
    async bySlug(slug: string) {
      const project = await repository.getBySlug(slug);
      if (!project) {
        throw new ContentNotFoundError(`Project "${slug}"`);
      }
      return project;
    },
  };
}

export type ProjectQueries = ReturnType<typeof createProjectQueries>;
