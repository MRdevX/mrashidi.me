import { z } from "zod";
import type { ProjectEntry } from "./project";

export const ASK_MR_NAME = "Ask MR";

const MAX_REQUEST_MESSAGES = 50;

const AskMrMessageSchema = z.looseObject({
  id: z.string().min(1).max(100),
  role: z.enum(["user", "assistant", "system"]),
  parts: z.array(z.looseObject({ type: z.string() })).max(40),
});

export const AskMrChatRequestSchema = z.object({
  messages: z.array(AskMrMessageSchema).min(1).max(MAX_REQUEST_MESSAGES),
  conversationId: z.uuid(),
  pathname: z.string().max(200).optional(),
});

export type AskMrMessage = z.infer<typeof AskMrMessageSchema>;
export type AskMrChatRequest = z.infer<typeof AskMrChatRequestSchema>;

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

export type AskMrContactReason = "hire" | "collaborate" | "question" | "other";

export interface AskMrContact {
  reason: AskMrContactReason;
  contactPath: string;
  email: string;
  linkedin: string;
  telegram: string;
}

// A type alias, not an interface: the AI SDK's UITools constraint needs an implicit index signature.
export type AskMrToolSet = {
  showProjects: { input: { slugs: string[] }; output: { projects: AskMrProjectCard[] } };
  contactHandoff: { input: { reason: AskMrContactReason }; output: AskMrContact };
  requestCv: { input: Record<string, never>; output: { resumePath: string } };
  getLatestPosts: { input: { limit: number }; output: { posts: AskMrBlogPost[]; available: boolean } };
  suggestFollowUps: { input: { questions: string[] }; output: { questions: string[] } };
};

export interface AskMrMessageMetadata {
  model: string;
  finishReason: string;
  inputTokens?: number;
  cachedInputTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
}

/** Error codes Ask MR answers with, as a JSON body or as the text of an in-stream error, so the UI can show a specific message. */
export type AskMrErrorCode = "invalid" | "bot" | "rate_limited" | "budget_exhausted" | "disabled" | "server";

export interface AskMrErrorBody {
  error: AskMrErrorCode;
  message: string;
  /** Seconds until the visitor may try again (rate limits only). */
  retryAfter?: number;
}

export const ASK_MR_ERROR_MESSAGES: Record<AskMrErrorCode, string> = {
  invalid: "That message couldn't be sent. Please try rephrasing it.",
  bot: "Automated traffic isn't allowed.",
  rate_limited: "You're sending messages quickly. Please wait a moment.",
  budget_exhausted: "Ask MR is resting for today. You can still get in touch through the contact page.",
  disabled: "Ask MR is offline right now. You can still get in touch through the contact page.",
  server: "Ask MR hit a snag. Please try again.",
};
