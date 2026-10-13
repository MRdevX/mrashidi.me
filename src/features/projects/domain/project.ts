type ProjectVisibility = "public" | "private";
export type ProjectType = "personal" | "client";

export interface Project {
  title: string;
  description: string;
  highlights?: string[];
  stack: string[];
  githubUrl?: string;
  liveUrl?: string;
  visibility: ProjectVisibility;
  openSource?: boolean;
  year?: string;
  type: ProjectType;
  clientName?: string;
  role?: string;
}

export const yearRange = (project: Project): [number, number] => {
  const years = project.year?.match(/\d{4}/g)?.map(Number) ?? [];
  return years.length > 0 ? [Math.min(...years), Math.max(...years)] : [0, 0];
};

/** URL-safe identifier derived from the title, used by `/projects?project=<slug>` deep links. */
export const projectSlug = (project: Pick<Project, "title">): string =>
  project.title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
