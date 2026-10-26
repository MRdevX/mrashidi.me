import type { Project } from "@mrashidi/types";

export interface ProjectRepository {
  list(): Promise<Project[]>;
  getBySlug(slug: string): Promise<Project | null>;
}
