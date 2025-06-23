// Standard API response wrapper
export interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    fromCache?: boolean;
  };
}

// Pagination response
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Error response
export interface ErrorResponse {
  success: false;
  error: string;
  statusCode: number;
  details?: Record<string, string>;
}

// Success response
export interface SuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}
