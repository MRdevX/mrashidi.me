import { beforeEach, describe, expect, it, vi } from "vitest";
import { APIError, AppError, NetworkError, ValidationError } from "@/lib/errors";

vi.mock("@/lib/core", () => ({
  isDevelopment: false,
}));

describe("Error Classes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("AppError", () => {
    it("should create AppError with default values", () => {
      const error = new AppError("Test error");
      expect(error.message).toBe("An unexpected error occurred");
      expect(error.statusCode).toBe(500);
      expect(error.errorType).toBe("DEFAULT");
      expect(error.originalMessage).toBe("Test error");
    });

    it("should create AppError with custom status code", () => {
      const error = new AppError("Test error", 404);
      expect(error.statusCode).toBe(404);
    });

    it("should create AppError with custom error type", () => {
      const error = new AppError("Test error", 400, "VALIDATION");
      expect(error.errorType).toBe("VALIDATION");
    });

    it("should have stack trace", () => {
      const error = new AppError("Test error");
      expect(error.stack).toBeDefined();
    });
  });

  describe("ValidationError", () => {
    it("should create ValidationError with fields", () => {
      const fields = { email: "Invalid email", password: "Too short" };
      const error = new ValidationError("Validation failed", fields);
      expect(error.message).toBe("Invalid input provided");
      expect(error.statusCode).toBe(400);
      expect(error.errorType).toBe("VALIDATION");
      expect(error.fields).toEqual(fields);
    });

    it("should handle empty fields object", () => {
      const error = new ValidationError("Validation failed");
      expect(error.fields).toEqual({});
    });
  });

  describe("NetworkError", () => {
    it("should create NetworkError with default message", () => {
      const error = new NetworkError();
      expect(error.message).toBe("Network request failed");
      expect(error.statusCode).toBe(503);
      expect(error.errorType).toBe("NETWORK");
    });

    it("should create NetworkError with custom message", () => {
      const error = new NetworkError("Connection timeout");
      expect(error.originalMessage).toBe("Connection timeout");
    });
  });

  describe("APIError", () => {
    it("should create APIError", () => {
      const error = new APIError("API request failed");
      expect(error.statusCode).toBe(500);
      expect(error.errorType).toBe("API");
    });

    it("should create APIError with custom status code", () => {
      const error = new APIError("Not found", 404);
      expect(error.statusCode).toBe(404);
    });
  });
});
