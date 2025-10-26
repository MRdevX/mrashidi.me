import ky, { type KyInstance } from "ky";
import { logger } from "./core";

// Create a ky instance with default configuration
const api: KyInstance = ky.create({
  timeout: 10000,
  retry: {
    limit: 2,
    methods: ["get", "put", "head", "delete", "options", "trace"],
  },
  hooks: {
    beforeError: [
      (error) => {
        logger.error({
          operation: "fetcher",
          url: error.request?.url,
          error: error.message,
        });
        return error;
      },
    ],
  },
});

export async function fetcher<T = unknown>(url: string, options?: RequestInit): Promise<T> {
  try {
    return await api(url, options).json<T>();
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
