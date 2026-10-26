import { hasToolCall, isStepCount, type ModelMessage, type SystemModelMessage } from "ai";
import { getEnv } from "@/lib/core";
import { ASK_MR_LIMITS, ASK_MR_TOOLS } from "../constants";
import { buildInstructions, buildKnowledgeBlock, buildPageContext } from "./systemPrompt";
import { askMrTools } from "./tools";

let cachedInstructions: SystemModelMessage | undefined;

// Static per deploy: rules + knowledge form the cached prompt prefix (Anthropic cache breakpoint).
function staticInstructions(): SystemModelMessage {
  cachedInstructions ??= {
    role: "system",
    content: `${buildInstructions()}\n\n${buildKnowledgeBlock()}`,
    providerOptions: { anthropic: { cacheControl: { type: "ephemeral" } } },
  };
  return cachedInstructions;
}

/**
 * Model, prompt, tools and limits for one Ask MR turn. Shared by `/api/chat` (streamText) and the
 * answer-quality eval (generateText) so both exercise exactly the production configuration.
 */
export function askMrCallOptions(messages: ModelMessage[], pathname?: string) {
  return {
    model: getEnv("ASK_MR_MODEL"),
    instructions: [staticInstructions(), { role: "system" as const, content: buildPageContext(pathname) }],
    messages,
    tools: askMrTools,
    stopWhen: [isStepCount(4), hasToolCall(ASK_MR_TOOLS.suggestFollowUps)],
    maxOutputTokens: ASK_MR_LIMITS.maxOutputTokens,
    temperature: 0.3,
  };
}
