import { describe, expect, it, vi } from "vitest";

vi.hoisted(() => {
  delete process.env.UPSTASH_REDIS_REST_URL;
  delete process.env.UPSTASH_REDIS_REST_TOKEN;
});

import { checkRateLimit } from "@/lib/services/rate-limit";

describe("rate limiting without Upstash", () => {
  it("falls back to in-memory limits instead of failing", async () => {
    const results = [];
    for (let i = 0; i < 11; i++) {
      results.push(await checkRateLimit("askMr", "fallback-test-ip"));
    }
    expect(results.slice(0, 10).every((r) => r.success)).toBe(true);
    expect(results[10].success).toBe(false);
  });
});
