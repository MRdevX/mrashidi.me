/** Error codes returned by `/api/chat` as JSON (non-streamed) so the UI can show a specific message. */
export type AskMrErrorCode = "invalid" | "bot" | "rate_limited" | "budget_exhausted" | "disabled" | "server";

export interface AskMrErrorBody {
  error: AskMrErrorCode;
  message: string;
  /** Seconds until the visitor may try again (rate limits only). */
  retryAfter?: number;
}

export type AskMrFeedbackRating = "up" | "down";
