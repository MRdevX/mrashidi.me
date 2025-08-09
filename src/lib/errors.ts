export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class APIError extends AppError {
  constructor(message: string, statusCode: number = 500) {
    super(message, statusCode);
  }
}

export class ValidationError extends AppError {
  public readonly fields: Record<string, string>;

  constructor(message: string, fields: Record<string, string> = {}) {
    super(message, 400);
    this.fields = fields;
  }
}

export class NetworkError extends AppError {
  constructor(message: string = "Network request failed") {
    super(message, 503);
  }
}

export class ErrorHandler {
  static handle(error: unknown): AppError {
    if (error instanceof AppError) {
      return error;
    }

    if (error instanceof Error) {
      return new AppError(error.message);
    }

    return new AppError("An unexpected error occurred");
  }

  static log(error: AppError, context?: string): void {
    console.error(`[${context || "App"}] Error:`, {
      message: error.message,
      statusCode: error.statusCode,
      stack: error.stack,
    });
  }

  static isOperational(error: AppError): boolean {
    return error.isOperational;
  }
}

export function asyncHandler<T extends readonly unknown[], R>(fn: (...args: T) => Promise<R>): (...args: T) => Promise<R> {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args);
    } catch (error) {
      const appError = ErrorHandler.handle(error);
      ErrorHandler.log(appError);
      throw appError;
    }
  };
}
