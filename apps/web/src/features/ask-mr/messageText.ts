import type { UIMessage } from "ai";

/** Concatenated text parts of a message (tool parts excluded). */
export function messageText(message: Pick<UIMessage, "parts">): string {
  return message.parts
    .filter((part): part is { type: "text"; text: string } => part.type === "text")
    .map((part) => part.text)
    .join("");
}
