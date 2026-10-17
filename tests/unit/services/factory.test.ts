import { beforeEach, describe, expect, it, vi } from "vitest";
import { serviceFactory } from "@/lib/services/factory";

vi.mock("@/lib/services/email", () => {
  class MockEmailService {
    sendContactFormEmail = vi.fn();
    sendResumeRequestEmail = vi.fn();
  }
  return {
    EmailService: MockEmailService,
  };
});

describe("Service Factory", () => {
  beforeEach(() => {
    serviceFactory.reset();
  });

  describe("getEmailService", () => {
    it("should return same instance on multiple calls", () => {
      const service1 = serviceFactory.getEmailService();
      const service2 = serviceFactory.getEmailService();
      expect(service1).toBe(service2);
    });

    it("should create new instance after reset", () => {
      const service1 = serviceFactory.getEmailService();
      serviceFactory.reset();
      const service2 = serviceFactory.getEmailService();
      expect(service1).not.toBe(service2);
    });
  });
});
