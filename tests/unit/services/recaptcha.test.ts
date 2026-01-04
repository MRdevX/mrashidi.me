import { beforeEach, describe, expect, it, vi } from "vitest";
import { NetworkError, ValidationError } from "@/lib/errors";
import { verifyRecaptcha } from "@/lib/services/recaptcha";

vi.mock("@/lib/core", async () => {
  const actual = await vi.importActual("@/lib/core");
  return {
    ...actual,
    getRequiredEnv: vi.fn(() => "test-secret-key"),
    logger: {
      warn: vi.fn(),
    },
  };
});

global.fetch = vi.fn();

describe("reCAPTCHA Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("verifyRecaptcha", () => {
    it("should return true for fallback mode", async () => {
      const result = await verifyRecaptcha("no-recaptcha");
      expect(result).toBe(true);
    });

    it("should verify valid token successfully", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          score: 0.9,
          action: "submit",
          challenge_ts: "2024-01-01T00:00:00Z",
          hostname: "example.com",
        }),
      } as Response);

      const result = await verifyRecaptcha("valid-token");
      expect(result).toBe(true);
      expect(fetch).toHaveBeenCalledWith(
        "https://www.google.com/recaptcha/api/siteverify",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        })
      );
    });

    it("should throw NetworkError when fetch fails", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 500,
      } as Response);

      await expect(verifyRecaptcha("token")).rejects.toThrow(NetworkError);
    });

    it("should throw ValidationError when verification fails", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: false,
          "error-codes": ["invalid-input-response"],
        }),
      } as Response);

      await expect(verifyRecaptcha("invalid-token")).rejects.toThrow(ValidationError);
    });

    it("should throw ValidationError when score is below threshold", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          score: 0.3,
          action: "submit",
          challenge_ts: "2024-01-01T00:00:00Z",
          hostname: "example.com",
        }),
      } as Response);

      await expect(verifyRecaptcha("low-score-token")).rejects.toThrow(ValidationError);
    });

    it("should accept score at threshold", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          score: 0.5,
          action: "submit",
          challenge_ts: "2024-01-01T00:00:00Z",
          hostname: "example.com",
        }),
      } as Response);

      const result = await verifyRecaptcha("threshold-token");
      expect(result).toBe(true);
    });

    it("should send correct request body", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          score: 0.9,
          action: "submit",
          challenge_ts: "2024-01-01T00:00:00Z",
          hostname: "example.com",
        }),
      } as Response);

      await verifyRecaptcha("test-token");

      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: "secret=test-secret-key&response=test-token",
        })
      );
    });
  });
});
