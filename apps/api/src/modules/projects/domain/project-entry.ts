import { type Project, type ProjectEntry, projectSlug } from "@mrashidi/types";

export function toProjectEntry(project: Project): ProjectEntry {
  const years = project.year?.match(/\d{4}/g)?.map(Number) ?? [];
  return {
    ...project,
    slug: projectSlug(project),
    startYear: years.length > 0 ? Math.min(...years) : null,
    endYear: years.length > 0 ? Math.max(...years) : null,
  };
}
