import { createProjectMatcher, type ProjectFilters, type ProjectTypeFilter } from "./filters";
import type { Project } from "./project";
import { type CommitDates, sortProjects } from "./sort";
import { countStackUsage, groupStacks, type StackFacet, type StackGroup, topStacks } from "./stack";

const TOP_STACK_LIMIT = 10;

export interface CatalogOverview {
  projectCount: number;
  openSourceCount: number;
  stackCount: number;
  topStacks: string[];
  stackGroups: StackGroup[];
}

export interface CatalogQueryResult {
  results: Project[];
  typeCounts: Record<ProjectTypeFilter, number>;
  topFacets: StackFacet[];
  groupFacets: StackGroup<StackFacet>[];
}

export const describeCatalog = (projects: readonly Project[]): CatalogOverview => {
  const usage = countStackUsage(projects);
  return {
    projectCount: projects.length,
    openSourceCount: projects.filter((project) => project.openSource).length,
    stackCount: usage.size,
    topStacks: topStacks(usage, TOP_STACK_LIMIT),
    stackGroups: groupStacks(usage),
  };
};

export const queryCatalog = (
  projects: readonly Project[],
  overview: CatalogOverview,
  filters: ProjectFilters,
  commitDates: CommitDates
): CatalogQueryResult => {
  const matchesIgnoringType = createProjectMatcher(filters, { ignoreType: true });
  const typeCounts: Record<ProjectTypeFilter, number> = { all: 0, personal: 0, client: 0 };
  const results: Project[] = [];

  for (const project of projects) {
    if (!matchesIgnoringType(project)) {
      continue;
    }
    typeCounts.all++;
    typeCounts[project.type]++;
    if (filters.type === "all" || project.type === filters.type) {
      results.push(project);
    }
  }

  const usage = countStackUsage(results);
  const toFacet = (tech: string): StackFacet => {
    const count = usage.get(tech) ?? 0;
    const selected = filters.stacks.includes(tech);
    return { tech, count, selected, disabled: !selected && count === 0 };
  };

  return {
    results: sortProjects(results, filters.sort, commitDates),
    typeCounts,
    topFacets: overview.topStacks.map(toFacet),
    groupFacets: overview.stackGroups.map((group) => ({ name: group.name, items: group.items.map(toFacet) })),
  };
};
