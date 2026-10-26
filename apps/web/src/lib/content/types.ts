import type { Content, ExperienceEntry } from "@mrashidi/types";

export type SiteContent = Omit<Content, "knowledge" | "experience"> & { experience: ExperienceEntry[] };
