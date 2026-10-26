import { logger } from "@/lib/core";
import type { AskMrFeedbackRating } from "../types";
import { getAskMrRedis } from "./redis";

const RETENTION_SECONDS = 60 * 60 * 24 * 30;
const MAX_ENTRIES_PER_CONVERSATION = 100;

export interface AskMrExchangeLog {
  page?: string;
  question: string;
  answer: string;
  tools: string[];
  model: string;
  finishReason?: string;
  inputTokens?: number;
  cachedInputTokens?: number;
  outputTokens?: number;
}

/**
 * Stores one question/answer pair so the site owner can spot knowledge gaps. Anonymous by design:
 * no IP, user agent or other identifiers — only a random per-tab conversation id. Kept 30 days.
 */
export async function logExchange(conversationId: string, entry: AskMrExchangeLog): Promise<void> {
  const redis = getAskMrRedis();
  if (!redis) {
    return;
  }
  const key = `askmr:conv:${conversationId}`;
  try {
    await redis.rpush(key, JSON.stringify({ ts: new Date().toISOString(), ...entry }));
    await redis.ltrim(key, -MAX_ENTRIES_PER_CONVERSATION, -1);
    await redis.expire(key, RETENTION_SECONDS);
  } catch (error) {
    logger.error({ error: String(error) }, "Ask MR: failed to log exchange");
  }
}

export async function logFeedback(
  conversationId: string,
  messageId: string,
  rating: AskMrFeedbackRating
): Promise<void> {
  const redis = getAskMrRedis();
  if (!redis) {
    return;
  }
  try {
    const key = `askmr:fb:${conversationId}`;
    await redis.hset(key, { [messageId]: rating });
    await redis.expire(key, RETENTION_SECONDS);
  } catch (error) {
    logger.error({ error: String(error) }, "Ask MR: failed to log feedback");
  }
}
