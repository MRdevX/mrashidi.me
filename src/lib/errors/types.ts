export interface ErrorContext {
  operation?: string;
  userId?: string;
  requestId?: string;
  timestamp?: string;
  [key: string]: unknown;
}

export interface SafeErrorResponse {
  error: {
    message: string;
    statusCode: number;
    type: string;
  };
  debug?: {
    originalMessage: string;
    stack?: string;
  };
}
