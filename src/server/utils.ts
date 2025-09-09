import { APIError } from "@/lib/errors";

export async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeout: number = 10000
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw new APIError(`Request failed: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

export async function fetchJSON<T>(url: string, options: RequestInit = {}): Promise<T> {
  const response = await fetchWithTimeout(url, options);

  if (!response.ok) {
    throw new APIError(`HTTP ${response.status}: ${response.statusText}`);
  }

  try {
    return await response.json();
  } catch {
    throw new APIError("Failed to parse JSON response");
  }
}
