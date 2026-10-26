import { describe, expect, it } from "vitest";
import { getTemplateConfig } from "@/lib/services/email/config";
import { createEmailTemplate } from "@/lib/services/email/renderer";

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

describe("createEmailTemplate", () => {
  const config = getTemplateConfig();

  it("renders contact-admin HTML with brand color, preview cue, and submission fields", async () => {
    const { html, text } = await createEmailTemplate(sampleContact, "contact-admin", config);

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
    const { html, text } = await createEmailTemplate(sampleContact, "contact-user", config);

    expect(html).toContain("#ff5f1f");
    expect(html).toContain("Your message arrived");
    expect(html).toContain("Hi ");
    expect(html).toContain("Jane Tester");
    expect(html).toContain(config.companyWebsite);

    expect(text).toContain("Jane Tester");
    expect(text).toContain(config.companyWebsite);
  });

  it("renders resume-admin HTML with company row and notice", async () => {
    const { html } = await createEmailTemplate(sampleResume, "resume-admin", config);

    expect(html).toContain("#ff5f1f");
    expect(html).toContain("downloaded your CV");
    expect(html).toContain("Acme Labs");
    expect(html).toContain("Alex Resume");
  });

  it("renders resume-user HTML with confirmation copy", async () => {
    const { html, text } = await createEmailTemplate(sampleResume, "resume-user", config);

    expect(html).toContain("#ff5f1f");
    expect(html).toContain("Thanks for downloading");
    expect(html).toContain("Alex Resume");
    expect(html).toContain(config.companyWebsite);

    expect(text).toContain("Alex Resume");
  });

  it("throws for unknown template type", async () => {
    await expect(createEmailTemplate(sampleContact, "unknown-template", config)).rejects.toThrow(
      /Unknown template type/
    );
  });

  it("loads Albert Sans with one stylesheet link instead of inlined @font-face blocks", async () => {
    const { html } = await createEmailTemplate(sampleContact, "contact-admin", config);

    expect(html).toContain("fonts.googleapis.com/css2?family=Albert+Sans");
    expect(html).not.toContain("@font-face");
  });
});
