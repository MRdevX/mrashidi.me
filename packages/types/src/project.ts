import { z } from "zod";

export const ProjectSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  highlights: z.array(z.string()).optional(),
  stack: z.array(z.string()),
  githubUrl: z.url().optional(),
  liveUrl: z.url().optional(),
  visibility: z.enum(["public", "private"]),
  openSource: z.boolean().optional(),
  year: z.string().optional(),
  type: z.enum(["personal", "client"]),
  clientName: z.string().optional(),
  role: z.string().optional(),
});

export const LatestCommitSchema = z.object({
  hash: z.string().min(1),
  committedAt: z.iso.datetime(),
  url: z.url(),
});

export const ProjectEntrySchema = ProjectSchema.extend({
  slug: z.string().min(1),
  startYear: z.number().int().nullable(),
  endYear: z.number().int().nullable(),
  latestCommit: LatestCommitSchema.nullable(),
  lastActivityAt: z.iso.datetime().nullable(),
});

export const StackGroupSchema = z.object({
  name: z.string().min(1),
  items: z.array(z.string()),
});

export const CatalogOverviewSchema = z.object({
  projectCount: z.number().int().nonnegative(),
  openSourceCount: z.number().int().nonnegative(),
  stackCount: z.number().int().nonnegative(),
  topStacks: z.array(z.string()),
  stackGroups: z.array(StackGroupSchema),
});

export type Project = z.infer<typeof ProjectSchema>;
export type ProjectType = Project["type"];
export type LatestCommit = z.infer<typeof LatestCommitSchema>;
export type ProjectEntry = z.infer<typeof ProjectEntrySchema>;
export type StackGroup = z.infer<typeof StackGroupSchema>;
export type CatalogOverview = z.infer<typeof CatalogOverviewSchema>;

export const projectSlug = (project: Pick<Project, "title">): string =>
  project.title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
