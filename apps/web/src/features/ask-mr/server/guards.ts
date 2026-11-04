import {
  ASK_MR_ERROR_MESSAGES,
  type AskMrChatRequest,
  AskMrChatRequestSchema,
  type AskMrErrorBody,
  type AskMrErrorCode,
  type AskMrMessage,
} from "@mrashidi/types";
import { checkBotId } from "botid/server";
import { getEnv, isProduction, logger } from "@/lib/core";
import { checkRateLimit, getClientIdentifier, type RateLimiterType } from "@/lib/services/rate-limit";
import { ASK_MR_LIMITS } from "../constants";
import { messageText } from "../messageText";
import { getAskMrRedis } from "./redis";

const STATUS: Record<AskMrErrorCode, number> = {
  invalid: 400,
  bot: 403,
  rate_limited: 429,
  budget_exhausted: 503,
  disabled: 503,
  server: 500,
};

export function askMrErrorResponse(code: AskMrErrorCode, retryAfter?: number): Response {
  const body: AskMrErrorBody = {
    error: code,
    message: ASK_MR_ERROR_MESSAGES[code],
    ...(retryAfter ? { retryAfter } : {}),
  };
  return Response.json(body, {
    status: STATUS[code],
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      ...(retryAfter ? { "Retry-After": String(retryAfter) } : {}),
    },
  });
}

// Tool parts and part metadata from the browser are dropped: the model must only see tool results the
// API produced itself, never ones a visitor wrote into the history.
function textParts(message: AskMrMessage): AskMrMessage["parts"] {
  return message.parts.flatMap((part) =>
    part.type === "text" && typeof part.text === "string" ? [{ type: "text", text: part.text }] : []
  );
}

export function sanitizeMessages(messages: AskMrMessage[]): AskMrMessage[] | null {
  const cleaned = messages
    .filter((m) => m.role !== "system")
    .map((m) => ({ id: m.id, role: m.role, parts: textParts(m) }))
    .filter((m) => m.parts.length > 0);

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

async function consumeDailyBudget(): Promise<boolean> {
  const redis = getAskMrRedis();
  if (!redis) {
    return !isProduction;
  }
  try {
    const key = `${todayKey()}:requests`;
    const used = await redis.incr(key);
    if (used === 1) {
      await redis.expire(key, 60 * 60 * 48);
    }
    return used <= getEnv("ASK_MR_DAILY_BUDGET");
  } catch (error) {
    logger.error({ error: String(error) }, "Ask MR: budget check failed");
    return false;
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
    const result = await checkRateLimit(limiter, identifier).catch((error: unknown) => {
      logger.error({ error: String(error), limiter }, "Ask MR: rate limit check failed");
      return null;
    });
    if (!result) {
      return askMrErrorResponse("disabled");
    }
    if (!result.success) {
      const retryAfter = Math.max(1, Math.ceil((result.reset.getTime() - Date.now()) / 1000));
      return askMrErrorResponse("rate_limited", retryAfter);
    }
  }
  return null;
}

async function isBotRequest(): Promise<boolean> {
  try {
    // Verified crawlers count as bots too: nothing here is worth spending model tokens on for them.
    const verification = await checkBotId();
    return verification.isBot;
  } catch (error) {
    logger.error({ error: String(error) }, "Ask MR: BotID check failed");
    return true;
  }
}

export type GuardResult = { ok: true; body: AskMrChatRequest } | { ok: false; response: Response };

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
  const parsed = AskMrChatRequestSchema.safeParse(json);
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
