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

export type Project = z.infer<typeof ProjectSchema>;
export type ProjectType = Project["type"];

export const projectSlug = (project: Pick<Project, "title">): string =>
  project.title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
