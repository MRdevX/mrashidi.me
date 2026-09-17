import type { ProjectTypeFilter } from "../../domain/filters";
import type { ProjectSort } from "../../domain/sort";

export const TYPE_LABELS: Record<ProjectTypeFilter, string> = {
  all: "All",
  personal: "Personal",
  client: "Client",
};

export const SORT_LABELS: Record<ProjectSort, string> = {
  recent: "Recently updated",
  oldest: "Oldest first",
  az: "Name A–Z",
};

export const pluralizeProjects = (count: number) => (count === 1 ? "project" : "projects");
