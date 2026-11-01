import { ContactMessageSchema, CvRequestSchema } from "@mrashidi/types";
import { type Context, Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import type { z } from "zod";
import type { HonoEnv } from "#bindings";
import type { MailCommands } from "../application/mail-commands.ts";

async function parseBody<T extends z.ZodType>(c: Context<HonoEnv>, schema: T, message: string): Promise<z.infer<T>> {
  const parsed = schema.safeParse(await c.req.json().catch(() => null));
  if (!parsed.success) {
    throw new HTTPException(400, { message });
  }
  return parsed.data;
}

export function mailRoutes(commands: (c: Context<HonoEnv>) => MailCommands) {
  return new Hono<HonoEnv>()
    .post("/mail/contact", async (c) => {
      await commands(c).sendContactMessage(await parseBody(c, ContactMessageSchema, "Invalid contact message"));
      return c.body(null, 202);
    })
    .post("/mail/cv-request", async (c) => {
      await commands(c).sendCvLink(await parseBody(c, CvRequestSchema, "Invalid CV request"));
      return c.body(null, 202);
    });
}
