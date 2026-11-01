import { createExecutionContext, waitOnExecutionContext } from "cloudflare:test";
import { env } from "cloudflare:workers";
import { fixtureContent } from "@mrashidi/types/fixtures";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createApp } from "#app";
import { createResendMailer, MailDeliveryError, type Mailer } from "#modules/mail/index.ts";

type Batch = Parameters<Mailer["send"]>[0];

const contact = {
  name: "Jane Doe",
  email: "Visitor@Example.com",
  subject: "Project inquiry",
  message: "I would like to talk about a project.",
};

const cvRequest = {
  name: "Jane Doe",
  email: "visitor@example.com",
  company: "Acme",
  cvUrl: "https://mrashidi.me/api/cv/download?token=abc",
};

function recordingMailer() {
  const batches: Batch[] = [];
  return { batches, mailer: { send: async (batch: Batch) => void batches.push(batch) } };
}

async function post(mailer: Mailer, path: string, payload: unknown, token = "test-token") {
  const app = createApp({ askMrModel: () => () => undefined as never, mailer: () => mailer });
  const ctx = createExecutionContext();
  const res = await app.request(
    `/v1/mail/${path}`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "content-type": "application/json" },
      body: JSON.stringify(payload),
    },
    env,
    ctx
  );
  await waitOnExecutionContext(ctx);
  return res;
}

describe("POST /v1/mail/contact", () => {
  it("sends the owner and the visitor one batch, with replies going to the visitor", async () => {
    const { batches, mailer } = recordingMailer();

    const res = await post(mailer, "contact", contact);

    expect(res.status).toBe(202);
    expect(batches).toHaveLength(1);
    const [owner, visitor] = batches[0].emails;
    expect(owner).toMatchObject({ to: env.MAIL_TO, replyTo: "visitor@example.com", template: "contact-admin" });
    expect(visitor).toMatchObject({ to: "visitor@example.com", template: "contact-user" });
    expect(visitor.replyTo).toBeUndefined();
    expect(batches[0].brand.name).toBe(fixtureContent.profile.person.name);
  });

  it("gives an identical resubmission the same idempotency key", async () => {
    const { batches, mailer } = recordingMailer();

    await post(mailer, "contact", contact);
    await post(mailer, "contact", contact);
    await post(mailer, "contact", { ...contact, message: "A different message entirely." });

    expect(batches[0].idempotencyKey).toBe(batches[1].idempotencyKey);
    expect(batches[2].idempotencyKey).not.toBe(batches[0].idempotencyKey);
  });

  it("rejects an invalid message without sending", async () => {
    const { batches, mailer } = recordingMailer();

    const res = await post(mailer, "contact", { ...contact, email: "not-an-email" });

    expect(res.status).toBe(400);
    expect(batches).toHaveLength(0);
  });

  it("requires the content token", async () => {
    const { batches, mailer } = recordingMailer();

    const res = await post(mailer, "contact", contact, "wrong-token");

    expect(res.status).toBe(401);
    expect(batches).toHaveLength(0);
  });

  it("answers 502 when delivery fails", async () => {
    const failing: Mailer = {
      send: async () => {
        throw new MailDeliveryError(422, "validation_error: domain not verified");
      },
    };
    vi.spyOn(console, "error").mockImplementation(() => {});

    const res = await post(failing, "contact", contact);

    expect(res.status).toBe(502);
    expect(await res.json()).toEqual({ error: "Mail delivery failed" });
  });
});

describe("POST /v1/mail/cv-request", () => {
  it("sends the visitor the CV link and tells the owner who asked", async () => {
    const { batches, mailer } = recordingMailer();

    const res = await post(mailer, "cv-request", cvRequest);

    expect(res.status).toBe(202);
    const [owner, visitor] = batches[0].emails;
    expect(owner).toMatchObject({ to: env.MAIL_TO, replyTo: cvRequest.email, template: "resume-admin" });
    expect(visitor).toMatchObject({ to: cvRequest.email, template: "resume-user", data: { cvUrl: cvRequest.cvUrl } });
  });

  it("rejects a request without an http link", async () => {
    const { batches, mailer } = recordingMailer();

    const res = await post(mailer, "cv-request", { ...cvRequest, cvUrl: "javascript:alert(1)" });

    expect(res.status).toBe(400);
    expect(batches).toHaveLength(0);
  });
});

describe("Resend mailer", () => {
  const brand = {
    name: "Jane Doe",
    website: "https://example.com",
    tagline: "Engineer",
    social: { github: "https://github.com/x", linkedin: "https://linkedin.com/in/x", telegram: "https://t.me/x" },
  };
  const emails = [
    {
      to: "owner@example.com",
      subject: "CV Request from Jane",
      replyTo: "visitor@example.com",
      template: "resume-admin" as const,
      data: cvRequest,
    },
    { to: "visitor@example.com", subject: "Your CV", template: "resume-user" as const, data: cvRequest },
  ];

  afterEach(() => vi.restoreAllMocks());

  it("sends every email in one batch call with the idempotency key", async () => {
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(Response.json({ data: [{ id: "1" }, { id: "2" }] }));
    const mailer = createResendMailer({ token: "re_test", from: "no-reply@example.com" });

    await mailer.send({ emails, brand, idempotencyKey: "cv-request/abc" });

    expect(fetchSpy).toHaveBeenCalledOnce();
    const [url, init] = fetchSpy.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://api.resend.com/emails/batch");
    expect(init.headers).toMatchObject({ Authorization: "Bearer re_test", "Idempotency-Key": "cv-request/abc" });
    const payload = JSON.parse(init.body as string);
    expect(payload).toHaveLength(2);
    expect(payload[0]).toMatchObject({
      from: "Jane Doe <no-reply@example.com>",
      to: ["owner@example.com"],
      reply_to: "visitor@example.com",
    });
    expect(payload[1].reply_to).toBeUndefined();
    expect(payload[1].html).toContain(cvRequest.cvUrl.replace("&", "&amp;"));
    expect(payload[1].text).toContain("Download CV");
  });

  it("throws MailDeliveryError with Resend's reason on a failed call", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      Response.json(
        { statusCode: 403, name: "validation_error", message: "The domain is not verified" },
        { status: 403 }
      )
    );
    const mailer = createResendMailer({ token: "re_test", from: "no-reply@example.com" });

    const sending = mailer.send({ emails, brand, idempotencyKey: "k" });

    await expect(sending).rejects.toBeInstanceOf(MailDeliveryError);
    await expect(sending).rejects.toMatchObject({
      status: 403,
      reason: "validation_error: The domain is not verified",
    });
  });
});
