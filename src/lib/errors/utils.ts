import { isDevelopment, logger } from "@/lib/core";
import { AppError } from "./classes";
import type { SafeErrorResponse } from "./types";

export function handleError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error) {
    return new AppError(error.message, 500, "DEFAULT");
  }

  return new AppError("An unexpected error occurred", 500, "DEFAULT");
}

export function logError(error: AppError, context?: string): void {
  const logData: {
    message: string;
    originalMessage: string;
    statusCode: number;
    errorType: string;
    context: string;
    timestamp: string;
    stack?: string;
  } = {
    message: error.message,
    originalMessage: error.originalMessage,
    statusCode: error.statusCode,
    errorType: error.errorType,
    context: context || "App",
    timestamp: new Date().toISOString(),
  };

  if (isDevelopment) {
    logData.stack = error.stack;
  }

  logger.error(logData, `[${logData.context}] Error`);
}

export function createSafeErrorResponse(error: AppError): SafeErrorResponse {
  return {
    error: {
      message: error.message,
      statusCode: error.statusCode,
      type: error.errorType,
    },
    ...(isDevelopment && {
      debug: {
        originalMessage: error.originalMessage,
        stack: error.stack,
      },
    }),
  };
}
