import type { Content, ExperienceEntry, SkillsOverview } from "@mrashidi/types";

export type SiteContent = Omit<Content, "knowledge" | "experience"> & {
  experience: ExperienceEntry[];
  skillsOverview: SkillsOverview;
};
