"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { projects } from "@/data";
import type { Project } from "@/data/projects";
import type { TechnologyCategory } from "@/lib/core";
import { logger } from "@/lib/core";
import { githubService } from "@/lib/services/github";
import { filterProjects, processTechnologyData } from "@/lib/tech";
import { useCache } from "./useCache";

interface CommitInfo {
  date: string;
  hash: string;
}

export interface ProjectFilters {
  searchQuery: string;
  selectedStacks: Set<string>;
  showOpenSourceOnly: boolean;
}

export interface UseProjectFiltersReturn {
  filters: ProjectFilters;
  setSearchQuery: (query: string) => void;
  toggleStack: (stack: string) => void;
  setShowOpenSourceOnly: (show: boolean) => void;
  clearAllFilters: () => void;
  allStacks: string[];
  stackUsageCount: Record<string, number>;
  categorizedStacks: Record<TechnologyCategory, string[]>;
  filteredProjects: typeof projects;
  paginatedProjects: typeof projects;
  currentPage: number;
  totalPages: number;
  setPage: (page: number) => void;
  isLoadingCommitDates: boolean;
  commitInfo: Map<string, { date: Date; hash: string }>;
}

export function useProjectFilters(itemsPerPage: number = 6): UseProjectFiltersReturn {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedStacks, setSelectedStacks] = useState<Set<string>>(new Set());
  const [showOpenSourceOnly, setShowOpenSourceOnly] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [commitInfo, setCommitInfo] = useState<Map<string, { date: Date; hash: string }>>(new Map());
  const [isLoadingCommitDates, setIsLoadingCommitDates] = useState<boolean>(false);

  const { categorizedStacks, stackUsageCount } = useMemo(() => {
    return processTechnologyData(projects);
  }, []);

  const allStacks = useMemo(() => {
    return Object.values(categorizedStacks).flat().sort();
  }, [categorizedStacks]);

  const { loadFromCache, saveToCache } = useCache<Record<string, CommitInfo>>("project_commit_dates_v2");

  const loadCachedCommitInfo = useCallback((): Map<string, { date: Date; hash: string }> => {
    const cached = loadFromCache();
    if (!cached) {
      return new Map();
    }

    const infoMap = new Map<string, { date: Date; hash: string }>();
    for (const [url, info] of Object.entries(cached)) {
      const date = new Date(info.date);
      if (Number.isNaN(date.getTime()) || !info.hash) {
        continue;
      }
      infoMap.set(url, { date, hash: info.hash });
    }
    return infoMap;
  }, [loadFromCache]);

  const saveCommitInfoToCache = useCallback(
    (info: Map<string, { date: Date; hash: string }>) => {
      const commitsRecord: Record<string, CommitInfo> = {};
      info.forEach((commitData, url) => {
        commitsRecord[url] = { date: commitData.date.toISOString(), hash: commitData.hash };
      });
      saveToCache(commitsRecord);
    },
    [saveToCache]
  );

  const fetchCommitDates = useCallback(async () => {
    setIsLoadingCommitDates(true);

    try {
      const projectsWithGithub = projects.filter((project): project is Project & { githubUrl: string } =>
        Boolean(project.githubUrl)
      );
      const requiredUrls = new Set(projectsWithGithub.map((p) => p.githubUrl));

      const cachedInfo = loadCachedCommitInfo();
      const merged = new Map<string, { date: Date; hash: string }>();
      for (const url of requiredUrls) {
        const hit = cachedInfo.get(url);
        if (hit) {
          merged.set(url, hit);
        }
      }
      setCommitInfo(new Map(merged));

      const toFetch = projectsWithGithub.filter((p) => !merged.has(p.githubUrl));
      if (toFetch.length === 0) {
        return;
      }

      const results = await Promise.allSettled(
        toFetch.map(async (project) => {
          const commitInfo = await githubService.getLatestCommitInfo(project.githubUrl);
          return { url: project.githubUrl, commitInfo };
        })
      );

      for (const result of results) {
        if (result.status === "fulfilled" && result.value?.commitInfo) {
          merged.set(result.value.url, result.value.commitInfo);
        }
      }

      setCommitInfo(new Map(merged));
      if (merged.size > 0) {
        saveCommitInfoToCache(merged);
      }
    } catch (error) {
      logger.error({ operation: "fetchCommitDates", error: String(error) });
    } finally {
      setIsLoadingCommitDates(false);
    }
  }, [loadCachedCommitInfo, saveCommitInfoToCache]);

  useEffect(() => {
    fetchCommitDates();
  }, [fetchCommitDates]);

  const filteredProjects = useMemo(() => {
    const filtered = filterProjects(projects, searchQuery, selectedStacks, showOpenSourceOnly);

    return filtered.sort((a, b) => {
      const aHasGithub = a.githubUrl && commitInfo.has(a.githubUrl);
      const bHasGithub = b.githubUrl && commitInfo.has(b.githubUrl);

      if (aHasGithub && bHasGithub) {
        const aDate = commitInfo.get(a.githubUrl || "")?.date;
        const bDate = commitInfo.get(b.githubUrl || "")?.date;
        if (!aDate || !bDate) {
          return 0;
        }
        return bDate.getTime() - aDate.getTime();
      }

      if (aHasGithub && !bHasGithub) {
        return -1;
      }
      if (!aHasGithub && bHasGithub) {
        return 1;
      }

      return 0;
    });
  }, [searchQuery, selectedStacks, showOpenSourceOnly, commitInfo]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredProjects.length / itemsPerPage);
  }, [filteredProjects.length, itemsPerPage]);

  const paginatedProjects = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredProjects.slice(startIndex, endIndex);
  }, [filteredProjects, currentPage, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, []);

  const setPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const toggleStack = (stack: string) => {
    const newSelectedStacks = new Set(selectedStacks);
    if (newSelectedStacks.has(stack)) {
      newSelectedStacks.delete(stack);
    } else {
      newSelectedStacks.add(stack);
    }
    setSelectedStacks(newSelectedStacks);
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedStacks(new Set());
    setShowOpenSourceOnly(false);
  };

  return {
    filters: {
      searchQuery,
      selectedStacks,
      showOpenSourceOnly,
    },
    setSearchQuery,
    toggleStack,
    setShowOpenSourceOnly,
    clearAllFilters,
    allStacks,
    stackUsageCount,
    categorizedStacks,
    filteredProjects,
    paginatedProjects,
    currentPage,
    totalPages,
    setPage,
    isLoadingCommitDates,
    commitInfo,
  };
}
