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
