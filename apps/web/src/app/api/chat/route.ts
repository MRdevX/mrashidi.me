import { UI_MESSAGE_STREAM_HEADERS } from "ai";
import { after } from "next/server";
import { askMrErrorResponse, guardChatRequest, logAnsweredExchange, messageText } from "@/features/ask-mr/server";
import { postAskMrChat } from "@/lib/content/server";
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
    const upstream = await postAskMrChat({ messages, conversationId, pathname }, request.signal);
    if (!upstream) {
      return askMrErrorResponse("disabled");
    }
    if (!upstream.ok || !upstream.body) {
      logError(handleError(new Error(`Ask MR API answered ${upstream.status}`)), "AskMR.route");
      return askMrErrorResponse("server");
    }

    const [forVisitor, forLog] = upstream.body.tee();
    after(() => logAnsweredExchange(forLog, { conversationId, page: pathname, question }));

    return new Response(forVisitor, {
      headers: { ...UI_MESSAGE_STREAM_HEADERS, "cache-control": "no-store", "X-Content-Type-Options": "nosniff" },
    });
  } catch (error) {
    logError(handleError(error), "AskMR.route");
    return askMrErrorResponse("server");
  }
}
