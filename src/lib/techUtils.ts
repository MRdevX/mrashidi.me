import { TECHNOLOGY_CATEGORIES, TechnologyCategory, getTechnologyCategory } from "./constants";

export interface TechnologyUsage {
  tech: string;
  count: number;
}

export interface CategorizedTechnologies {
  categorizedStacks: Record<TechnologyCategory, string[]>;
  stackUsageCount: Record<string, number>;
}

export interface Project {
  title: string;
  description: string;
  highlights?: string[];
  stack: string[];
  clientName?: string;
  role?: string;
  openSource?: boolean;
  visibility: "public" | "private";
  type: "personal" | "client";
  year?: string;
  githubUrl?: string;
}

export const matchesSearch = (project: Project, query: string): boolean => {
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

export const filterProjects = (
  projects: Project[],
  searchQuery: string,
  selectedStacks: Set<string>,
  showOpenSourceOnly: boolean
): Project[] => {
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
};

export const processTechnologyData = (projects: { stack: string[] }[]): CategorizedTechnologies => {
  const stackUsageCount: Record<string, number> = {};
  projects.forEach((project) => {
    project.stack.forEach((tech) => {
      stackUsageCount[tech] = (stackUsageCount[tech] || 0) + 1;
    });
  });

  const allStacks = Array.from(new Set(projects.flatMap((project) => project.stack))).sort();

  const categorizedStacks: Record<TechnologyCategory, string[]> = {} as Record<TechnologyCategory, string[]>;
  Object.keys(TECHNOLOGY_CATEGORIES).forEach((category) => {
    categorizedStacks[category as TechnologyCategory] = [];
  });

  allStacks.forEach((stack) => {
    const category = getTechnologyCategory(stack);
    if (category) {
      categorizedStacks[category].push(stack);
    }
  });

  Object.keys(categorizedStacks).forEach((category) => {
    const techCategory = category as TechnologyCategory;
    categorizedStacks[techCategory].sort((a, b) => {
      const countA = stackUsageCount[a] || 0;
      const countB = stackUsageCount[b] || 0;
      return countB - countA;
    });
  });

  return {
    categorizedStacks,
    stackUsageCount,
  };
};

export const getSortedTechnologiesByUsage = (
  projects: { stack: string[] }[]
): Record<TechnologyCategory, TechnologyUsage[]> => {
  const { stackUsageCount } = processTechnologyData(projects);

  const result: Record<TechnologyCategory, TechnologyUsage[]> = {} as Record<TechnologyCategory, TechnologyUsage[]>;

  Object.keys(TECHNOLOGY_CATEGORIES).forEach((category) => {
    result[category as TechnologyCategory] = [];
  });

  Object.entries(stackUsageCount).forEach(([tech, count]) => {
    const category = getTechnologyCategory(tech);
    if (category) {
      result[category].push({ tech, count });
    }
  });

  Object.keys(result).forEach((category) => {
    result[category as TechnologyCategory].sort((a, b) => b.count - a.count);
  });

  return result;
};

export const sortProjectsByDate = (projects: Project[], commitDates: Map<string, Date> = new Map()): Project[] => {
  console.log("Sorting projects by date. Commit dates available:", commitDates.size);

  return [...projects].sort((a, b) => {
    const dateA = getProjectDate(a, commitDates);
    const dateB = getProjectDate(b, commitDates);

    return dateB.getTime() - dateA.getTime();
  });
};

const getProjectDate = (project: Project, commitDates: Map<string, Date>): Date => {
  if (project.githubUrl && commitDates.has(project.githubUrl)) {
    return commitDates.get(project.githubUrl)!;
  }

  if (project.year) {
    const yearMatch = project.year.match(/(\d{4})/g);
    if (yearMatch && yearMatch.length > 0) {
      const years = yearMatch.map((y) => parseInt(y)).sort((a, b) => b - a);
      return new Date(years[0], 0, 1);
    }
  }

  return new Date(2000, 0, 1);
};
