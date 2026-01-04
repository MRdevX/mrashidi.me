import { NextResponse } from "next/server";
import { describe, expect, it } from "vitest";
import { createErrorResponse, createSuccessResponse, createValidationErrorResponse } from "@/lib/api/response";
import { AppError, NetworkError, ValidationError } from "@/lib/errors";

describe("API Response Utilities", () => {
  describe("createSuccessResponse", () => {
    it("should create success response with data", async () => {
      const data = { id: 1, name: "Test" };
      const response = createSuccessResponse(data);
      expect(response).toBeInstanceOf(NextResponse);
      const body = await response.json();
      expect(body.success).toBe(true);
      expect(body.data).toEqual(data);
    });

    it("should create success response with meta", async () => {
      const data = { items: [] };
      const meta = { page: 1, limit: 10, total: 0 };
      const response = createSuccessResponse(data, meta);
      const body = await response.json();
      expect(body.success).toBe(true);
      expect(body.data).toEqual(data);
      expect(body.meta).toEqual(meta);
    });

    it("should create success response without meta", async () => {
      const data = { result: "ok" };
      const response = createSuccessResponse(data);
      const body = await response.json();
      expect(body.success).toBe(true);
      expect(body.data).toEqual(data);
      expect(body.meta).toBeUndefined();
    });
  });

  describe("createErrorResponse", () => {
    it("should create error response from AppError", async () => {
      const error = new AppError("Test error", 500);
      const response = createErrorResponse(error);
      expect(response).toBeInstanceOf(NextResponse);
      const body = await response.json();
      expect(body.success).toBe(false);
      expect(body.error).toBeDefined();
    });

    it("should create error response from regular Error", async () => {
      const error = new Error("Test error");
      const response = createErrorResponse(error, 400);
      expect(response).toBeInstanceOf(NextResponse);
      const body = await response.json();
      expect(body.success).toBe(false);
      expect(body.error).toBeDefined();
    });

    it("should include fields for ValidationError", async () => {
      const error = new ValidationError("Validation failed", {
        email: "Invalid email",
        password: "Too short",
      });
      const response = createErrorResponse(error);
      const body = await response.json();
      expect(body.success).toBe(false);
      expect(body.fields).toEqual({ email: "Invalid email", password: "Too short" });
    });

    it("should set correct status code", () => {
      const error = new NetworkError("Network failed");
      const response = createErrorResponse(error);
      expect(response.status).toBe(503);
    });

    it("should use default status code when not provided", () => {
      const error = new Error("Test error");
      const response = createErrorResponse(error);
      expect(response.status).toBe(500);
    });
  });

  describe("createValidationErrorResponse", () => {
    it("should create validation error response", async () => {
      const fields = { email: "Invalid email", password: "Required" };
      const response = createValidationErrorResponse(fields);
      expect(response).toBeInstanceOf(NextResponse);
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.success).toBe(false);
      expect(body.fields).toEqual(fields);
    });

    it("should handle empty fields object", async () => {
      const response = createValidationErrorResponse({});
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.fields).toEqual({});
    });
  });
});
