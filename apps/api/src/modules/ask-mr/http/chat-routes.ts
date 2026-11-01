import { AskMrChatRequestSchema } from "@mrashidi/types";
import { createUIMessageStreamResponse } from "ai";
import { type Context, Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import type { HonoEnv } from "#bindings";
import type { AskMrChat } from "../application/chat.ts";

export function chatRoutes(chat: (c: Context<HonoEnv>) => AskMrChat) {
  return new Hono<HonoEnv>().post("/ask-mr/chat", async (c) => {
    const parsed = AskMrChatRequestSchema.safeParse(await c.req.json().catch(() => null));
    if (!parsed.success) {
      throw new HTTPException(400, { message: "Invalid Ask MR chat request" });
    }
    const stream = await chat(c).answer(parsed.data, new Date());
    return createUIMessageStreamResponse({ stream, headers: { "Cache-Control": "no-store" } });
  });
}
