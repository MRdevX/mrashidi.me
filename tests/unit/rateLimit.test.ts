import { describe, it, expect, vi, beforeEach } from "vitest";
import { getClientIdentifier, checkRateLimit } from "@/server/rateLimit.service";

vi.mock("@upstash/ratelimit", () => ({
  Ratelimit: {
    slidingWindow: vi.fn(() => ({
      limit: vi.fn(),
    })),
  },
}));

vi.mock("@upstash/redis", () => ({
  Redis: {
    fromEnv: vi.fn(() => ({})),
  },
}));

describe("Rate Limiting Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getClientIdentifier", () => {
    it("should extract IP from x-forwarded-for header", () => {
      const request = new Request("https://example.com", {
        headers: {
          "x-forwarded-for": "192.168.1.1, 10.0.0.1",
        },
      });

      const identifier = getClientIdentifier(request);
      expect(identifier).toBe("192.168.1.1");
    });

    it("should extract IP from x-real-ip header", () => {
      const request = new Request("https://example.com", {
        headers: {
          "x-real-ip": "192.168.1.2",
        },
      });

      const identifier = getClientIdentifier(request);
      expect(identifier).toBe("192.168.1.2");
    });

    it("should extract IP from cf-connecting-ip header", () => {
      const request = new Request("https://example.com", {
        headers: {
          "cf-connecting-ip": "192.168.1.3",
        },
      });

      const identifier = getClientIdentifier(request);
      expect(identifier).toBe("192.168.1.3");
    });

    it("should fallback to unknown when no IP headers are present", () => {
      const request = new Request("https://example.com");

      const identifier = getClientIdentifier(request);
      expect(identifier).toBe("unknown");
    });

    it("should prioritize x-forwarded-for over other headers", () => {
      const request = new Request("https://example.com", {
        headers: {
          "x-forwarded-for": "192.168.1.1",
          "x-real-ip": "192.168.1.2",
          "cf-connecting-ip": "192.168.1.3",
        },
      });

      const identifier = getClientIdentifier(request);
      expect(identifier).toBe("192.168.1.1");
    });
  });

  describe("checkRateLimit", () => {
    it("should return rate limit result", async () => {
      const mockLimit = vi.fn().mockResolvedValue({
        success: true,
        limit: 10,
        remaining: 5,
        reset: Date.now() + 60000,
      });

      vi.doMock("@/server/rateLimit.service", async () => {
        const actual = await vi.importActual("@/server/rateLimit.service");
        return {
          ...actual,
          rateLimiters: {
            generalApi: {
              limit: mockLimit,
            },
          },
        };
      });

      const result = await checkRateLimit("generalApi", "test-identifier");

      expect(result.success).toBe(true);
      expect(result.limit).toBe(10);
      expect(result.remaining).toBe(5);
      expect(result.reset).toBeInstanceOf(Date);
    });
  });
});
