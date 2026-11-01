import { parseJsonEventStream, readUIMessageStream, type UIMessageChunk, uiMessageChunkSchema } from "ai";
import { logger } from "@/lib/core";
import type { AskMrFeedbackRating, AskMrUIMessage } from "../types";
import { recordDailyTokens } from "./guards";
import { getAskMrRedis } from "./redis";

const RETENTION_SECONDS = 60 * 60 * 24 * 30;
const MAX_ENTRIES_PER_CONVERSATION = 100;

interface AskMrExchangeLog {
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
async function logExchange(conversationId: string, entry: AskMrExchangeLog): Promise<void> {
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

export interface AnsweredQuestion {
  conversationId: string;
  page?: string;
  question: string;
}

async function finalMessage(body: ReadableStream<Uint8Array>): Promise<AskMrUIMessage | undefined> {
  const chunks = parseJsonEventStream({ stream: body, schema: uiMessageChunkSchema }).pipeThrough(
    new TransformStream<{ success: boolean; value?: UIMessageChunk }, UIMessageChunk>({
      transform(result, controller) {
        if (result.success && result.value) {
          controller.enqueue(result.value);
        }
      },
    })
  );
  let message: AskMrUIMessage | undefined;
  for await (const snapshot of readUIMessageStream<AskMrUIMessage>({ stream: chunks })) {
    message = snapshot;
  }
  return message;
}

/** Reads a copy of the streamed answer once it is done and logs it with the usage the API reports. */
export async function logAnsweredExchange(body: ReadableStream<Uint8Array>, asked: AnsweredQuestion): Promise<void> {
  try {
    const message = await finalMessage(body);
    const metadata = message?.metadata;
    const parts = message?.parts ?? [];
    await Promise.all([
      logExchange(asked.conversationId, {
        page: asked.page,
        question: asked.question,
        answer: parts.flatMap((part) => (part.type === "text" ? [part.text] : [])).join(""),
        tools: parts.flatMap((part) => (part.type.startsWith("tool-") ? [part.type.slice("tool-".length)] : [])),
        model: metadata?.model ?? "unknown",
        finishReason: metadata?.finishReason,
        inputTokens: metadata?.inputTokens,
        cachedInputTokens: metadata?.cachedInputTokens,
        outputTokens: metadata?.outputTokens,
      }),
      recordDailyTokens(metadata?.totalTokens),
    ]);
  } catch (error) {
    logger.error({ error: String(error) }, "Ask MR: failed to read the answer for logging");
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
