import { type LatestCommit, type Project, type ProjectEntry, projectSlug } from "@mrashidi/types";
import type { RepoCommit } from "./repo-activity-reader.ts";

export function commitUrl(repoUrl: string, hash: string): string {
  return `${repoUrl.replace(/\/+$/, "")}/commit/${hash}`;
}

function latestCommitOf(project: Project, commits: Readonly<Record<string, RepoCommit>>): LatestCommit | null {
  const commit = project.githubUrl ? commits[project.githubUrl] : undefined;
  return project.githubUrl && commit ? { ...commit, url: commitUrl(project.githubUrl, commit.hash) } : null;
}

export function toProjectEntry(project: Project, commits: Readonly<Record<string, RepoCommit>> = {}): ProjectEntry {
  const years = project.year?.match(/\d{4}/g)?.map(Number) ?? [];
  const endYear = years.length > 0 ? Math.max(...years) : null;
  const latestCommit = latestCommitOf(project, commits);
  return {
    ...project,
    slug: projectSlug(project),
    startYear: years.length > 0 ? Math.min(...years) : null,
    endYear,
    latestCommit,
    lastActivityAt: latestCommit?.committedAt ?? (endYear ? new Date(Date.UTC(endYear, 11, 31)).toISOString() : null),
  };
}
