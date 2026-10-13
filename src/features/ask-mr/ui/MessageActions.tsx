"use client";

import { Check, Copy, RotateCcw, ThumbsDown, ThumbsUp } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { trackAskMr } from "../client/analytics";
import type { AskMrFeedbackRating } from "../types";

interface MessageActionsProps {
  text: string;
  messageId: string;
  conversationId: string;
  onRegenerate?: () => void;
}

const iconButton =
  "inline-flex size-8 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-black/5 hover:text-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/60 dark:hover:bg-white/10 dark:hover:text-orange-400";

export function MessageActions({ text, messageId, conversationId, onRegenerate }: MessageActionsProps) {
  const [copied, setCopied] = useState(false);
  const [rating, setRating] = useState<AskMrFeedbackRating | null>(null);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard can be unavailable (permissions, insecure context); nothing useful to show.
    }
  };

  const rate = (value: AskMrFeedbackRating) => {
    if (rating === value) {
      return;
    }
    setRating(value);
    trackAskMr("ask_mr_feedback", { rating: value });
    void fetch("/api/chat/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversationId, messageId, rating: value }),
    }).catch(() => undefined);
  };

  return (
    <div className="mt-1.5 flex items-center gap-0.5 opacity-80 transition-opacity hover:opacity-100">
      <button type="button" className={iconButton} onClick={copy} aria-label={copied ? "Copied" : "Copy answer"}>
        {copied ? <Check className="size-3.5" aria-hidden /> : <Copy className="size-3.5" aria-hidden />}
      </button>
      {onRegenerate ? (
        <button type="button" className={iconButton} onClick={onRegenerate} aria-label="Regenerate answer">
          <RotateCcw className="size-3.5" aria-hidden />
        </button>
      ) : null}
      <button
        type="button"
        className={cn(iconButton, rating === "up" && "text-orange-600 dark:text-orange-400")}
        onClick={() => rate("up")}
        aria-label="Helpful answer"
        aria-pressed={rating === "up"}
      >
        <ThumbsUp className="size-3.5" aria-hidden />
      </button>
      <button
        type="button"
        className={cn(iconButton, rating === "down" && "text-orange-600 dark:text-orange-400")}
        onClick={() => rate("down")}
        aria-label="Unhelpful answer"
        aria-pressed={rating === "down"}
      >
        <ThumbsDown className="size-3.5" aria-hidden />
      </button>
      {rating ? (
        <span className="ml-1 text-[11px] text-gray-500" role="status">
          Thanks for the feedback
        </span>
      ) : null}
    </div>
  );
}
