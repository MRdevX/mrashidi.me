import {
  AboutSchema,
  CatalogOverviewSchema,
  CertificateCategorySchema,
  type Contributions,
  ContributionsSchema,
  EducationSchema,
  ExperienceEntrySchema,
  KnowledgeContextSchema,
  ProfileSchema,
  ProjectEntrySchema,
  SkillCategorySchema,
  SkillsOverviewSchema,
} from "@mrashidi/types";
import { fixtureGitHubContributions, fixtureKnowledgeContext } from "@mrashidi/types/fixtures";
import { cache } from "react";
import { z } from "zod";
import { getEnv } from "@/lib/core";
import { fixtureSiteContent } from "./fixtures";
import type { AskMrContent, SiteContent } from "./types";

export const CONTENT_TAG = "content";
const REVALIDATE_SECONDS = 3600;

function contentApiUrl(): string | null {
  const url = getEnv("CONTENT_API_URL");
  if (url) {
    return url;
  }
  if (getEnv("VERCEL_ENV") === "production") {
    throw new Error("CONTENT_API_URL is not set; production must never fall back to fixture content");
  }
  return null;
}

async function fetchJson<T>(base: string, path: string, schema: z.ZodType<T>): Promise<T> {
  const token = getEnv("CONTENT_API_TOKEN");
  const res = await fetch(`${base}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    next: { tags: [CONTENT_TAG], revalidate: REVALIDATE_SECONDS },
  });
  if (!res.ok) {
    throw new Error(`Content API ${path} answered ${res.status}`);
  }
  return schema.parse(await res.json());
}

export const getSiteContent = cache(async (): Promise<SiteContent> => {
  const base = contentApiUrl();
  if (!base) {
    return fixtureSiteContent;
  }
  const [profile, about, experience, education, certificates, skills, skillsOverview, projects, projectsOverview] =
    await Promise.all([
      fetchJson(base, "/v1/profile", ProfileSchema),
      fetchJson(base, "/v1/about", AboutSchema),
      fetchJson(base, "/v1/experience", z.array(ExperienceEntrySchema)),
      fetchJson(base, "/v1/education", z.array(EducationSchema)),
      fetchJson(base, "/v1/certificates", z.array(CertificateCategorySchema)),
      fetchJson(base, "/v1/skills", z.array(SkillCategorySchema)),
      fetchJson(base, "/v1/skills/overview", SkillsOverviewSchema),
      fetchJson(base, "/v1/projects", z.array(ProjectEntrySchema)),
      fetchJson(base, "/v1/projects/overview", CatalogOverviewSchema),
    ]);
  return { profile, about, experience, education, certificates, skills, skillsOverview, projects, projectsOverview };
});

const getKnowledgeContext = cache(async (): Promise<string> => {
  const base = contentApiUrl();
  if (!base) {
    return fixtureKnowledgeContext.context;
  }
  const { context } = await fetchJson(base, "/v1/knowledge/context", KnowledgeContextSchema);
  return context;
});

export async function getGitHubContributions(): Promise<Contributions> {
  const base = contentApiUrl();
  return base ? fetchJson(base, "/v1/github/contributions", ContributionsSchema) : fixtureGitHubContributions;
}

export async function getAskMrContent(): Promise<AskMrContent> {
  const [site, knowledgeContext] = await Promise.all([getSiteContent(), getKnowledgeContext()]);
  return { ...site, knowledgeContext };
}
