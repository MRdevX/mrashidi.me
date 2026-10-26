import { convertToModelMessages, createUIMessageStreamResponse, streamText, toUIMessageStream } from "ai";
import {
  askMrCallOptions,
  askMrErrorResponse,
  createAskMrTools,
  guardChatRequest,
  logExchange,
  messageText,
  recordDailyTokens,
} from "@/features/ask-mr/server";
import { getAskMrContent } from "@/lib/content/server";
import { handleError, logError } from "@/lib/errors";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(request: Request): Promise<Response> {
  const guard = await guardChatRequest(request);
  if (!guard.ok) {
    return guard.response;
  }

  const { messages, conversationId, pathname } = guard.body;
  const question = messageText(messages.at(-1) ?? { parts: [] });

  try {
    const content = await getAskMrContent();
    const tools = createAskMrTools(content);
    const modelMessages = await convertToModelMessages(messages, {
      tools,
      ignoreIncompleteToolCalls: true,
    });
    const options = askMrCallOptions(content, modelMessages, pathname);
    const result = streamText({
      ...options,
      abortSignal: request.signal,
      onError: ({ error }) => logError(handleError(error), "AskMR.stream"),
      onEnd: async ({ steps, totalUsage, finishReason }) => {
        await Promise.all([
          logExchange(conversationId, {
            page: pathname,
            question,
            answer: steps.map((step) => step.text).join(""),
            tools: steps.flatMap((step) => step.toolCalls.map((call) => call.toolName)),
            model: options.model,
            finishReason,
            inputTokens: totalUsage.inputTokens,
            cachedInputTokens: totalUsage.inputTokenDetails?.cacheReadTokens,
            outputTokens: totalUsage.outputTokens,
          }),
          recordDailyTokens(totalUsage.totalTokens),
        ]);
      },
    });

    return createUIMessageStreamResponse({
      stream: toUIMessageStream({
        stream: result.stream,
        tools,
        sendReasoning: false,
        // Never forward provider/model error details to the browser.
        onError: () => "Ask MR hit a snag. Please try again.",
      }),
      headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" },
    });
  } catch (error) {
    logError(handleError(error), "AskMR.route");
    return askMrErrorResponse("server");
  }
}
