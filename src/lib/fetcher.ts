import { logger } from "./utils/logger";

interface FetcherOptions extends RequestInit {
  timeout?: number;
  retries?: number;
}

interface CacheOptions {
  ttl?: number;
  key?: string;
}

class FetcherError extends Error {
  constructor(
    message: string,
    public status: number,
    public statusText: string,
    public url: string
  ) {
    super(message);
    this.name = "FetcherError";
  }
}

const cache = new Map<string, { data: unknown; timestamp: number; ttl: number }>();

export async function fetcher<T = unknown>(
  url: string,
  options: FetcherOptions = {},
  cacheOptions?: CacheOptions
): Promise<T> {
  const { timeout = 10000, retries = 3, ...fetchOptions } = options;

  if (cacheOptions?.key) {
    const cached = cache.get(cacheOptions.key);
    if (cached && Date.now() - cached.timestamp < cached.ttl * 1000) {
      return cached.data as T;
    }
  }

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new FetcherError(`HTTP ${response.status}: ${response.statusText}`, response.status, response.statusText, url);
      }

      const data = await response.json();

      if (cacheOptions?.key && cacheOptions.ttl) {
        cache.set(cacheOptions.key, {
          data,
          timestamp: Date.now(),
          ttl: cacheOptions.ttl,
        });
      }

      return data;
    } catch (error) {
      lastError = error as Error;

      if (error instanceof FetcherError) {
        if (error.status >= 400 && error.status < 500) {
          throw error;
        }
      }

      if (attempt === retries) {
        logger.error({
          message: `Fetcher failed after ${retries} attempts`,
          url,
          error: lastError.message,
          attempt,
        });
        throw lastError;
      }

      const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

export const fetcherGet = <T = unknown>(url: string, cacheOptions?: CacheOptions) =>
  fetcher<T>(url, { method: "GET" }, cacheOptions);

export const fetcherPost = <T = unknown>(url: string, data?: unknown, options?: FetcherOptions) =>
  fetcher<T>(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    body: data ? JSON.stringify(data) : undefined,
    ...options,
  });

export const fetcherPut = <T = unknown>(url: string, data?: unknown, options?: FetcherOptions) =>
  fetcher<T>(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    body: data ? JSON.stringify(data) : undefined,
    ...options,
  });

export const fetcherDelete = <T = unknown>(url: string, options?: FetcherOptions) =>
  fetcher<T>(url, { method: "DELETE", ...options });

export const clearCache = (key?: string) => {
  if (key) {
    cache.delete(key);
  } else {
    cache.clear();
  }
};
