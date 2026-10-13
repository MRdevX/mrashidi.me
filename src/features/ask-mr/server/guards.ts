import type { UIMessage } from "ai";
import { checkBotId } from "botid/server";
import { z } from "zod";
import { getEnv, logger } from "@/lib/core";
import { checkRateLimit, getClientIdentifier, type RateLimiterType } from "@/lib/services/rate-limit";
import { ASK_MR_LIMITS } from "../constants";
import { messageText } from "../messageText";
import type { AskMrErrorBody, AskMrErrorCode } from "../types";
import { getAskMrRedis } from "./redis";

const STATUS: Record<AskMrErrorCode, number> = {
  invalid: 400,
  bot: 403,
  rate_limited: 429,
  budget_exhausted: 503,
  disabled: 503,
  server: 500,
};

const MESSAGES: Record<AskMrErrorCode, string> = {
  invalid: "That message couldn't be sent. Please try rephrasing it.",
  bot: "Automated traffic isn't allowed.",
  rate_limited: "You're sending messages quickly. Please wait a moment.",
  budget_exhausted: "Ask MR is resting for today. You can still reach Mahdi directly.",
  disabled: "Ask MR is offline right now. You can still reach Mahdi directly.",
  server: "Ask MR hit a snag. Please try again.",
};

export function askMrErrorResponse(code: AskMrErrorCode, retryAfter?: number): Response {
  const body: AskMrErrorBody = { error: code, message: MESSAGES[code], ...(retryAfter ? { retryAfter } : {}) };
  return Response.json(body, {
    status: STATUS[code],
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      ...(retryAfter ? { "Retry-After": String(retryAfter) } : {}),
    },
  });
}

const partSchema = z.looseObject({ type: z.string() });

const messageSchema = z.looseObject({
  id: z.string().min(1).max(100),
  role: z.enum(["user", "assistant", "system"]),
  parts: z.array(partSchema).max(40),
});

export const chatRequestSchema = z.object({
  messages: z.array(messageSchema).min(1).max(ASK_MR_LIMITS.maxRequestMessages),
  conversationId: z.uuid(),
  pathname: z.string().max(200).optional(),
});

export interface ChatRequest {
  messages: UIMessage[];
  conversationId: string;
  pathname?: string;
}

const ALLOWED_PART = (type: string) => type === "text" || type === "step-start" || type.startsWith("tool-");

/**
 * Normalizes visitor-supplied history: drops `system` turns and non-text/tool parts (no file uploads),
 * keeps the last N messages starting at a user turn, and enforces per-message size limits.
 * Returns `null` when the latest message isn't a valid user question.
 */
export function sanitizeMessages(messages: z.infer<typeof messageSchema>[]): UIMessage[] | null {
  const cleaned = messages
    .filter((m) => m.role !== "system")
    .map((m) => ({ ...m, parts: m.parts.filter((p) => ALLOWED_PART(p.type)) }) as UIMessage);

  const last = cleaned.at(-1);
  if (last?.role !== "user") {
    return null;
  }
  const question = messageText(last).trim();
  if (!question || question.length > ASK_MR_LIMITS.maxMessageChars) {
    return null;
  }

  // Older turns can't be used to smuggle a huge prompt either.
  const oversized = cleaned.some((m) => messageText(m).length > ASK_MR_LIMITS.maxMessageChars * 6);
  if (oversized) {
    return null;
  }

  const recent = cleaned.slice(-ASK_MR_LIMITS.maxHistoryMessages);
  const firstUser = recent.findIndex((m) => m.role === "user");
  return recent.slice(firstUser);
}

const todayKey = () => `askmr:budget:${new Date().toISOString().slice(0, 10)}`;

/** Atomically counts this request against the global daily budget. */
async function consumeDailyBudget(): Promise<boolean> {
  const redis = getAskMrRedis();
  if (!redis) {
    return true;
  }
  try {
    const key = `${todayKey()}:requests`;
    const used = await redis.incr(key);
    if (used === 1) {
      await redis.expire(key, 60 * 60 * 48);
    }
    return used <= getEnv("ASK_MR_DAILY_BUDGET");
  } catch (error) {
    // Fail open: a Redis outage shouldn't take the chat down; per-IP limits still apply.
    logger.error({ error: String(error) }, "Ask MR: budget check failed");
    return true;
  }
}

/** Records token usage for the day (visibility only; the cap is request-based). */
export async function recordDailyTokens(tokens: number | undefined): Promise<void> {
  const redis = getAskMrRedis();
  if (!redis || !tokens) {
    return;
  }
  try {
    const key = `${todayKey()}:tokens`;
    await redis.incrby(key, tokens);
    await redis.expire(key, 60 * 60 * 24 * 30);
  } catch (error) {
    logger.error({ error: String(error) }, "Ask MR: token accounting failed");
  }
}

export async function checkLimits(request: Request, limiters: readonly RateLimiterType[]): Promise<Response | null> {
  const identifier = getClientIdentifier(request);
  for (const limiter of limiters) {
    const result = await checkRateLimit(limiter, identifier);
    if (!result.success) {
      const retryAfter = Math.max(1, Math.ceil((result.reset.getTime() - Date.now()) / 1000));
      return askMrErrorResponse("rate_limited", retryAfter);
    }
  }
  return null;
}

export async function isBotRequest(): Promise<boolean> {
  try {
    // Verified crawlers count as bots too: nothing here is worth spending model tokens on for them.
    const verification = await checkBotId();
    return verification.isBot;
  } catch (error) {
    logger.error({ error: String(error) }, "Ask MR: BotID check failed");
    return false;
  }
}

export type GuardResult = { ok: true; body: ChatRequest } | { ok: false; response: Response };

/** Runs every check before any model tokens are spent, cheapest first. */
export async function guardChatRequest(request: Request): Promise<GuardResult> {
  if (!getEnv("ASK_MR_ENABLED")) {
    return { ok: false, response: askMrErrorResponse("disabled") };
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return { ok: false, response: askMrErrorResponse("invalid") };
  }
  const parsed = chatRequestSchema.safeParse(json);
  if (!parsed.success) {
    return { ok: false, response: askMrErrorResponse("invalid") };
  }

  const messages = sanitizeMessages(parsed.data.messages);
  if (!messages) {
    return { ok: false, response: askMrErrorResponse("invalid") };
  }

  if (await isBotRequest()) {
    return { ok: false, response: askMrErrorResponse("bot") };
  }

  const limited = await checkLimits(request, ["askMr", "askMrDaily"]);
  if (limited) {
    return { ok: false, response: limited };
  }

  if (!(await consumeDailyBudget())) {
    return { ok: false, response: askMrErrorResponse("budget_exhausted") };
  }

  return {
    ok: true,
    body: { messages, conversationId: parsed.data.conversationId, pathname: parsed.data.pathname },
  };
}
