import { useState, useMemo } from "react";
import { projects } from "@/data/projects";
import { TECHNOLOGY_CATEGORIES, TechnologyCategory, getTechnologyCategory } from "@/lib/constants";

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

  const allStacks = useMemo(() => {
    const stacks = new Set<string>();
    projects.forEach((project) => {
      project.stack.forEach((stack) => stacks.add(stack));
    });
    return Array.from(stacks).sort();
  }, []);

  const stackUsageCount = useMemo(() => {
    const count: Record<string, number> = {};
    projects.forEach((project) => {
      project.stack.forEach((stack) => {
        count[stack] = (count[stack] || 0) + 1;
      });
    });
    return count;
  }, []);

  const categorizedStacks = useMemo(() => {
    const categorized: Record<TechnologyCategory, string[]> = {} as Record<TechnologyCategory, string[]>;

    Object.keys(TECHNOLOGY_CATEGORIES).forEach((category) => {
      categorized[category as TechnologyCategory] = [];
    });

    allStacks.forEach((stack) => {
      const category = getTechnologyCategory(stack);
      if (category) {
        categorized[category].push(stack);
      }
    });

    return categorized;
  }, [allStacks]);

  const matchesSearch = (project: (typeof projects)[0], query: string): boolean => {
    if (!query.trim()) return true;

    try {
      const regex = new RegExp(query, "i");

      if (regex.test(project.title)) return true;
      if (regex.test(project.description)) return true;

      if (project.highlights) {
        for (const highlight of project.highlights) {
          if (regex.test(highlight)) return true;
        }
      }

      for (const tech of project.stack) {
        if (regex.test(tech)) return true;
      }

      if (project.clientName && regex.test(project.clientName)) return true;
      if (project.role && regex.test(project.role)) return true;

      return false;
    } catch (_error) {
      const searchText = query.toLowerCase();
      const projectText = [
        project.title,
        project.description,
        ...(project.highlights || []),
        ...project.stack,
        project.clientName,
        project.role,
      ]
        .join(" ")
        .toLowerCase();

      return projectText.includes(searchText);
    }
  };

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      if (!matchesSearch(project, searchQuery)) return false;

      if (selectedStacks.size > 0) {
        const projectStacks = new Set(project.stack);
        for (const selectedStack of selectedStacks) {
          if (!projectStacks.has(selectedStack)) return false;
        }
      }

      if (showOpenSourceOnly && !project.openSource) return false;

      return true;
    });
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
