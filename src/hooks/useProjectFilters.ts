import { useState, useMemo, useEffect } from "react";
import { projects } from "@/data/projects";
import { TechnologyCategory } from "@/lib/constants";
import { processTechnologyData, filterProjects, sortProjectsByDate } from "@/lib/techUtils";
import { githubService } from "@/services/githubService";

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
  refreshCommitDates: () => Promise<void>;
  commitInfo: Map<string, { date: Date; hash: string }>;
}

export function useProjectFilters(): UseProjectFiltersReturn {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedStacks, setSelectedStacks] = useState<Set<string>>(new Set());
  const [showOpenSourceOnly, setShowOpenSourceOnly] = useState<boolean>(false);
  const [commitDates, setCommitDates] = useState<Map<string, Date>>(new Map());
  const [commitInfo, setCommitInfo] = useState<Map<string, { date: Date; hash: string }>>(new Map());
  const [isLoadingCommitDates, setIsLoadingCommitDates] = useState<boolean>(false);

  const { categorizedStacks, stackUsageCount } = useMemo(() => {
    return processTechnologyData(projects);
  }, []);

  const allStacks = useMemo(() => {
    return Object.values(categorizedStacks).flat().sort();
  }, [categorizedStacks]);

  const filteredProjects = useMemo(() => {
    const filtered = filterProjects(projects, searchQuery, selectedStacks, showOpenSourceOnly);
    return sortProjectsByDate(filtered, commitDates);
  }, [searchQuery, selectedStacks, showOpenSourceOnly, commitDates]);

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
      console.warn("Failed to load cached commit info:", error);
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
      console.warn("Failed to save commit info to cache:", error);
    }
  };

  const fetchCommitDates = async (forceRefresh = false) => {
    setIsLoadingCommitDates(true);

    try {
      if (!forceRefresh) {
        const cachedInfo = loadCachedCommitInfo();
        if (cachedInfo.size > 0) {
          setCommitInfo(cachedInfo);

          const datesMap = new Map<string, Date>();
          cachedInfo.forEach((info, url) => {
            datesMap.set(url, info.date);
          });
          setCommitDates(datesMap);
          setIsLoadingCommitDates(false);
          return;
        }
      }

      const newCommitInfo = new Map<string, { date: Date; hash: string }>();

      const projectsWithGithub = projects.filter((project) => project.githubUrl);

      const promises = projectsWithGithub.map(async (project) => {
        if (!project.githubUrl) return;

        try {
          const commitInfo = await githubService.getLatestCommitInfo(project.githubUrl);
          if (commitInfo) {
            newCommitInfo.set(project.githubUrl, commitInfo);
          }
        } catch (error) {
          console.warn(`Failed to fetch commit info for ${project.githubUrl}:`, error);
        }
      });

      await Promise.all(promises);

      saveCommitInfoToCache(newCommitInfo);
      setCommitInfo(newCommitInfo);

      const datesMap = new Map<string, Date>();
      newCommitInfo.forEach((info, url) => {
        datesMap.set(url, info.date);
      });
      setCommitDates(datesMap);
    } catch (error) {
      console.error("Error fetching commit info:", error);
    } finally {
      setIsLoadingCommitDates(false);
    }
  };

  const refreshCommitDates = async () => {
    await fetchCommitDates(true);
  };

  useEffect(() => {
    fetchCommitDates();
  }, []);

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
    refreshCommitDates,
    commitInfo,
  };
}
