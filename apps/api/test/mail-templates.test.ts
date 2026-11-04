import { fixtureContent } from "@mrashidi/types/fixtures";
import { describe, expect, it } from "vitest";
import { mailBrand } from "#modules/mail/domain/outbound-email.ts";
import { renderEmail } from "#modules/mail/infrastructure/render-email.tsx";

const sampleContact = {
  name: "Jane Tester",
  email: "jane.tester@example.com",
  subject: "Project inquiry",
  message: "Hello,\nI'd like to discuss a backend role.",
};

const sampleResume = {
  name: "Alex Resume",
  email: "alex.cv@example.com",
  company: "Acme Labs",
};

describe("renderEmail", () => {
  const brand = mailBrand(fixtureContent.profile);

  it("renders contact-admin HTML with brand color, preview cue, and submission fields", async () => {
    const { html, text } = await renderEmail("contact-admin", sampleContact, brand);

    expect(html).toContain("#ff5f1f");
    expect(html).not.toContain("#ff6b35");
    expect(html).toContain("New website message");
    expect(html).toContain("Jane Tester");
    expect(html).toContain("jane.tester@example.com");
    expect(html).toContain("Project inquiry");

    expect(text.length).toBeGreaterThan(80);
    expect(text).toContain("Jane Tester");
  });

  it("renders contact-user HTML with acknowledgment and CTA target", async () => {
    const { html, text } = await renderEmail("contact-user", sampleContact, brand);

    expect(html).toContain("#ff5f1f");
    expect(html).toContain("Your message arrived");
    expect(html).toContain("Hi ");
    expect(html).toContain("Jane Tester");
    expect(html).toContain(brand.website);

    expect(text).toContain("Jane Tester");
    expect(text).toContain(brand.website);
  });

  it("keeps the visitor's subject and message out of the contact-user reply", async () => {
    const { html, text } = await renderEmail("contact-user", sampleContact, brand);

    for (const output of [html, text]) {
      expect(output).not.toContain(sampleContact.subject);
      expect(output).not.toContain(sampleContact.message);
    }
  });

  it("renders resume-admin HTML with company row and notice", async () => {
    const { html } = await renderEmail("resume-admin", sampleResume, brand);

    expect(html).toContain("#ff5f1f");
    expect(html).toContain("requested your CV");
    expect(html).toContain("Acme Labs");
    expect(html).toContain("Alex Resume");
  });

  it("renders resume-user HTML with the expiring download link", async () => {
    const cvUrl = "https://mrashidi.me/api/cv/download?token=123.abc";
    const { html, text } = await renderEmail("resume-user", { ...sampleResume, cvUrl }, brand);

    expect(html).toContain("#ff5f1f");
    expect(html).toContain(cvUrl);
    expect(html).toContain("24 hours");
    expect(html).toContain("Alex Resume");
    expect(html).toContain(brand.website);

    expect(text).toContain("Alex Resume");
  });

  it("loads Albert Sans with one stylesheet link instead of inlined @font-face blocks", async () => {
    const { html } = await renderEmail("contact-admin", sampleContact, brand);

    expect(html).toContain("fonts.googleapis.com/css2?family=Albert+Sans");
    expect(html).not.toContain("@font-face");
  });
});
