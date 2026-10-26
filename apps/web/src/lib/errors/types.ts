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
