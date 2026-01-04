import ky from "ky";
import { APIError } from "@/lib/errors";

const httpClient = ky.create({
  timeout: 10000,
  retry: {
    limit: 2,
    methods: ["get"],
  },
});

export async function fetchJSON<T>(url: string, options: RequestInit = {}): Promise<T> {
  try {
    return await httpClient(url, options).json<T>();
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
