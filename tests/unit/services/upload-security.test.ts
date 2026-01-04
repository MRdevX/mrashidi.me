import { beforeEach, describe, expect, it, vi } from "vitest";
import { pdfUploadSecurity, validateFile } from "@/lib/services/upload-security";

vi.mock("file-type", () => ({
  fileTypeFromBuffer: vi.fn(),
}));

vi.mock("@/lib/core", () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

describe("File Upload Security", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createMockFile = (name: string, size: number, type: string): File => {
    const blob = new Blob(["x".repeat(size)], { type });
    return new File([blob], name, { type });
  };

  describe("validateFile", () => {
    it("should validate valid PDF file", async () => {
      const { fileTypeFromBuffer } = await import("file-type");
      vi.mocked(fileTypeFromBuffer).mockResolvedValue({
        mime: "application/pdf",
        ext: "pdf",
      } as Awaited<ReturnType<typeof fileTypeFromBuffer>>);

      const file = createMockFile("test.pdf", 1024, "application/pdf");

      vi.spyOn(file, "slice").mockReturnValue({
        arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(1024)),
      } as unknown as Blob);

      const result = await validateFile(file);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.sanitizedFileName).toBe("test.pdf");
    });

    it("should reject empty file", async () => {
      const file = createMockFile("test.pdf", 0, "application/pdf");
      const result = await validateFile(file);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("File is empty");
    });

    it("should reject file exceeding max size", async () => {
      const file = createMockFile("test.pdf", 6 * 1024 * 1024, "application/pdf");
      const result = await validateFile(file, { maxSize: 5 * 1024 * 1024 });

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes("too large"))).toBe(true);
    });

    it("should reject file with invalid extension", async () => {
      const file = createMockFile("test.txt", 1024, "text/plain");
      const result = await validateFile(file);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes("extension"))).toBe(true);
    });

    it("should reject file with invalid MIME type", async () => {
      const { fileTypeFromBuffer } = await import("file-type");
      vi.mocked(fileTypeFromBuffer).mockResolvedValue({
        mime: "text/plain",
        ext: "txt",
      } as Awaited<ReturnType<typeof fileTypeFromBuffer>>);

      const file = createMockFile("test.pdf", 1024, "application/pdf");
      const result = await validateFile(file);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes("type"))).toBe(true);
    });

    it("should reject when file type cannot be detected", async () => {
      const { fileTypeFromBuffer } = await import("file-type");
      vi.mocked(fileTypeFromBuffer).mockResolvedValue(undefined);

      const file = createMockFile("test.pdf", 1024, "application/pdf");
      vi.spyOn(file, "slice").mockReturnValue({
        arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(1024)),
      } as unknown as Blob);

      const result = await validateFile(file);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes("detect"))).toBe(true);
    });

    it("should handle null file", async () => {
      const result = await validateFile(null);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("No file provided");
      expect(result.sanitizedFileName).toBe("");
    });

    it("should sanitize file name", async () => {
      const { fileTypeFromBuffer } = await import("file-type");
      vi.mocked(fileTypeFromBuffer).mockResolvedValue({
        mime: "application/pdf",
        ext: "pdf",
      } as Awaited<ReturnType<typeof fileTypeFromBuffer>>);

      const file = createMockFile("test file (1).pdf", 1024, "application/pdf");
      vi.spyOn(file, "slice").mockReturnValue({
        arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(1024)),
      } as unknown as Blob);

      const result = await validateFile(file);

      expect(result.isValid).toBe(true);

      expect(result.sanitizedFileName).toBeDefined();
      expect(result.sanitizedFileName.length).toBeLessThanOrEqual(255);
    });

    it("should truncate very long file names", async () => {
      const { fileTypeFromBuffer } = await import("file-type");
      vi.mocked(fileTypeFromBuffer).mockResolvedValue({
        mime: "application/pdf",
        ext: "pdf",
      } as Awaited<ReturnType<typeof fileTypeFromBuffer>>);

      const longName = `${"a".repeat(300)}.pdf`;
      const file = createMockFile(longName, 1024, "application/pdf");
      const result = await validateFile(file);

      expect(result.sanitizedFileName.length).toBeLessThanOrEqual(255);
    });

    it("should handle file type detection errors", async () => {
      const { fileTypeFromBuffer } = await import("file-type");
      vi.mocked(fileTypeFromBuffer).mockRejectedValue(new Error("Detection failed"));

      const file = createMockFile("test.pdf", 1024, "application/pdf");
      const result = await validateFile(file);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes("validate file type"))).toBe(true);
    });

    it("should use custom validation options", async () => {
      const { fileTypeFromBuffer } = await import("file-type");
      vi.mocked(fileTypeFromBuffer).mockResolvedValue({
        mime: "image/png",
        ext: "png",
      } as Awaited<ReturnType<typeof fileTypeFromBuffer>>);

      const file = createMockFile("test.png", 1024, "image/png");
      vi.spyOn(file, "slice").mockReturnValue({
        arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(1024)),
      } as unknown as Blob);

      const result = await validateFile(file, {
        maxSize: 2 * 1024 * 1024,
        allowedMimeTypes: ["image/png"],
        allowedExtensions: [".png"],
      });

      expect(result.isValid).toBe(true);
    });
  });

  describe("pdfUploadSecurity", () => {
    it("should validate file using default PDF options", async () => {
      const { fileTypeFromBuffer } = await import("file-type");
      vi.mocked(fileTypeFromBuffer).mockResolvedValue({
        mime: "application/pdf",
        ext: "pdf",
      } as Awaited<ReturnType<typeof fileTypeFromBuffer>>);

      const file = createMockFile("test.pdf", 1024, "application/pdf");
      vi.spyOn(file, "slice").mockReturnValue({
        arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(1024)),
      } as unknown as Blob);

      const result = await pdfUploadSecurity.validateFile(file);

      expect(result.isValid).toBe(true);
    });
  });
});
