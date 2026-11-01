import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
  process.env.CV_LINK_SECRET = "test-secret-that-is-at-least-32-chars";
  return { get: vi.fn() };
});

vi.mock("@vercel/blob", () => ({ get: mocks.get, put: vi.fn() }));
vi.mock("@/lib/services/rate-limit", () => ({
  checkRateLimit: vi.fn().mockResolvedValue({ success: true, limit: 10, remaining: 9, reset: new Date() }),
  getClientIdentifier: () => "1.2.3.4",
}));

import { GET } from "@/app/api/cv/download/route";
import { CV_LINK_TTL_MS, createCvLink, createCvToken, verifyCvToken } from "@/features/resume/server/cvLink";

const download = (token?: string) => {
  const url = new URL("https://mrashidi.me/api/cv/download");
  if (token) {
    url.searchParams.set("token", token);
  }
  return GET(new NextRequest(url));
};

describe("CV link token", () => {
  const now = Date.UTC(2026, 10, 1);

  it("accepts a token it signed within the 24h window", () => {
    expect(verifyCvToken(createCvToken(now), now + CV_LINK_TTL_MS - 1)).toEqual({ ok: true });
  });

  it("rejects a token after the 24h window as expired", () => {
    expect(verifyCvToken(createCvToken(now), now + CV_LINK_TTL_MS + 1)).toEqual({ ok: false, reason: "expired" });
  });

  it("rejects a token whose expiry was pushed forward", () => {
    const [expiresAt, signature] = createCvToken(now).split(".");
    const tampered = `${Number(expiresAt) + CV_LINK_TTL_MS}.${signature}`;
    expect(verifyCvToken(tampered, now)).toEqual({ ok: false, reason: "invalid" });
  });

  it("rejects missing and malformed tokens", () => {
    for (const token of [null, "", "abc", "123", "123.", "x.y", "1.2.3"]) {
      expect(verifyCvToken(token, now)).toEqual({ ok: false, reason: "invalid" });
    }
  });

  it("builds a link to the download route carrying the token", () => {
    const link = new URL(createCvLink(now));
    expect(link.pathname).toBe("/api/cv/download");
    expect(verifyCvToken(link.searchParams.get("token"), now)).toEqual({ ok: true });
  });
});

describe("GET /api/cv/download", () => {
  beforeEach(() => {
    mocks.get.mockReset();
  });

  it("refuses requests without a token and never reads the blob", async () => {
    const response = await download();
    expect(response.status).toBe(403);
    expect(mocks.get).not.toHaveBeenCalled();
  });

  it("answers 410 for an expired link", async () => {
    const response = await download(createCvToken(Date.now() - CV_LINK_TTL_MS - 1000));
    expect(response.status).toBe(410);
    expect(mocks.get).not.toHaveBeenCalled();
  });

  it("streams the private CV as an uncached attachment for a valid link", async () => {
    mocks.get.mockResolvedValue({ statusCode: 200, stream: new Response("%PDF-1.4").body });

    const response = await download(createCvToken(Date.now()));

    expect(response.status).toBe(200);
    expect(mocks.get).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({ access: "private" }));
    expect(response.headers.get("content-type")).toBe("application/pdf");
    expect(response.headers.get("content-disposition")).toMatch(/^attachment;/);
    expect(response.headers.get("cache-control")).toBe("private, no-store");
    expect(response.headers.get("x-robots-tag")).toContain("noindex");
    expect(await response.text()).toBe("%PDF-1.4");
  });
});
