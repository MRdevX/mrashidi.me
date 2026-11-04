import { describe, expect, it, vi } from "vitest";

vi.hoisted(() => {
  delete process.env.UPSTASH_REDIS_REST_URL;
  delete process.env.UPSTASH_REDIS_REST_TOKEN;
});

vi.mock("@/lib/core", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/core")>();
  return { ...actual, isProduction: true };
});

import { APIError } from "@/lib/errors";
import { checkRateLimit } from "@/lib/services/rate-limit";

describe("rate limiting in production without Upstash", () => {
  it.each(["contactForm", "resumeRequest", "mailRecipient", "askMr", "askMrDaily"] as const)(
    "refuses %s, which spends money, instead of counting per instance",
    async (limiter) => {
      await expect(checkRateLimit(limiter, "1.2.3.4")).rejects.toThrow(APIError);
    }
  );

  it("still serves free routes from the in-memory fallback", async () => {
    await expect(checkRateLimit("generalApi", "1.2.3.4")).resolves.toMatchObject({ success: true });
  });
});
