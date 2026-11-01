import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
  process.env.CV_LINK_SECRET = "test-secret-that-is-at-least-32-chars";
  return { sendResumeRequestEmail: vi.fn() };
});

vi.mock("@/lib/services/factory", () => ({
  getEmailService: () => ({ sendResumeRequestEmail: mocks.sendResumeRequestEmail }),
}));
vi.mock("@/lib/services/rate-limit", () => ({
  checkRateLimit: vi.fn().mockResolvedValue({ success: true, limit: 10, remaining: 9, reset: new Date() }),
  getClientIdentifier: () => "1.2.3.4",
}));

import { POST } from "@/app/api/resume/route";

const requestCv = (body: string) =>
  POST(
    new NextRequest("https://mrashidi.me/api/resume", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
    })
  );

describe("POST /api/resume", () => {
  beforeEach(() => {
    mocks.sendResumeRequestEmail.mockReset();
  });

  it("answers 400 with the failing fields for an invalid request and sends nothing", async () => {
    const response = await requestCv("{}");

    expect(response.status).toBe(400);
    expect(Object.keys((await response.json()).fields)).toEqual(expect.arrayContaining(["name", "email"]));
    expect(mocks.sendResumeRequestEmail).not.toHaveBeenCalled();
  });

  it("answers 400 for a body that is not JSON", async () => {
    const response = await requestCv("not json");

    expect(response.status).toBe(400);
    expect(mocks.sendResumeRequestEmail).not.toHaveBeenCalled();
  });

  it("emails a signed download link for a valid request", async () => {
    mocks.sendResumeRequestEmail.mockResolvedValue(true);

    const response = await requestCv(JSON.stringify({ name: "Ada Lovelace", email: "ada@example.com" }));

    expect(response.status).toBe(200);
    const [, cvUrl] = mocks.sendResumeRequestEmail.mock.calls[0];
    expect(new URL(cvUrl).searchParams.get("token")).toMatch(/^\d+\.[\w-]+$/);
  });
});
