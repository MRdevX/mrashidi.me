import { beforeEach, describe, expect, it, vi } from "vitest";
import { getEmailService, getGitHubService, serviceFactory } from "@/lib/services/factory";

vi.mock("@/lib/services/email", () => {
  class MockEmailService {
    sendContactFormEmail = vi.fn();
    sendResumeRequestEmail = vi.fn();
  }
  return {
    EmailService: MockEmailService,
  };
});

vi.mock("@/lib/services/github", () => {
  class MockGitHubService {
    getRepositories = vi.fn();
    getContributions = vi.fn();
  }
  return {
    GitHubService: MockGitHubService,
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

  describe("getGitHubService", () => {
    it("should return same instance on multiple calls", () => {
      const service1 = serviceFactory.getGitHubService();
      const service2 = serviceFactory.getGitHubService();
      expect(service1).toBe(service2);
    });

    it("should create new instance after reset", () => {
      const service1 = serviceFactory.getGitHubService();
      serviceFactory.reset();
      const service2 = serviceFactory.getGitHubService();
      expect(service1).not.toBe(service2);
    });
  });

  describe("reset", () => {
    it("should reset all services", () => {
      const emailService1 = serviceFactory.getEmailService();
      const githubService1 = serviceFactory.getGitHubService();

      serviceFactory.reset();

      const emailService2 = serviceFactory.getEmailService();
      const githubService2 = serviceFactory.getGitHubService();

      expect(emailService1).not.toBe(emailService2);
      expect(githubService1).not.toBe(githubService2);
    });
  });

  describe("getEmailService helper", () => {
    it("should return email service instance", () => {
      const service = getEmailService();
      expect(service).toBeDefined();
    });
  });

  describe("getGitHubService helper", () => {
    it("should return GitHub service instance", () => {
      const service = getGitHubService();
      expect(service).toBeDefined();
    });
  });
});
