import type { ErrorContext } from "./types";

const isDevelopment = process.env.NODE_ENV === "development";

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
  public readonly context?: ErrorContext;

  constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true,
    errorType?: string,
    context?: ErrorContext
  ) {
    const sanitizedMessage = sanitizeErrorMessage(message, errorType);
    super(sanitizedMessage);

    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.originalMessage = message;
    this.errorType = errorType || "DEFAULT";
    this.context = context;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class APIError extends AppError {
  constructor(message: string, statusCode: number = 500, context?: ErrorContext) {
    super(message, statusCode, true, "API", context);
  }
}

export class ValidationError extends AppError {
  public readonly fields: Record<string, string>;

  constructor(message: string, fields: Record<string, string> = {}, context?: ErrorContext) {
    super(message, 400, true, "VALIDATION", context);
    this.fields = fields;
  }
}

export class NetworkError extends AppError {
  constructor(message: string = "Network request failed", context?: ErrorContext) {
    super(message, 503, true, "NETWORK", context);
  }
}

export class DatabaseError extends AppError {
  constructor(message: string, context?: ErrorContext) {
    super(message, 500, true, "DATABASE", context);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = "Authentication failed", context?: ErrorContext) {
    super(message, 401, true, "AUTHENTICATION", context);
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = "Access denied", context?: ErrorContext) {
    super(message, 403, true, "AUTHORIZATION", context);
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = "Too many requests", context?: ErrorContext) {
    super(message, 429, true, "RATE_LIMIT", context);
  }
}
