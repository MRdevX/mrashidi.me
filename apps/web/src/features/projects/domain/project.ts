import type { Project } from "@mrashidi/types";

export type { Project, ProjectType } from "@mrashidi/types";
export { projectSlug } from "@mrashidi/types";

export const yearRange = (project: Project): [number, number] => {
  const years = project.year?.match(/\d{4}/g)?.map(Number) ?? [];
  return years.length > 0 ? [Math.min(...years), Math.max(...years)] : [0, 0];
};
