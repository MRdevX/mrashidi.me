import { APIError, NetworkError, ErrorHandler } from "@/lib/errors";

/**
 * Base service class providing common functionality
 */
export abstract class BaseService {
  protected async fetchWithTimeout(url: string, options: RequestInit = {}, timeout: number = 10000): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new APIError(`HTTP ${response.status}: ${response.statusText}`, response.status);
      }

      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === "AbortError") {
        const netErr = new NetworkError("Request timeout");
        ErrorHandler.log(netErr, "BaseService.fetchWithTimeout");
        throw netErr;
      }
      const appError = ErrorHandler.handle(error);
      ErrorHandler.log(appError, "BaseService.fetchWithTimeout");
      throw appError;
    }
  }

  protected async fetchJSON<T>(url: string, options: RequestInit = {}): Promise<T> {
    try {
      const response = await this.fetchWithTimeout(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      });
      return await response.json();
    } catch (error) {
      const appError = ErrorHandler.handle(error);
      ErrorHandler.log(appError, "BaseService.fetchJSON");
      throw new APIError("Failed to parse JSON response");
    }
  }

  protected validateRequiredFields(data: Record<string, unknown>, fields: string[]): void {
    const missingFields = fields.filter((field) => !data[field]);
    if (missingFields.length > 0) {
      const err = new APIError(`Missing required fields: ${missingFields.join(", ")}`, 400);
      ErrorHandler.log(err, "BaseService.validateRequiredFields");
      throw err;
    }
  }

  protected logError(error: unknown, context: string): void {
    const appError = ErrorHandler.handle(error);
    ErrorHandler.log(appError, context);
  }

  protected logInfo(message: string, data?: unknown): void {
    console.log(`[${this.constructor.name}] ${message}`, data || "");
  }
}
