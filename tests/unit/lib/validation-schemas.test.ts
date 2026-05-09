import { describe, expect, it } from "vitest";
import { ZodError } from "zod";
import {
  blogSearchSchema,
  contactFormSchema,
  projectFilterSchema,
  validateContactFormAPI,
  validateResumeRequestAPI,
} from "@/lib/validation/types";

describe("contactFormSchema", () => {
  const valid = {
    name: "Jane Doe",
    email: "Jane@Example.COM",
    subject: "Hello there",
    message: "1234567890",
  };

  it("parses and normalizes valid payload", () => {
    const data = contactFormSchema.parse(valid);
    expect(data.email).toBe("jane@example.com");
    expect(data.name).toBe("Jane Doe");
  });

  it("rejects invalid names and short fields", () => {
    expect(() =>
      contactFormSchema.parse({
        ...valid,
        name: "X",
      })
    ).toThrow(ZodError);
    expect(() =>
      contactFormSchema.parse({
        ...valid,
        message: "short",
      })
    ).toThrow(ZodError);
  });
});

describe("resumeRequestSchema", () => {
  it("allows optional company", () => {
    const data = validateResumeRequestAPI({
      name: "Jane Doe",
      email: "jane@example.com",
    });
    expect(data.company).toBeUndefined();
  });

  it("trims company when provided", () => {
    const data = validateResumeRequestAPI({
      name: "Jane Doe",
      email: "jane@example.com",
      company: "  Acme  ",
    });
    expect(data.company).toBe("Acme");
  });
});

describe("validateContactFormAPI", () => {
  it("requires recaptcha token", () => {
    expect(() =>
      validateContactFormAPI({
        name: "Jane Doe",
        email: "jane@example.com",
        subject: "Subject line",
        message: "1234567890",
      })
    ).toThrow(ZodError);

    expect(
      validateContactFormAPI({
        name: "Jane Doe",
        email: "jane@example.com",
        subject: "Subject line",
        message: "1234567890",
        recaptchaToken: "token",
      })
    ).toMatchObject({
      email: "jane@example.com",
      recaptchaToken: "token",
    });
  });
});

describe("blogSearchSchema", () => {
  it("applies defaults for page and limit", () => {
    const data = blogSearchSchema.parse({ query: "nextjs" });
    expect(data.page).toBe(1);
    expect(data.limit).toBe(10);
  });

  it("rejects empty query", () => {
    expect(() => blogSearchSchema.parse({ query: "" })).toThrow(ZodError);
  });
});

describe("projectFilterSchema", () => {
  it("fills defaults for optional fields", () => {
    const data = projectFilterSchema.parse({});
    expect(data).toEqual({
      search: "",
      stacks: undefined,
      openSourceOnly: undefined,
      type: "all",
    });
  });

  it("accepts typed filter payload", () => {
    const data = projectFilterSchema.parse({
      search: "api",
      stacks: ["TypeScript"],
      openSourceOnly: true,
      type: "client",
    });
    expect(data.type).toBe("client");
    expect(data.stacks).toEqual(["TypeScript"]);
  });
});
