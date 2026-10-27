import { z } from "zod";
import { type Content, ContentSchema } from "../src/content";
import { ContributionsSchema } from "../src/github";
import { KnowledgeContextSchema } from "../src/knowledge";
import { CatalogOverviewSchema, ProjectEntrySchema } from "../src/project";
import { ExperienceEntrySchema, SkillsOverviewSchema } from "../src/resume";
import about from "./about.json" with { type: "json" };
import experienceReadModel from "./api/experience.json" with { type: "json" };
import githubContributionsReadModel from "./api/github-contributions.json" with { type: "json" };
import knowledgeContextReadModel from "./api/knowledge-context.json" with { type: "json" };
import projectsReadModel from "./api/projects.json" with { type: "json" };
import projectsOverviewReadModel from "./api/projects-overview.json" with { type: "json" };
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
  projects: z.array(ProjectEntrySchema).parse(projectsReadModel),
  projectsOverview: CatalogOverviewSchema.parse(projectsOverviewReadModel),
};

export const fixtureKnowledgeContext = KnowledgeContextSchema.parse(knowledgeContextReadModel);

export const fixtureGitHubContributions = ContributionsSchema.parse(githubContributionsReadModel);
