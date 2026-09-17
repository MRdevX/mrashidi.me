import { type Project, yearRange } from "./project";

export type ProjectSort = "recent" | "oldest" | "az";

export const PROJECT_SORTS: readonly ProjectSort[] = ["recent", "oldest", "az"];

export type CommitDates = ReadonlyMap<string, { date: Date }>;

const lastActivity = (project: Project, commitDates: CommitDates) => {
  const commit = project.githubUrl ? commitDates.get(project.githubUrl) : undefined;
  if (commit) {
    return commit.date.getTime();
  }
  const [, latest] = yearRange(project);
  return latest ? new Date(latest, 11, 31).getTime() : 0;
};

const byTitle = (a: Project, b: Project) => a.title.localeCompare(b.title);

export const sortProjects = (projects: Project[], sort: ProjectSort, commitDates: CommitDates): Project[] => {
  switch (sort) {
    case "az":
      return projects.sort(byTitle);
    case "oldest":
      return projects.sort((a, b) => yearRange(a)[0] - yearRange(b)[0] || byTitle(a, b));
    default:
      return projects.sort((a, b) => lastActivity(b, commitDates) - lastActivity(a, commitDates) || byTitle(a, b));
  }
};
