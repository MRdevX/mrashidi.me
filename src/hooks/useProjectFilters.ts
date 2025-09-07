"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { projects } from "@/data";
import type { TechnologyCategory } from "@/lib/constants";
import { logger } from "@/lib/logger";
import { filterProjects, processTechnologyData } from "@/lib/techUtils";
import { githubService } from "@/server/github.service";
import { useCache } from "./useCache";

interface CommitInfo {
  date: string;
  hash: string;
}

interface CachedCommitDates {
  commits: Record<string, CommitInfo>;
  timestamp: number;
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

  const { loadFromCache, saveToCache } = useCache<Record<string, CommitInfo>>("project_commit_dates");

  const loadCachedCommitInfo = useCallback((): Map<string, { date: Date; hash: string }> => {
    const cached = loadFromCache();
    if (!cached) return new Map();

    const infoMap = new Map<string, { date: Date; hash: string }>();
    for (const [url, info] of Object.entries(cached)) {
      infoMap.set(url, { date: new Date(info.date), hash: info.hash });
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
      const cachedInfo = loadCachedCommitInfo();
      if (cachedInfo.size > 0) {
        setCommitInfo(cachedInfo);
        setIsLoadingCommitDates(false);
        return;
      }

      const newCommitInfo = new Map<string, { date: Date; hash: string }>();
      const projectsWithGithub = projects.filter((project) => project.githubUrl);

      const results = await Promise.allSettled(
        projectsWithGithub.map(async (project) => {
          if (!project.githubUrl) {
            return null;
          }

          const commitInfo = await githubService.getLatestCommitInfo(project.githubUrl);
          return { url: project.githubUrl, commitInfo };
        })
      );

      for (const result of results) {
        if (result.status === "fulfilled" && result.value?.commitInfo) {
          newCommitInfo.set(result.value.url, result.value.commitInfo);
        }
      }

      if (newCommitInfo.size > 0) {
        saveCommitInfoToCache(newCommitInfo);
      }
      setCommitInfo(newCommitInfo);
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
