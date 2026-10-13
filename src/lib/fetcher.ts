import ky, { type KyInstance } from "ky";
import { logger } from "./core";
import { APIError } from "./errors";

const api: KyInstance = ky.create({
  timeout: 10000,
  retry: {
    limit: 2,
    methods: ["get", "put", "head", "delete", "options", "trace"],
  },
  hooks: {
    beforeError: [
      ({ error, request }) => {
        logger.error({
          operation: "fetcher",
          url: request.url,
          error: error.message,
        });
        return error;
      },
    ],
  },
});

export async function fetchJSON<T>(url: string, options: RequestInit = {}): Promise<T> {
  try {
    return await api(url, options).json<T>();
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("timeout")) {
        throw new APIError(`Request timed out: ${url}`);
      }
      throw new APIError(`Request failed: ${error.message}`);
    }
    throw new APIError("Request failed: Unknown error");
  }
}
