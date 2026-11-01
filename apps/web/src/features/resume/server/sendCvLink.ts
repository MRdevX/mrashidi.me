import type { CvRequest } from "@mrashidi/types";
import { postContentApi } from "@/lib/content/server";
import { logger } from "@/lib/core";
import { APIError } from "@/lib/errors";

export async function sendCvLink(request: CvRequest): Promise<void> {
  const res = await postContentApi("/v1/mail/cv-request", request);
  if (!res) {
    throw new APIError("Email needs the content API (CONTENT_API_URL)", 503);
  }
  if (!res.ok) {
    logger.error({ operation: "sendCvLink", status: res.status });
    throw new APIError("Failed to send resume", 502);
  }
}
