import { beforeEach, describe, expect, it, vi } from "vitest";
import { NetworkError, ValidationError } from "@/lib/errors";
import { verifyRecaptcha } from "@/lib/services/recaptcha";

vi.mock("@/lib/core", async () => {
  const actual = await vi.importActual("@/lib/core");
  return {
    ...actual,
    getRequiredEnv: vi.fn(() => "test-secret-key"),
  };
});

vi.mock("@/lib/api/cors-allowlist", () => ({
  isSiteHostname: (hostname: string) => hostname === "mrashidi.me",
}));

global.fetch = vi.fn();

const verdict = (overrides: Record<string, unknown> = {}) =>
  ({
    ok: true,
    json: async () => ({
      success: true,
      score: 0.9,
      action: "contact",
      challenge_ts: "2024-01-01T00:00:00Z",
      hostname: "mrashidi.me",
      ...overrides,
    }),
  }) as Response;

describe("verifyRecaptcha", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("accepts a passing verdict for the expected action and site", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(verdict());

    await expect(verifyRecaptcha("valid-token", "contact")).resolves.toBeUndefined();
    expect(fetch).toHaveBeenCalledWith(
      "https://www.google.com/recaptcha/api/siteverify",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      })
    );
  });

  it("has no token that skips verification", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(verdict({ success: false }));

    await expect(verifyRecaptcha("no-recaptcha", "contact")).rejects.toThrow(ValidationError);
    expect(fetch).toHaveBeenCalledOnce();
  });

  it("rejects a token issued for another action", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(verdict({ action: "login" }));

    await expect(verifyRecaptcha("token", "contact")).rejects.toThrow(ValidationError);
  });

  it("rejects a token solved on another site", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(verdict({ hostname: "evil.example" }));

    await expect(verifyRecaptcha("token", "contact")).rejects.toThrow(ValidationError);
  });

  it("throws NetworkError when Google cannot be reached", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({ ok: false, status: 500 } as Response);

    await expect(verifyRecaptcha("token", "contact")).rejects.toThrow(NetworkError);
  });

  it("rejects a failed verification", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(verdict({ success: false }));

    await expect(verifyRecaptcha("invalid-token", "contact")).rejects.toThrow(ValidationError);
  });

  it("rejects a score below the threshold", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(verdict({ score: 0.3 }));

    await expect(verifyRecaptcha("low-score-token", "contact")).rejects.toThrow(ValidationError);
  });

  it("accepts a score at the threshold", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(verdict({ score: 0.5 }));

    await expect(verifyRecaptcha("threshold-token", "contact")).resolves.toBeUndefined();
  });

  it("form-encodes the token so it cannot add fields to the request", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(verdict());

    await verifyRecaptcha("abc&remoteip=1.2.3.4", "contact");

    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        body: "secret=test-secret-key&response=abc%26remoteip%3D1.2.3.4",
      })
    );
  });
});
