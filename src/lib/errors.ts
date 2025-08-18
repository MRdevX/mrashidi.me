const isDevelopment = process.env.NODE_ENV === "development";
const isProduction = process.env.NODE_ENV === "production";

const SAFE_ERROR_MESSAGES = {
  DEFAULT: "An unexpected error occurred",
  VALIDATION: "Invalid input provided",
  NETWORK: "Network request failed",
  API: "API request failed",
  DATABASE: "Database operation failed",
  AUTHENTICATION: "Authentication failed",
  AUTHORIZATION: "Access denied",
  RATE_LIMIT: "Too many requests",
  SERVER_ERROR: "Internal server error",
} as const;

function sanitizeErrorMessage(message: string, errorType?: string): string {
  if (isDevelopment) {
    return message;
  }

  if (errorType && SAFE_ERROR_MESSAGES[errorType as keyof typeof SAFE_ERROR_MESSAGES]) {
    return SAFE_ERROR_MESSAGES[errorType as keyof typeof SAFE_ERROR_MESSAGES];
  }

  if (message.toLowerCase().includes("validation")) {
    return SAFE_ERROR_MESSAGES.VALIDATION;
  }
  if (message.toLowerCase().includes("network") || message.toLowerCase().includes("fetch")) {
    return SAFE_ERROR_MESSAGES.NETWORK;
  }
  if (message.toLowerCase().includes("database") || message.toLowerCase().includes("sql")) {
    return SAFE_ERROR_MESSAGES.DATABASE;
  }
  if (message.toLowerCase().includes("auth") || message.toLowerCase().includes("login")) {
    return SAFE_ERROR_MESSAGES.AUTHENTICATION;
  }
  if (message.toLowerCase().includes("permission") || message.toLowerCase().includes("access")) {
    return SAFE_ERROR_MESSAGES.AUTHORIZATION;
  }
  if (message.toLowerCase().includes("rate limit") || message.toLowerCase().includes("too many")) {
    return SAFE_ERROR_MESSAGES.RATE_LIMIT;
  }

  return SAFE_ERROR_MESSAGES.DEFAULT;
}

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly originalMessage: string;
  public readonly errorType: string;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true, errorType?: string) {
    const sanitizedMessage = sanitizeErrorMessage(message, errorType);
    super(sanitizedMessage);

    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.originalMessage = message;
    this.errorType = errorType || "DEFAULT";

    Error.captureStackTrace(this, this.constructor);
  }
}

export class APIError extends AppError {
  constructor(message: string, statusCode: number = 500) {
    super(message, statusCode, true, "API");
  }
}

export class ValidationError extends AppError {
  public readonly fields: Record<string, string>;

  constructor(message: string, fields: Record<string, string> = {}) {
    super(message, 400, true, "VALIDATION");
    this.fields = fields;
  }
}

export class NetworkError extends AppError {
  constructor(message: string = "Network request failed") {
    super(message, 503, true, "NETWORK");
  }
}

export class DatabaseError extends AppError {
  constructor(message: string) {
    super(message, 500, true, "DATABASE");
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = "Authentication failed") {
    super(message, 401, true, "AUTHENTICATION");
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = "Access denied") {
    super(message, 403, true, "AUTHORIZATION");
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = "Too many requests") {
    super(message, 429, true, "RATE_LIMIT");
  }
}

export class ErrorHandler {
  static handle(error: unknown): AppError {
    if (error instanceof AppError) {
      return error;
    }

    if (error instanceof Error) {
      return new AppError(error.message, 500, true, "DEFAULT");
    }

    return new AppError("An unexpected error occurred", 500, true, "DEFAULT");
  }

  static log(error: AppError, context?: string): void {
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

    console.error(`[${logData.context}] Error:`, logData);

    if (isProduction) {
      // TODO: Implement external logging service integration (Sentry, LogRocket, etc.)
    }
  }

  static isOperational(error: AppError): boolean {
    return error.isOperational;
  }

  static getSafeMessage(error: AppError): string {
    return error.message;
  }

  static getDetailedMessage(error: AppError): string {
    if (isDevelopment) {
      return error.originalMessage;
    }
    return error.message;
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

export function createSafeErrorResponse(error: AppError) {
  return {
    error: {
      message: ErrorHandler.getSafeMessage(error),
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
