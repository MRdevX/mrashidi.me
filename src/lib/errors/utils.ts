import { logger } from "@/lib/core";
import { AppError } from "./classes";
import type { SafeErrorResponse } from "./types";

const isDevelopment = process.env.NODE_ENV === "development";

export function handleError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error) {
    return new AppError(error.message, 500, true, "DEFAULT");
  }

  return new AppError("An unexpected error occurred", 500, true, "DEFAULT");
}

export function logError(error: AppError, context?: string): void {
  const logData: {
    message: string;
    originalMessage: string;
    statusCode: number;
    errorType: string;
    isOperational: boolean;
    context: string;
    timestamp: string;
    stack?: string;
  } = {
    message: error.message,
    originalMessage: error.originalMessage,
    statusCode: error.statusCode,
    errorType: error.errorType,
    isOperational: error.isOperational,
    context: context || "App",
    timestamp: new Date().toISOString(),
  };

  if (isDevelopment) {
    logData.stack = error.stack;
  }

  logger.error(logData, `[${logData.context}] Error`);
}

export function isOperationalError(error: AppError): boolean {
  return error.isOperational;
}

export function getSafeErrorMessage(error: AppError): string {
  return error.message;
}

export function getDetailedErrorMessage(error: AppError): string {
  if (isDevelopment) {
    return error.originalMessage;
  }
  return error.message;
}

export function asyncHandler<T extends readonly unknown[], R>(
  fn: (...args: T) => Promise<R>
): (...args: T) => Promise<R> {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args);
    } catch (error) {
      const appError = handleError(error);
      logError(appError);
      throw appError;
    }
  };
}

export function createSafeErrorResponse(error: AppError): SafeErrorResponse {
  return {
    error: {
      message: getSafeErrorMessage(error),
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
