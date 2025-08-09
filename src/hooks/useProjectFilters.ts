import { useState, useMemo } from "react";
import { projects } from "@/data/projects";
import { TechnologyCategory } from "@/lib/constants";
import { processTechnologyData, filterProjects } from "@/lib/techUtils";

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
}

export function useProjectFilters(): UseProjectFiltersReturn {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedStacks, setSelectedStacks] = useState<Set<string>>(new Set());
  const [showOpenSourceOnly, setShowOpenSourceOnly] = useState<boolean>(false);

  const { categorizedStacks, stackUsageCount } = useMemo(() => {
    return processTechnologyData(projects);
  }, []);

  const allStacks = useMemo(() => {
    return Object.values(categorizedStacks).flat().sort();
  }, [categorizedStacks]);

  const filteredProjects = useMemo(() => {
    return filterProjects(projects, searchQuery, selectedStacks, showOpenSourceOnly);
  }, [searchQuery, selectedStacks, showOpenSourceOnly]);

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
  };
}
