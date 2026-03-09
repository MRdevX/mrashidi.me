import { beforeEach, describe, expect, it, vi } from "vitest";
import { AppError, ValidationError } from "@/lib/errors";
import {
  asyncHandler,
  createSafeErrorResponse,
  getDetailedErrorMessage,
  getSafeErrorMessage,
  handleError,
  isOperationalError,
  logError,
} from "@/lib/errors/utils";

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

  describe("isOperationalError", () => {
    it("should return true for operational errors", () => {
      const error = new AppError("Test error", 500, true);
      expect(isOperationalError(error)).toBe(true);
    });

    it("should return false for non-operational errors", () => {
      const error = new AppError("Test error", 500, false);
      expect(isOperationalError(error)).toBe(false);
    });
  });

  describe("getSafeErrorMessage", () => {
    it("should return safe error message", () => {
      const error = new AppError("Test error", 500);
      const result = getSafeErrorMessage(error);
      expect(result).toBe(error.message);
    });
  });

  describe("getDetailedErrorMessage", () => {
    it("should return safe message in production", () => {
      const error = new AppError("Original error", 500);
      const result = getDetailedErrorMessage(error);
      expect(result).toBe(error.message);
    });
  });

  describe("asyncHandler", () => {
    it("should execute async function successfully", async () => {
      const fn = vi.fn().mockResolvedValue("success");
      const wrapped = asyncHandler(fn);
      const result = await wrapped("arg1", "arg2");
      expect(result).toBe("success");
      expect(fn).toHaveBeenCalledWith("arg1", "arg2");
    });

    it("should handle errors and convert to AppError", async () => {
      const fn = vi.fn().mockRejectedValue(new Error("Test error"));
      const wrapped = asyncHandler(fn);
      await expect(wrapped()).rejects.toThrow(AppError);
      const { logger } = await import("@/lib/core");
      expect(logger.error).toHaveBeenCalled();
    });

    it("should preserve AppError instances", async () => {
      const appError = new ValidationError("Validation failed");
      const fn = vi.fn().mockRejectedValue(appError);
      const wrapped = asyncHandler(fn);
      await expect(wrapped()).rejects.toThrow(ValidationError);
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
