import { z } from "zod";
import { askMrErrorResponse, checkLimits, logFeedback } from "@/features/ask-mr/server";

export const runtime = "nodejs";

const feedbackSchema = z.object({
  conversationId: z.uuid(),
  messageId: z.string().min(1).max(100),
  rating: z.enum(["up", "down"]),
});

export async function POST(request: Request): Promise<Response> {
  const limited = await checkLimits(request, ["askMrFeedback"]);
  if (limited) {
    return limited;
  }

  const parsed = feedbackSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return askMrErrorResponse("invalid");
  }

  const { conversationId, messageId, rating } = parsed.data;
  await logFeedback(conversationId, messageId, rating);
  return new Response(null, { status: 204, headers: { "Cache-Control": "no-store" } });
}
