import type { Project } from "./project";

export interface StackFacet {
  tech: string;
  count: number;
  selected: boolean;
  disabled: boolean;
}

export interface StackFacetGroup {
  name: string;
  items: StackFacet[];
}

export const countStackUsage = (projects: readonly Project[]) => {
  const usage = new Map<string, number>();
  for (const project of projects) {
    for (const tech of project.stack) {
      usage.set(tech, (usage.get(tech) ?? 0) + 1);
    }
  }
  return usage;
};
