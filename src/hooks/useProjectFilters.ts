"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { projects } from "@/data";
import { TechnologyCategory } from "@/lib/constants";
import { processTechnologyData, filterProjects } from "@/lib/techUtils";
import { githubService } from "@/services/github.service";
import { logger } from "@/lib/utils/logger";

const COMMIT_DATES_CACHE_KEY = "project_commit_dates";
const CACHE_DURATION = 24 * 60 * 60 * 1000;

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
  isLoadingCommitDates: boolean;
  commitInfo: Map<string, { date: Date; hash: string }>;
}

export function useProjectFilters(): UseProjectFiltersReturn {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedStacks, setSelectedStacks] = useState<Set<string>>(new Set());
  const [showOpenSourceOnly, setShowOpenSourceOnly] = useState<boolean>(false);
  const [commitInfo, setCommitInfo] = useState<Map<string, { date: Date; hash: string }>>(new Map());
  const [isLoadingCommitDates, setIsLoadingCommitDates] = useState<boolean>(false);

  const { categorizedStacks, stackUsageCount } = useMemo(() => {
    return processTechnologyData(projects);
  }, []);

  const allStacks = useMemo(() => {
    return Object.values(categorizedStacks).flat().sort();
  }, [categorizedStacks]);

  const loadCachedCommitInfo = (): Map<string, { date: Date; hash: string }> => {
    try {
      const cached = localStorage.getItem(COMMIT_DATES_CACHE_KEY);
      if (!cached) return new Map();

      const parsed: CachedCommitDates = JSON.parse(cached);
      const now = Date.now();

      if (now - parsed.timestamp > CACHE_DURATION) {
        localStorage.removeItem(COMMIT_DATES_CACHE_KEY);
        return new Map();
      }

      const infoMap = new Map<string, { date: Date; hash: string }>();
      Object.entries(parsed.commits).forEach(([url, info]) => {
        infoMap.set(url, { date: new Date(info.date), hash: info.hash });
      });

      return infoMap;
    } catch (error) {
      logger.warn({
        operation: "loadCachedCommitInfo",
        error: error instanceof Error ? error.message : String(error),
      });
      return new Map();
    }
  };

  const saveCommitInfoToCache = (info: Map<string, { date: Date; hash: string }>) => {
    try {
      const commitsRecord: Record<string, CommitInfo> = {};
      info.forEach((commitData, url) => {
        commitsRecord[url] = {
          date: commitData.date.toISOString(),
          hash: commitData.hash,
        };
      });

      const cacheData: CachedCommitDates = {
        commits: commitsRecord,
        timestamp: Date.now(),
      };

      localStorage.setItem(COMMIT_DATES_CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      logger.warn({
        operation: "saveCommitInfoToCache",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };

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
          if (!project.githubUrl) return null;

          const commitInfo = await githubService.getLatestCommitInfo(project.githubUrl);
          return { url: project.githubUrl, commitInfo };
        })
      );

      results.forEach((result) => {
        if (result.status === "fulfilled" && result.value?.commitInfo) {
          newCommitInfo.set(result.value.url, result.value.commitInfo);
        }
      });

      if (newCommitInfo.size > 0) {
        saveCommitInfoToCache(newCommitInfo);
      }
      setCommitInfo(newCommitInfo);
    } catch (error) {
      logger.error({
        operation: "fetchCommitDates",
        error: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setIsLoadingCommitDates(false);
    }
  }, []);

  useEffect(() => {
    fetchCommitDates();
  }, [fetchCommitDates]);

  const filteredProjects = useMemo(() => {
    const filtered = filterProjects(projects, searchQuery, selectedStacks, showOpenSourceOnly);

    return filtered.sort((a, b) => {
      const aHasGithub = a.githubUrl && commitInfo.has(a.githubUrl);
      const bHasGithub = b.githubUrl && commitInfo.has(b.githubUrl);

      if (aHasGithub && bHasGithub) {
        const aDate = commitInfo.get(a.githubUrl!)!.date;
        const bDate = commitInfo.get(b.githubUrl!)!.date;
        return bDate.getTime() - aDate.getTime();
      }

      if (aHasGithub && !bHasGithub) return -1;
      if (!aHasGithub && bHasGithub) return 1;

      return 0;
    });
  }, [searchQuery, selectedStacks, showOpenSourceOnly, commitInfo]);

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
    isLoadingCommitDates,
    commitInfo,
  };
}
