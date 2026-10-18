import { beforeEach, describe, expect, it, vi } from "vitest";
import { AppError } from "@/lib/errors";
import { createSafeErrorResponse, handleError, logError } from "@/lib/errors/utils";

vi.mock("@/lib/core", () => ({
  logger: {
    error: vi.fn(),
  },
  isDevelopment: false,
}));

describe("Error Utilities", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("handleError", () => {
    it("should return AppError as-is", () => {
      const appError = new AppError("Test error", 400);
      const result = handleError(appError);
      expect(result).toBe(appError);
    });

    it("should convert Error to AppError", () => {
      const error = new Error("Test error");
      const result = handleError(error);
      expect(result).toBeInstanceOf(AppError);
      expect(result.message).toBe("An unexpected error occurred");
      expect(result.statusCode).toBe(500);
    });

    it("should handle unknown error types", () => {
      const unknownError = "String error";
      const result = handleError(unknownError);
      expect(result).toBeInstanceOf(AppError);
      expect(result.message).toBe("An unexpected error occurred");
    });

    it("should handle null", () => {
      const result = handleError(null);
      expect(result).toBeInstanceOf(AppError);
      expect(result.message).toBe("An unexpected error occurred");
    });
  });

  describe("logError", () => {
    it("should log error with context", async () => {
      const error = new AppError("Test error", 500);
      logError(error, "test-context");
      const { logger } = await import("@/lib/core");
      expect(logger.error).toHaveBeenCalled();
    });

    it("should log error without context", async () => {
      const error = new AppError("Test error", 500);
      logError(error);
      const { logger } = await import("@/lib/core");
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("createSafeErrorResponse", () => {
    it("should create safe error response in production", () => {
      const error = new AppError("Test error", 500);
      const result = createSafeErrorResponse(error);
      expect(result.error.message).toBe(error.message);
      expect(result.error.statusCode).toBe(500);
      expect(result.error.type).toBe("DEFAULT");
      expect(result.debug).toBeUndefined();
    });
  });
});
