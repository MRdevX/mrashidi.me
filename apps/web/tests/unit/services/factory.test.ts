import { describe, expect, it, vi } from "vitest";
import { getEmailService } from "@/lib/services/factory";

vi.mock("@/lib/services/email/service", () => {
  class MockEmailService {
    sendContactFormEmail = vi.fn();
    sendResumeRequestEmail = vi.fn();
  }
  return {
    EmailService: MockEmailService,
  };
});

describe("getEmailService", () => {
  it("returns the same instance on every call", () => {
    expect(getEmailService()).toBe(getEmailService());
  });
});
