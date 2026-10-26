import type { Project } from "@mrashidi/types";

export type { Project, ProjectType } from "@mrashidi/types";

export const yearRange = (project: Project): [number, number] => {
  const years = project.year?.match(/\d{4}/g)?.map(Number) ?? [];
  return years.length > 0 ? [Math.min(...years), Math.max(...years)] : [0, 0];
};

export const projectSlug = (project: Pick<Project, "title">): string =>
  project.title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
