import { firstName, type ProjectEntry } from "@mrashidi/types";
import { type InferUITools, tool, type UIDataTypes, type UIMessage } from "ai";
import { z } from "zod";
import type { SiteContent } from "@/lib/content";
import { getBlogPosts } from "@/lib/content/server";
import { logger } from "@/lib/core";
import { ASK_MR_LIMITS } from "../constants";

export interface AskMrProjectCard {
  slug: string;
  title: string;
  description: string;
  stack: string[];
  type: ProjectEntry["type"];
  year?: string;
  githubUrl?: string;
  liveUrl?: string;
}

export interface AskMrBlogPost {
  title: string;
  url: string;
  publishedAt: string;
}

const truncate = (text: string, max: number) => (text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text);

function toProjectCard(project: ProjectEntry): AskMrProjectCard {
  return {
    slug: project.slug,
    title: project.title,
    description: truncate(project.description, 180),
    stack: project.stack.slice(0, 6),
    type: project.type,
    year: project.year,
    githubUrl: project.githubUrl,
    liveUrl: project.liveUrl,
  };
}

async function latestPosts(limit: number): Promise<AskMrBlogPost[]> {
  const { posts } = await getBlogPosts(1, limit);
  return posts.map(({ title, url, publishedAt }) => ({ title, url, publishedAt }));
}

/** Read-only tools: none of them changes server state; actions (sending a CV request) stay with the visitor. */
export function createAskMrTools(content: Pick<SiteContent, "profile" | "projects">) {
  const { profile, projects } = content;
  const first = firstName(profile);
  const projectsBySlug = new Map(projects.map((project) => [project.slug, project]));

  return {
    showProjects: tool({
      description: `Show rich cards for 1–3 of ${first}'s projects. Use the exact slugs from '[slug: …]' in the knowledge section.`,
      inputSchema: z.object({
        slugs: z.array(z.string()).min(1).max(3).describe("Project slugs, most relevant first"),
      }),
      execute: async ({ slugs }) => {
        const cards = [...new Set(slugs)]
          .map((slug) => projectsBySlug.get(slug))
          .filter((project): project is ProjectEntry => project !== undefined)
          .map(toProjectCard);
        return { projects: cards };
      },
    }),

    contactHandoff: tool({
      description: `Show ${first}'s contact options when a visitor wants to hire or collaborate, discuss rates, or asks something only ${first} can answer.`,
      inputSchema: z.object({
        reason: z.enum(["hire", "collaborate", "question", "other"]).describe("Why the visitor wants to get in touch"),
      }),
      execute: async ({ reason }) => ({
        reason,
        contactPath: "/contact",
        email: profile.person.email,
        linkedin: profile.social.linkedin,
        telegram: profile.social.telegram,
      }),
    }),

    requestCv: tool({
      description: `Offer the visitor a form to get ${first}'s CV by email.`,
      inputSchema: z.object({}),
      execute: async () => ({ resumePath: "/resume" }),
    }),

    getLatestPosts: tool({
      description: `Fetch ${first}'s latest blog posts from Medium (title, link, date).`,
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
}

type AskMrTools = InferUITools<ReturnType<typeof createAskMrTools>>;
export type AskMrUIMessage = UIMessage<unknown, UIDataTypes, AskMrTools>;
