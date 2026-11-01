import {
  type AskMrBlogPost,
  type AskMrProjectCard,
  type AskMrToolSet,
  firstName,
  type Profile,
  type ProjectEntry,
} from "@mrashidi/types";
import { type Tool, tool } from "ai";
import { z } from "zod";

export const MAX_BLOG_POSTS = 5;
const FOLLOW_UP_COUNT = 3;

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

export interface AskMrToolSources {
  profile: Profile;
  projects: ProjectEntry[];
  latestPosts: (limit: number) => Promise<AskMrBlogPost[]>;
}

type AskMrTools = { [K in keyof AskMrToolSet]: Tool<AskMrToolSet[K]["input"], AskMrToolSet[K]["output"]> };

/** Read-only tools: none of them changes server state; actions (sending a CV request) stay with the visitor. */
export function createAskMrTools({ profile, projects, latestPosts }: AskMrToolSources): AskMrTools {
  const first = firstName(profile);
  const projectsBySlug = new Map(projects.map((project) => [project.slug, project]));

  return {
    showProjects: tool({
      description: `Show rich cards for 1–3 of ${first}'s projects. Use the exact slugs from '[slug: …]' in the knowledge section.`,
      inputSchema: z.object({
        slugs: z.array(z.string()).min(1).max(3).describe("Project slugs, most relevant first"),
      }),
      execute: async ({ slugs }) => ({
        projects: [...new Set(slugs)]
          .map((slug) => projectsBySlug.get(slug))
          .filter((project): project is ProjectEntry => project !== undefined)
          .map(toProjectCard),
      }),
    }),

    contactHandoff: tool({
      description: `Show ${first}'s contact options when a visitor wants to hire or collaborate, discuss terms, or asks something only ${first} can answer.`,
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
        limit: z.number().int().min(1).max(MAX_BLOG_POSTS).default(3),
      }),
      execute: async ({ limit }): Promise<AskMrToolSet["getLatestPosts"]["output"]> => {
        try {
          return { posts: await latestPosts(limit), available: true };
        } catch (error) {
          console.error("Ask MR: blog lookup failed", error);
          return { posts: [], available: false };
        }
      },
    }),

    suggestFollowUps: tool({
      description: "Offer short follow-up questions. Always call this last, after the answer text.",
      inputSchema: z.object({
        questions: z.array(z.string().max(80)).min(1).max(FOLLOW_UP_COUNT),
      }),
      execute: async ({ questions }) => ({ questions }),
    }),
  };
}
