import type { Project } from "./project";

export type ProjectSort = "recent" | "oldest" | "az";

export const PROJECT_SORTS: readonly ProjectSort[] = ["recent", "oldest", "az"];

const lastActivity = (project: Project) => (project.lastActivityAt ? Date.parse(project.lastActivityAt) : 0);

const byTitle = (a: Project, b: Project) => a.title.localeCompare(b.title);

export const sortProjects = (projects: Project[], sort: ProjectSort): Project[] => {
  switch (sort) {
    case "az":
      return projects.sort(byTitle);
    case "oldest":
      return projects.sort((a, b) => (a.startYear ?? 0) - (b.startYear ?? 0) || byTitle(a, b));
    default:
      return projects.sort((a, b) => lastActivity(b) - lastActivity(a) || byTitle(a, b));
  }
};
