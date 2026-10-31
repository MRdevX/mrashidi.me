import type { Project } from "@mrashidi/types";
import type { RepoCommit } from "#modules/github/index.ts";

export interface ProjectRepository {
  list(): Promise<Project[]>;
  getBySlug(slug: string): Promise<Project | null>;
}

export interface RepoActivityReader {
  latestCommits(): Promise<Readonly<Record<string, RepoCommit>>>;
}
