import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  postContentApi: vi.fn(),
  verifyRecaptcha: vi.fn(),
}));

vi.mock("@/lib/content/server", () => ({ postContentApi: mocks.postContentApi }));
vi.mock("@/lib/services/recaptcha", () => ({ verifyRecaptcha: mocks.verifyRecaptcha }));
vi.mock("@/lib/services/rate-limit", () => ({
  checkRateLimit: vi
    .fn()
    .mockResolvedValue({ success: true, limit: 5, remaining: 4, reset: new Date(Date.now() + 60_000) }),
  getClientIdentifier: () => "1.2.3.4",
}));
vi.mock("@/features/resume/server/cvLink", () => ({
  createCvLink: () => "https://mrashidi.me/api/cv/download?token=signed",
}));

import { NextRequest } from "next/server";
import { POST as postContact } from "@/app/api/contact/route";
import { POST as postResume } from "@/app/api/resume/route";

const message = {
  name: "Jane Doe",
  email: "jane@example.com",
  subject: "Project inquiry",
  message: "I would like to talk about a project.",
};

const request = (path: string, body: unknown) =>
  new NextRequest(`https://mrashidi.me${path}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });

beforeEach(() => {
  mocks.postContentApi.mockReset();
  mocks.verifyRecaptcha.mockReset().mockResolvedValue(undefined);
});

describe("POST /api/contact", () => {
  it("forwards the message to the API mail route without the reCAPTCHA token", async () => {
    mocks.postContentApi.mockResolvedValue(new Response(null, { status: 202 }));

    const res = await postContact(request("/api/contact", { ...message, recaptchaToken: "token" }));

    expect(res.status).toBe(200);
    expect(mocks.verifyRecaptcha).toHaveBeenCalledWith("token");
    expect(mocks.postContentApi).toHaveBeenCalledWith("/v1/mail/contact", message);
  });

  it("answers 502 when the API could not deliver the mail", async () => {
    mocks.postContentApi.mockResolvedValue(new Response(null, { status: 502 }));

    const res = await postContact(request("/api/contact", { ...message, recaptchaToken: "token" }));

    expect(res.status).toBe(502);
  });

  it("answers 503 without a content API", async () => {
    mocks.postContentApi.mockResolvedValue(null);

    const res = await postContact(request("/api/contact", { ...message, recaptchaToken: "token" }));

    expect(res.status).toBe(503);
  });

  it("sends nothing when reCAPTCHA fails", async () => {
    mocks.verifyRecaptcha.mockRejectedValue(new Error("low score"));

    const res = await postContact(request("/api/contact", { ...message, recaptchaToken: "token" }));

    expect(res.status).toBe(400);
    expect(mocks.postContentApi).not.toHaveBeenCalled();
  });
});

describe("POST /api/resume", () => {
  it("sends the API a freshly signed CV link", async () => {
    mocks.postContentApi.mockResolvedValue(new Response(null, { status: 202 }));

    const res = await postResume(request("/api/resume", { name: "Jane Doe", email: "jane@example.com" }));

    expect(res.status).toBe(200);
    expect(mocks.postContentApi).toHaveBeenCalledWith("/v1/mail/cv-request", {
      name: "Jane Doe",
      email: "jane@example.com",
      cvUrl: "https://mrashidi.me/api/cv/download?token=signed",
    });
  });
});
