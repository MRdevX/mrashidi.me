import { beforeEach, describe, expect, it, vi } from "vitest";
import { checkRateLimit, getClientIdentifier } from "@/lib/services/rate-limit";

// The service only uses Redis when both Upstash variables are set (otherwise it falls back to memory).
vi.hoisted(() => {
  process.env.UPSTASH_REDIS_REST_URL = "https://example.upstash.io";
  process.env.UPSTASH_REDIS_REST_TOKEN = "test-token";
});

vi.mock("@upstash/ratelimit", () => {
  const mockLimit = vi.fn().mockResolvedValue({
    success: true,
    limit: 10,
    remaining: 5,
    reset: Date.now() + 60000,
  });

  class MockRatelimit {
    static slidingWindow = vi.fn(() => ({}));
    limit = mockLimit;
  }

  return {
    Ratelimit: MockRatelimit,
  };
});

vi.mock("@upstash/redis", () => ({
  Redis: class {},
}));

describe("Rate Limiting Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getClientIdentifier", () => {
    it("uses the address Vercel puts in x-real-ip", () => {
      const request = new Request("https://example.com", { headers: { "x-real-ip": "192.168.1.2" } });

      expect(getClientIdentifier(request)).toBe("192.168.1.2");
    });

    it("ignores client-supplied forwarding headers", () => {
      const request = new Request("https://example.com", {
        headers: {
          "x-forwarded-for": "6.6.6.6",
          "cf-connecting-ip": "7.7.7.7",
          "x-real-ip": "192.168.1.2",
        },
      });

      expect(getClientIdentifier(request)).toBe("192.168.1.2");
    });

    it("falls back to unknown without x-real-ip", () => {
      expect(getClientIdentifier(new Request("https://example.com"))).toBe("unknown");
    });
  });

  describe("checkRateLimit", () => {
    it("should return rate limit result", async () => {
      const result = await checkRateLimit("generalApi", "test-identifier");

      expect(result.success).toBe(true);
      expect(result.limit).toBe(10);
      expect(result.remaining).toBe(5);
      expect(result.reset).toBeInstanceOf(Date);
    });
  });
});
