export type ProjectVisibility = "public" | "private";
export type ProjectType = "personal" | "client";

export interface Project {
  title: string;
  description: string;
  highlights?: string[];
  stack: string[];
  githubUrl?: string;
  liveUrl?: string;
  visibility: ProjectVisibility;
  openSource?: boolean;
  year?: string;
  type: ProjectType;
  clientName?: string;
  role?: string;
}

export const yearRange = (project: Project): [number, number] => {
  const years = project.year?.match(/\d{4}/g)?.map(Number) ?? [];
  return years.length > 0 ? [Math.min(...years), Math.max(...years)] : [0, 0];
};
