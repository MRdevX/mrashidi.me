import { fileTypeFromBuffer } from "file-type";
import sanitize from "sanitize-filename";
import { logger } from "@/lib/core";

export interface FileValidationResult {
  isValid: boolean;
  sanitizedFileName: string;
  errors: string[];
}

export class FileUploadSecurityService {
  private readonly maxSize: number;
  private readonly allowedMimeTypes: string[];

  constructor(maxSize: number = 5 * 1024 * 1024, allowedMimeTypes: string[] = ["application/pdf"]) {
    this.maxSize = maxSize;
    this.allowedMimeTypes = allowedMimeTypes;
  }

  async validateFile(file: File): Promise<FileValidationResult> {
    const result: FileValidationResult = {
      isValid: true,
      sanitizedFileName: "",
      errors: [],
    };

    try {
      if (!file) {
        result.errors.push("No file provided");
        return result;
      }

      if (file.size === 0) {
        result.errors.push("File is empty");
      }

      if (file.size > this.maxSize) {
        result.errors.push(`File too large. Maximum size is ${this.formatBytes(this.maxSize)}`);
      }

      result.sanitizedFileName = this.sanitizeFileName(file.name);

      await this.validateMimeType(file, result);

      this.validateFileExtension(file.name, result);

      result.isValid = result.errors.length === 0;

      this.logValidationResult(file, result);

      return result;
    } catch (error) {
      logger.error({
        operation: "fileValidation",
        status: "failed",
        error: error instanceof Error ? error.message : String(error),
        fileName: file.name,
        fileSize: file.size,
      });

      result.isValid = false;
      result.errors.push("File validation failed");
      return result;
    }
  }

  private sanitizeFileName(fileName: string): string {
    const sanitized = sanitize(fileName, { replacement: "_" });

    const maxLength = 255;
    return sanitized.length > maxLength ? sanitized.substring(0, maxLength) : sanitized;
  }

  private async validateMimeType(file: File, result: FileValidationResult): Promise<void> {
    try {
      const buffer = await file.slice(0, 4100).arrayBuffer();
      const fileType = await fileTypeFromBuffer(buffer);

      if (fileType) {
        if (!this.allowedMimeTypes.includes(fileType.mime)) {
          result.errors.push(`File type '${fileType.mime}' is not allowed`);
        }
      } else {
        result.errors.push("Could not detect file type");
      }

      if (file.type && !this.allowedMimeTypes.includes(file.type)) {
        result.errors.push(`Declared file type '${file.type}' is not allowed`);
      }
    } catch (error) {
      result.errors.push("Failed to validate file type");
      logger.error({
        operation: "mimeTypeValidation",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  private validateFileExtension(fileName: string, result: FileValidationResult): void {
    const extension = fileName.toLowerCase().substring(fileName.lastIndexOf("."));
    const allowedExtensions = [".pdf"];

    if (!allowedExtensions.includes(extension)) {
      result.errors.push(`File extension '${extension}' is not allowed`);
    }
  }

  private logValidationResult(file: File, result: FileValidationResult): void {
    const logData = {
      operation: "fileValidation",
      status: result.isValid ? "success" : "failed",
      fileName: file.name,
      sanitizedFileName: result.sanitizedFileName,
      fileSize: file.size,
      errors: result.errors,
    };

    if (result.isValid) {
      logger.info(logData);
    } else {
      logger.warn(logData);
    }
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) {
      return "0 Bytes";
    }
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
  }
}

export const pdfUploadSecurity = new FileUploadSecurityService(5 * 1024 * 1024, ["application/pdf"]);
