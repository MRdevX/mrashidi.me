import type { CatalogOverview, Content, ExperienceEntry, ProjectEntry, SkillsOverview } from "@mrashidi/types";

export type SiteContent = Omit<Content, "knowledge" | "experience" | "projects"> & {
  experience: ExperienceEntry[];
  skillsOverview: SkillsOverview;
  projects: ProjectEntry[];
  projectsOverview: CatalogOverview;
};

export type AskMrContent = SiteContent & { knowledgeContext: string };
