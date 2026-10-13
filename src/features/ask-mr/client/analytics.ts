import { track } from "@vercel/analytics";

export type AskMrOpenSource = "launcher" | "hero" | "shortcut" | "chip" | "terminal";

type AskMrEvent =
  | { name: "ask_mr_open"; props: { source: AskMrOpenSource } }
  | { name: "ask_mr_send"; props: { suggested: boolean } }
  | { name: "ask_mr_tool_click"; props: { tool: string } }
  | { name: "ask_mr_feedback"; props: { rating: "up" | "down" } };

/** Usage events only; never includes message content. */
export function trackAskMr<E extends AskMrEvent>(name: E["name"], props: E["props"]): void {
  try {
    track(name, props);
  } catch {
    // Analytics must never break the chat.
  }
}
