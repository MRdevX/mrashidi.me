import type { ContentRepository, SectionKey } from "../domain/content-repository.ts";

export class ContentNotFoundError extends Error {
  constructor(what: string) {
    super(`${what} not found`);
    this.name = "ContentNotFoundError";
  }
}

export function createContentQueries(repository: ContentRepository) {
  return {
    async section<K extends SectionKey>(key: K) {
      const section = await repository.getSection(key);
      if (!section) {
        throw new ContentNotFoundError(`Section "${key}"`);
      }
      return section;
    },
    listProjects: () => repository.listProjects(),
    async project(slug: string) {
      const project = await repository.getProject(slug);
      if (!project) {
        throw new ContentNotFoundError(`Project "${slug}"`);
      }
      return project;
    },
    listExperience: () => repository.listExperience(),
  };
}

export type ContentQueries = ReturnType<typeof createContentQueries>;
