import { logger } from "./core";

interface FetcherOptions extends RequestInit {
  timeout?: number;
}

export async function fetcher<T = unknown>(url: string, options: FetcherOptions = {}): Promise<T> {
  const { timeout = 10000, ...fetchOptions } = options;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    logger.error({
      operation: "fetcher",
      url,
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}

export const fetcherGet = <T = unknown>(url: string) => fetcher<T>(url, { method: "GET" });

export const fetcherPost = <T = unknown>(url: string, data?: unknown) =>
  fetcher<T>(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: data ? JSON.stringify(data) : undefined,
  });
