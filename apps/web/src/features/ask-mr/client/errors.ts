import type { AskMrErrorBody, AskMrErrorCode } from "../types";

export interface AskMrClientError {
  code: AskMrErrorCode;
  message: string;
  retryAfter?: number;
}

const FALLBACK: AskMrClientError = { code: "server", message: "Ask MR hit a snag. Please try again." };

/** `useChat` errors carry the JSON body from `/api/chat` as their message for non-2xx responses. */
export function parseAskMrError(error: Error | undefined): AskMrClientError | null {
  if (!error) {
    return null;
  }
  try {
    const body = JSON.parse(error.message) as Partial<AskMrErrorBody>;
    if (body && typeof body.error === "string" && typeof body.message === "string") {
      return { code: body.error, message: body.message, retryAfter: body.retryAfter };
    }
  } catch {
    // Not JSON: a network failure or an in-stream error.
  }
  if (error.message === "Failed to fetch" || error.name === "TypeError") {
    return { code: "server", message: "Couldn't reach Ask MR. Check your connection and try again." };
  }
  return FALLBACK;
}
