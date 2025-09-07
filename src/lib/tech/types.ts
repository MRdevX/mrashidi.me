import type { TechnologyCategory } from "@/lib/core";

export interface TechStackItem {
  name: string;
  iconKey: string;
}

export interface TechnologyUsage {
  tech: string;
  count: number;
}

export interface CategorizedTechnologies {
  categorizedStacks: Record<TechnologyCategory, string[]>;
  stackUsageCount: Record<string, number>;
}

export type { Project } from "@/data/site/projects";
