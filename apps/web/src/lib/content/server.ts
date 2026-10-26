import {
  AboutSchema,
  type AskMrKnowledge,
  AskMrKnowledgeSchema,
  CertificateCategorySchema,
  type Content,
  EducationSchema,
  ExperienceEntrySchema,
  ProfileSchema,
  ProjectSchema,
  SkillCategorySchema,
} from "@mrashidi/types";
import { fixtureContent } from "@mrashidi/types/fixtures";
import { cache } from "react";
import { z } from "zod";
import { getEnv } from "@/lib/core";
import { fixtureSiteContent } from "./fixtures";
import type { SiteContent } from "./types";

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

async function fetchJson<T>(base: string, path: string, schema: z.ZodType<T>, token?: string): Promise<T> {
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
  const [profile, about, experience, education, certificates, skills, projects] = await Promise.all([
    fetchJson(base, "/v1/profile", ProfileSchema),
    fetchJson(base, "/v1/about", AboutSchema),
    fetchJson(base, "/v1/experience", z.array(ExperienceEntrySchema)),
    fetchJson(base, "/v1/education", z.array(EducationSchema)),
    fetchJson(base, "/v1/certificates", z.array(CertificateCategorySchema)),
    fetchJson(base, "/v1/skills", z.array(SkillCategorySchema)),
    fetchJson(base, "/v1/projects", z.array(ProjectSchema)),
  ]);
  return { profile, about, experience, education, certificates, skills, projects };
});

export const getAskMrKnowledge = cache(async (): Promise<AskMrKnowledge> => {
  const base = contentApiUrl();
  if (!base) {
    return fixtureContent.knowledge;
  }
  return fetchJson(base, "/v1/knowledge", AskMrKnowledgeSchema, getEnv("CONTENT_API_TOKEN"));
});

export async function getAskMrContent(): Promise<Content> {
  const [site, knowledge] = await Promise.all([getSiteContent(), getAskMrKnowledge()]);
  return { ...site, knowledge };
}
