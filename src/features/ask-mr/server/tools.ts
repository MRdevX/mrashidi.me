import { type InferUITools, tool, type UIDataTypes, type UIMessage } from "ai";
import { z } from "zod";
import { config } from "@/data";
import { getAllPosts } from "@/features/blog/server";
import { type Project, projectSlug, projects } from "@/features/projects";
import { logger } from "@/lib/core";
import { ASK_MR_LIMITS } from "../constants";

export interface AskMrProjectCard {
  slug: string;
  title: string;
  description: string;
  stack: string[];
  type: Project["type"];
  year?: string;
  githubUrl?: string;
  liveUrl?: string;
}

export interface AskMrBlogPost {
  title: string;
  url: string;
  publishedAt: string;
}

const projectsBySlug = new Map(projects.map((project) => [projectSlug(project), project]));

const truncate = (text: string, max: number) => (text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text);

function toProjectCard(project: Project): AskMrProjectCard {
  return {
    slug: projectSlug(project),
    title: project.title,
    description: truncate(project.description, 180),
    stack: project.stack.slice(0, 6),
    type: project.type,
    year: project.year,
    githubUrl: project.githubUrl,
    liveUrl: project.liveUrl,
  };
}

const BLOG_CACHE_MS = 10 * 60 * 1000;
let blogCache: { at: number; posts: AskMrBlogPost[] } | null = null;

async function latestPosts(limit: number): Promise<AskMrBlogPost[]> {
  if (!blogCache || Date.now() - blogCache.at > BLOG_CACHE_MS) {
    const { posts } = await getAllPosts(1, ASK_MR_LIMITS.maxBlogPosts);
    blogCache = {
      at: Date.now(),
      posts: posts.map((post) => ({
        title: post.title,
        url: post.url,
        publishedAt: new Date(post.publishedAt).toISOString(),
      })),
    };
  }
  return blogCache.posts.slice(0, limit);
}

/** Read-only tools: none of them changes server state; actions (sending a CV request) stay with the visitor. */
export const askMrTools = {
  showProjects: tool({
    description:
      "Show rich cards for 1–3 of Mahdi's projects. Use the exact slugs from '[slug: …]' in the knowledge section.",
    inputSchema: z.object({
      slugs: z.array(z.string()).min(1).max(3).describe("Project slugs, most relevant first"),
    }),
    execute: async ({ slugs }) => {
      const cards = [...new Set(slugs)]
        .map((slug) => projectsBySlug.get(slug))
        .filter((project): project is Project => project !== undefined)
        .map(toProjectCard);
      return { projects: cards };
    },
  }),

  contactHandoff: tool({
    description:
      "Show Mahdi's contact options when a visitor wants to hire or collaborate, discuss rates, or asks something only Mahdi can answer.",
    inputSchema: z.object({
      reason: z.enum(["hire", "collaborate", "question", "other"]).describe("Why the visitor wants to get in touch"),
    }),
    execute: async ({ reason }) => ({
      reason,
      contactPath: "/contact",
      email: config.person.email,
      linkedin: config.social.linkedin,
      telegram: config.social.telegram,
    }),
  }),

  requestCv: tool({
    description: "Offer the visitor a form to get Mahdi's CV by email.",
    inputSchema: z.object({}),
    execute: async () => ({ resumePath: "/resume" }),
  }),

  getLatestPosts: tool({
    description: "Fetch Mahdi's latest blog posts from Medium (title, link, date).",
    inputSchema: z.object({
      limit: z.number().int().min(1).max(ASK_MR_LIMITS.maxBlogPosts).default(3),
    }),
    execute: async ({ limit }) => {
      try {
        return { posts: await latestPosts(limit), available: true };
      } catch (error) {
        logger.error({ error: String(error) }, "Ask MR: blog lookup failed");
        return { posts: [] as AskMrBlogPost[], available: false };
      }
    },
  }),

  suggestFollowUps: tool({
    description: "Offer short follow-up questions. Always call this last, after the answer text.",
    inputSchema: z.object({
      questions: z.array(z.string().max(80)).min(1).max(ASK_MR_LIMITS.followUpCount),
    }),
    execute: async ({ questions }) => ({ questions }),
  }),
};

type AskMrTools = InferUITools<typeof askMrTools>;
export type AskMrUIMessage = UIMessage<unknown, UIDataTypes, AskMrTools>;
