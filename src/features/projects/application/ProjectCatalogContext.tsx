"use client";

import { createContext, type ReactNode, useContext, useEffect, useMemo, useReducer, useState } from "react";
import { type CatalogQueryResult, describeCatalog, queryCatalog } from "../domain/catalog";
import {
  countActiveFilters,
  DEFAULT_FILTERS,
  type ProjectFilters,
  type ProjectTypeFilter,
  toggleStack,
} from "../domain/filters";
import type { Project } from "../domain/project";
import type { ProjectSort } from "../domain/sort";
import { type CommitInfoMap, loadCommitInfo } from "../infrastructure/commitInfoStore";
import { parseFilters, serializeFilters } from "../infrastructure/filtersQueryString";
import { projects } from "../infrastructure/projectData";

const PAGE_SIZE = 9;
const OVERVIEW = describeCatalog(projects);
const REPO_URLS = projects.flatMap((project) => (project.githubUrl ? [project.githubUrl] : []));

interface CatalogState {
  filters: ProjectFilters;
  visibleCount: number;
  hydrated: boolean;
}

type CatalogAction =
  | { type: "hydrate"; filters: ProjectFilters }
  | { type: "update"; patch: Partial<ProjectFilters> }
  | { type: "toggleStack"; tech: string }
  | { type: "clear" }
  | { type: "showMore" };

const reducer = (state: CatalogState, action: CatalogAction): CatalogState => {
  switch (action.type) {
    case "hydrate":
      return { ...state, filters: action.filters, hydrated: true };
    case "update":
      return {
        ...state,
        filters: { ...state.filters, ...action.patch },
        visibleCount: "sort" in action.patch ? state.visibleCount : PAGE_SIZE,
      };
    case "toggleStack":
      return {
        ...state,
        filters: { ...state.filters, stacks: toggleStack(state.filters.stacks, action.tech) },
        visibleCount: PAGE_SIZE,
      };
    case "clear":
      return { ...state, filters: { ...DEFAULT_FILTERS, sort: state.filters.sort }, visibleCount: PAGE_SIZE };
    case "showMore":
      return { ...state, visibleCount: state.visibleCount + PAGE_SIZE };
  }
};

interface ProjectCatalog extends CatalogQueryResult {
  overview: typeof OVERVIEW;
  filters: ProjectFilters;
  pageSize: number;
  visibleProjects: Project[];
  remainingCount: number;
  activeFilterCount: number;
  commitInfo: CommitInfoMap;
  setQuery: (query: string) => void;
  setType: (type: ProjectTypeFilter) => void;
  setOpenSourceOnly: (openSourceOnly: boolean) => void;
  setSort: (sort: ProjectSort) => void;
  toggleStack: (tech: string) => void;
  clearFilters: () => void;
  showMore: () => void;
}

const ProjectCatalogContext = createContext<ProjectCatalog | null>(null);

export function ProjectCatalogProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { filters: DEFAULT_FILTERS, visibleCount: PAGE_SIZE, hydrated: false });
  const [commitInfo, setCommitInfo] = useState<CommitInfoMap>(new Map());

  useEffect(() => {
    dispatch({ type: "hydrate", filters: parseFilters(window.location.search) });
    loadCommitInfo(REPO_URLS).then(setCommitInfo);
  }, []);

  useEffect(() => {
    const search = serializeFilters(state.filters);
    if (state.hydrated && search !== window.location.search) {
      window.history.replaceState(window.history.state, "", `${window.location.pathname}${search}`);
    }
  }, [state.filters, state.hydrated]);

  const actions = useMemo(() => {
    const update = (patch: Partial<ProjectFilters>) => dispatch({ type: "update", patch });
    return {
      setQuery: (query: string) => update({ query }),
      setType: (type: ProjectTypeFilter) => update({ type }),
      setOpenSourceOnly: (openSourceOnly: boolean) => update({ openSourceOnly }),
      setSort: (sort: ProjectSort) => update({ sort }),
      toggleStack: (tech: string) => dispatch({ type: "toggleStack", tech }),
      clearFilters: () => dispatch({ type: "clear" }),
      showMore: () => dispatch({ type: "showMore" }),
    };
  }, []);

  const query = useMemo(() => queryCatalog(projects, OVERVIEW, state.filters, commitInfo), [state.filters, commitInfo]);

  const catalog = useMemo<ProjectCatalog>(
    () => ({
      ...query,
      ...actions,
      overview: OVERVIEW,
      filters: state.filters,
      pageSize: PAGE_SIZE,
      visibleProjects: query.results.slice(0, state.visibleCount),
      remainingCount: Math.max(0, query.results.length - state.visibleCount),
      activeFilterCount: countActiveFilters(state.filters),
      commitInfo,
    }),
    [query, actions, state.filters, state.visibleCount, commitInfo]
  );

  return <ProjectCatalogContext.Provider value={catalog}>{children}</ProjectCatalogContext.Provider>;
}

export function useProjectCatalog() {
  const catalog = useContext(ProjectCatalogContext);
  if (!catalog) {
    throw new Error("useProjectCatalog must be used within ProjectCatalogProvider");
  }
  return catalog;
}
