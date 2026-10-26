import { hasToolCall, isStepCount, type ModelMessage, type SystemModelMessage } from "ai";
import type { AskMrContent } from "@/lib/content";
import { getEnv } from "@/lib/core";
import { ASK_MR_LIMITS, ASK_MR_TOOLS } from "../constants";
import { buildInstructions, buildKnowledgeBlock, buildPageContext } from "./systemPrompt";
import { createAskMrTools } from "./tools";

// Rules + knowledge form the cached prompt prefix (Anthropic cache breakpoint); the text only
// changes when the content is reseeded, so consecutive requests hit the provider cache.
function staticInstructions(content: AskMrContent): SystemModelMessage {
  return {
    role: "system",
    content: `${buildInstructions(content.profile)}\n\n${buildKnowledgeBlock(content)}`,
    providerOptions: { anthropic: { cacheControl: { type: "ephemeral" } } },
  };
}

/**
 * Model, prompt, tools and limits for one Ask MR turn. Shared by `/api/chat` (streamText) and the
 * answer-quality eval (generateText) so both exercise exactly the production configuration.
 */
export function askMrCallOptions(content: AskMrContent, messages: ModelMessage[], pathname?: string) {
  return {
    model: getEnv("ASK_MR_MODEL"),
    instructions: [
      staticInstructions(content),
      { role: "system" as const, content: buildPageContext(content.profile, pathname) },
    ],
    messages,
    tools: createAskMrTools(content),
    stopWhen: [isStepCount(4), hasToolCall(ASK_MR_TOOLS.suggestFollowUps)],
    maxOutputTokens: ASK_MR_LIMITS.maxOutputTokens,
    temperature: 0.3,
  };
}
