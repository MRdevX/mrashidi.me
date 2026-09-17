import type { Project, ProjectType } from "./project";
import type { ProjectSort } from "./sort";

export type ProjectTypeFilter = "all" | ProjectType;

export interface ProjectFilters {
  query: string;
  type: ProjectTypeFilter;
  openSourceOnly: boolean;
  stacks: string[];
  sort: ProjectSort;
}

export const PROJECT_TYPE_FILTERS: readonly ProjectTypeFilter[] = ["all", "personal", "client"];

export const DEFAULT_FILTERS: ProjectFilters = {
  query: "",
  type: "all",
  openSourceOnly: false,
  stacks: [],
  sort: "recent",
};

const searchableText = (project: Project) =>
  [
    project.title,
    project.description,
    project.clientName,
    project.role,
    ...(project.highlights ?? []),
    ...project.stack,
  ]
    .filter(Boolean)
    .join("\n");

const createSearchTest = (query: string): ((text: string) => boolean) => {
  const trimmed = query.trim();
  if (!trimmed) {
    return () => true;
  }
  try {
    const pattern = new RegExp(trimmed, "i");
    return (text) => pattern.test(text);
  } catch {
    const needle = trimmed.toLowerCase();
    return (text) => text.toLowerCase().includes(needle);
  }
};

export const createProjectMatcher = (filters: ProjectFilters, { ignoreType = false } = {}) => {
  const matchesSearch = createSearchTest(filters.query);

  return (project: Project) =>
    (ignoreType || filters.type === "all" || project.type === filters.type) &&
    (!filters.openSourceOnly || Boolean(project.openSource)) &&
    filters.stacks.every((tech) => project.stack.includes(tech)) &&
    matchesSearch(searchableText(project));
};

export const toggleStack = (stacks: string[], tech: string) =>
  stacks.includes(tech) ? stacks.filter((item) => item !== tech) : [...stacks, tech];

export const countActiveFilters = (filters: ProjectFilters) =>
  filters.stacks.length + Number(filters.type !== "all") + Number(filters.openSourceOnly);

export const hasActiveFilters = (filters: ProjectFilters) =>
  countActiveFilters(filters) > 0 || filters.query.trim() !== "";
