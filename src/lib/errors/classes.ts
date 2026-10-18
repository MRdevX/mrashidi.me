import { isDevelopment } from "@/lib/core";

const SAFE_ERROR_MESSAGES = {
  DEFAULT: "An unexpected error occurred",
  VALIDATION: "Invalid input provided",
  NETWORK: "Network request failed",
  API: "API request failed",
  AUTHENTICATION: "Authentication failed",
  AUTHORIZATION: "Access denied",
  RATE_LIMIT: "Too many requests",
  SERVER_ERROR: "Internal server error",
} as const;

const ERROR_PATTERNS: Array<{ pattern: RegExp; message: string }> = [
  { pattern: /validation|invalid.*input|malformed/i, message: SAFE_ERROR_MESSAGES.VALIDATION },
  { pattern: /network|fetch|timeout|connection|econnrefused|enotfound/i, message: SAFE_ERROR_MESSAGES.NETWORK },
  {
    pattern: /unauthori[sz]ed|authentication|invalid credentials|\bjwt\b/i,
    message: SAFE_ERROR_MESSAGES.AUTHENTICATION,
  },
  { pattern: /forbidden|permission denied|access denied/i, message: SAFE_ERROR_MESSAGES.AUTHORIZATION },
  { pattern: /rate limit|too many|throttle|429/i, message: SAFE_ERROR_MESSAGES.RATE_LIMIT },
  { pattern: /api|endpoint|request failed|http error/i, message: SAFE_ERROR_MESSAGES.API },
];

type ErrorType = keyof typeof SAFE_ERROR_MESSAGES;

function sanitizeErrorMessage(message: string, errorType?: ErrorType): string {
  if (isDevelopment) {
    return message;
  }

  if (errorType) {
    return SAFE_ERROR_MESSAGES[errorType];
  }

  for (const { pattern, message: safeMessage } of ERROR_PATTERNS) {
    if (pattern.test(message)) {
      return safeMessage;
    }
  }

  return SAFE_ERROR_MESSAGES.DEFAULT;
}

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly originalMessage: string;
  public readonly errorType: ErrorType;

  constructor(message: string, statusCode: number = 500, errorType?: ErrorType) {
    super(sanitizeErrorMessage(message, errorType));

    this.statusCode = statusCode;
    this.originalMessage = message;
    this.errorType = errorType ?? "DEFAULT";

    Error.captureStackTrace(this, this.constructor);
  }
}

export class APIError extends AppError {
  constructor(message: string, statusCode: number = 500) {
    super(message, statusCode, "API");
  }
}

export class ValidationError extends AppError {
  public readonly fields: Record<string, string>;

  constructor(message: string, fields: Record<string, string> = {}) {
    super(message, 400, "VALIDATION");
    this.fields = fields;
  }
}

export class NetworkError extends AppError {
  constructor(message: string = "Network request failed") {
    super(message, 503, "NETWORK");
  }
}
