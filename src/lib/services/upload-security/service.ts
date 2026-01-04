import { fileTypeFromBuffer } from "file-type";
import prettyBytes from "pretty-bytes";
import sanitize from "sanitize-filename";
import { logger } from "@/lib/core";

export interface FileValidationResult {
  isValid: boolean;
  sanitizedFileName: string;
  errors: string[];
}

export interface ValidationOptions {
  maxSize: number;
  allowedMimeTypes: string[];
  allowedExtensions: string[];
}

const DEFAULT_OPTIONS: ValidationOptions = {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedMimeTypes: ["application/pdf"],
  allowedExtensions: [".pdf"],
};

type ValidationRule = (file: File, options: ValidationOptions) => Promise<string | null> | string | null;

function sanitizeFileName(fileName: string): string {
  const sanitized = sanitize(fileName, { replacement: "_" });
  const maxLength = 255;
  return sanitized.length > maxLength ? sanitized.substring(0, maxLength) : sanitized;
}

const validationRules: ValidationRule[] = [
  // Check file size
  (file: File, options: ValidationOptions) =>
    file.size === 0
      ? "File is empty"
      : file.size > options.maxSize
        ? `File too large. Maximum size is ${prettyBytes(options.maxSize)}`
        : null,

  // Check file extension
  (file: File, options: ValidationOptions) => {
    const extension = file.name.toLowerCase().substring(file.name.lastIndexOf("."));
    return !options.allowedExtensions.includes(extension) ? `File extension '${extension}' is not allowed` : null;
  },

  // Check MIME type (async)
  async (file: File, options: ValidationOptions) => {
    try {
      const buffer = await file.slice(0, 4100).arrayBuffer();
      const fileType = await fileTypeFromBuffer(buffer);

      if (fileType && !options.allowedMimeTypes.includes(fileType.mime)) {
        return `File type '${fileType.mime}' is not allowed`;
      }

      if (!fileType) {
        return "Could not detect file type";
      }

      if (file.type && !options.allowedMimeTypes.includes(file.type)) {
        return `Declared file type '${file.type}' is not allowed`;
      }

      return null;
    } catch (error) {
      logger.error({
        operation: "mimeTypeValidation",
        error: error instanceof Error ? error.message : String(error),
      });
      return "Failed to validate file type";
    }
  },
];

async function collectValidationErrors(file: File | null, options: ValidationOptions): Promise<string[]> {
  if (!file) {
    return ["No file provided"];
  }

  const errors: string[] = [];

  for (const rule of validationRules) {
    const error = await rule(file, options);
    if (error) {
      errors.push(error);
    }
  }

  return errors;
}

export async function validateFile(
  file: File | null,
  options: Partial<ValidationOptions> = {}
): Promise<FileValidationResult> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const sanitizedFileName = file ? sanitizeFileName(file.name) : "";

  try {
    const errors = await collectValidationErrors(file, opts);
    const isValid = errors.length === 0;

    if (isValid) {
      logger.info({
        operation: "fileValidation",
        status: "success",
        fileName: file?.name,
        sanitizedFileName,
        fileSize: file?.size,
      });
    } else {
      logger.warn({
        operation: "fileValidation",
        status: "failed",
        fileName: file?.name,
        errors,
      });
    }

    return {
      isValid,
      sanitizedFileName,
      errors,
    };
  } catch (error) {
    logger.error({
      operation: "fileValidation",
      status: "failed",
      error: error instanceof Error ? error.message : String(error),
      fileName: file?.name,
      fileSize: file?.size,
    });

    return {
      isValid: false,
      sanitizedFileName,
      errors: ["File validation failed"],
    };
  }
}

export const pdfUploadSecurity = {
  validateFile: (file: File | null) => validateFile(file, DEFAULT_OPTIONS),
};
