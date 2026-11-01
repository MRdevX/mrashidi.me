import {
  ASK_MR_ERROR_MESSAGES,
  type AskMrChatRequest,
  type AskMrErrorBody,
  type AskMrErrorCode,
  type AskMrMessageMetadata,
} from "@mrashidi/types";
import {
  convertToModelMessages,
  hasToolCall,
  isStepCount,
  type LanguageModel,
  streamText,
  toUIMessageStream,
  type UIMessage,
} from "ai";
import type { BlogQueries } from "#modules/blog/application/blog-queries.ts";
import type { ProfileQueries } from "#modules/profile/index.ts";
import type { ProjectQueries } from "#modules/projects/index.ts";
import { ASK_MR_TOOLS, buildInstructions, buildKnowledgeBlock, buildPageContext } from "../domain/instructions.ts";
import type { KnowledgeQueries } from "./knowledge-queries.ts";
import { createAskMrTools } from "./tools.ts";

const MAX_STEPS = 4;
// Reasoning tokens count toward the limit, so it sits above the 2–5 sentence answers it allows.
const MAX_OUTPUT_TOKENS = 1000;

export interface AskMrChatDependencies {
  model: (conversationId: string) => LanguageModel;
  isUnavailable: (error: unknown) => boolean;
  profile: ProfileQueries;
  projects: ProjectQueries;
  knowledge: KnowledgeQueries;
  blog: BlogQueries;
}

export function createAskMrChat({ model, isUnavailable, profile, projects, knowledge, blog }: AskMrChatDependencies) {
  const errorText = (error: unknown) => {
    const code: AskMrErrorCode = isUnavailable(error) ? "budget_exhausted" : "server";
    if (code === "server") {
      console.error("Ask MR: model call failed", error);
    }
    const body: AskMrErrorBody = { error: code, message: ASK_MR_ERROR_MESSAGES[code] };
    return JSON.stringify(body);
  };

  return {
    async answer({ messages, conversationId, pathname }: AskMrChatRequest, now: Date) {
      const [person, entries, { context }] = await Promise.all([
        profile.profile(),
        projects.list(),
        knowledge.context(now),
      ]);
      const tools = createAskMrTools({
        profile: person,
        projects: entries,
        latestPosts: async (limit) =>
          (await blog.page(1, limit)).posts.map(({ title, url, publishedAt }) => ({ title, url, publishedAt })),
      });

      const result = streamText({
        model: model(conversationId),
        instructions: [
          // Rules + knowledge first: identical across requests, so Workers AI's prefix cache can reuse them.
          { role: "system", content: `${buildInstructions(person)}\n\n${buildKnowledgeBlock(person, context)}` },
          { role: "system", content: buildPageContext(person, pathname) },
        ],
        messages: await convertToModelMessages(messages as UIMessage[], { tools, ignoreIncompleteToolCalls: true }),
        tools,
        // The contact and CV cards end the turn: another step only repeats the text above the card.
        stopWhen: [
          isStepCount(MAX_STEPS),
          hasToolCall(ASK_MR_TOOLS.suggestFollowUps),
          hasToolCall(ASK_MR_TOOLS.contactHandoff),
          hasToolCall(ASK_MR_TOOLS.requestCv),
        ],
        maxOutputTokens: MAX_OUTPUT_TOKENS,
        temperature: 0.2,
        // The Workers AI fallback model covers capacity errors; retrying a spent daily quota only delays the answer.
        maxRetries: 0,
      });

      let answeredBy = "";
      return toUIMessageStream({
        stream: result.stream,
        tools,
        sendReasoning: false,
        onError: errorText,
        messageMetadata: ({ part }): AskMrMessageMetadata | undefined => {
          if (part.type === "finish-step") {
            answeredBy = part.response.modelId;
          }
          if (part.type !== "finish") {
            return undefined;
          }
          return {
            model: answeredBy,
            finishReason: part.finishReason,
            inputTokens: part.totalUsage.inputTokens,
            cachedInputTokens: part.totalUsage.inputTokenDetails?.cacheReadTokens,
            outputTokens: part.totalUsage.outputTokens,
            totalTokens: part.totalUsage.totalTokens,
          };
        },
      });
    },
  };
}

export type AskMrChat = ReturnType<typeof createAskMrChat>;
