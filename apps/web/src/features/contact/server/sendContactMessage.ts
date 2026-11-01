import type { ContactMessage } from "@mrashidi/types";
import { postContentApi } from "@/lib/content/server";
import { logger } from "@/lib/core";
import { APIError } from "@/lib/errors";

export async function sendContactMessage(message: ContactMessage): Promise<void> {
  const res = await postContentApi("/v1/mail/contact", message);
  if (!res) {
    throw new APIError("Email needs the content API (CONTENT_API_URL)", 503);
  }
  if (!res.ok) {
    logger.error({ operation: "sendContactMessage", status: res.status });
    throw new APIError("Failed to send email", 502);
  }
}
