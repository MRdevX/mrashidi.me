import { z } from "zod";
import { type Content, ContentSchema } from "../src/content";
import { ExperienceEntrySchema, SkillsOverviewSchema } from "../src/resume";
import about from "./about.json" with { type: "json" };
import experienceReadModel from "./api/experience.json" with { type: "json" };
import skillsOverviewReadModel from "./api/skills-overview.json" with { type: "json" };
import certificates from "./certificates.json" with { type: "json" };
import education from "./education.json" with { type: "json" };
import experience from "./experience.json" with { type: "json" };
import knowledge from "./knowledge.json" with { type: "json" };
import profile from "./profile.json" with { type: "json" };
import projects from "./projects.json" with { type: "json" };
import skills from "./skills.json" with { type: "json" };

export const fixtureContent: Content = ContentSchema.parse({
  profile,
  about,
  experience,
  education,
  certificates,
  skills,
  projects,
  knowledge,
});

export const fixtureReadModels = {
  experience: z.array(ExperienceEntrySchema).parse(experienceReadModel),
  skillsOverview: SkillsOverviewSchema.parse(skillsOverviewReadModel),
};
