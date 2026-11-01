import { CloudflareAIError, createAI } from "agents/models/ai-sdk";

const PRIMARY_MODEL = "@cf/zai-org/glm-4.7-flash";
const FALLBACK_MODEL = "@cf/qwen/qwen3-30b-a3b-fp8";

export function createWorkersAiModel(binding: Ai) {
  const ai = createAI({ binding });
  return (conversationId: string) =>
    ai(PRIMARY_MODEL, {
      fallback: [FALLBACK_MODEL],
      // Thinking off: "low" still spent ~400 reasoning tokens and ~10 s before the first word (DR-0014).
      reasoningEffort: null,
      // Pins a conversation to one replica so the shared prompt prefix stays in its cache.
      sessionAffinity: conversationId,
    });
}

/** Workers AI answers the daily neuron allocation and capacity limits as rate limits. */
export function isWorkersAiUnavailable(error: unknown): boolean {
  return error instanceof CloudflareAIError && error.code === "rate-limit";
}
