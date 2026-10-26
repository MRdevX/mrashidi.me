"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { AskMrClientError } from "../client/errors";

interface ErrorBannerProps {
  error: AskMrClientError;
  onRetry: () => void;
  onNavigate: () => void;
}

function useCountdown(seconds: number | undefined): number {
  const [remaining, setRemaining] = useState(seconds ?? 0);
  useEffect(() => {
    setRemaining(seconds ?? 0);
    if (!seconds) {
      return;
    }
    const timer = window.setInterval(() => setRemaining((s) => (s <= 1 ? 0 : s - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [seconds]);
  return remaining;
}

export function ErrorBanner({ error, onRetry, onNavigate }: ErrorBannerProps) {
  const remaining = useCountdown(error.code === "rate_limited" ? error.retryAfter : undefined);
  const offline = error.code === "budget_exhausted" || error.code === "disabled";
  const canRetry = !offline && error.code !== "bot" && remaining === 0;

  return (
    <div
      role="alert"
      className="flex items-start gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-900 dark:text-amber-200"
    >
      <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />
      <div className="flex-1">
        <p>{error.message}</p>
        {remaining > 0 ? <p className="mt-1 font-terminal text-xs">Try again in {remaining}s</p> : null}
        {offline ? (
          <Link href="/contact" onClick={onNavigate} className="mt-1 inline-block font-medium underline">
            Contact Mahdi
          </Link>
        ) : null}
      </div>
      {canRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex min-h-9 items-center gap-1 rounded-md px-2 font-medium hover:bg-amber-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/60"
        >
          <RotateCcw className="size-3.5" aria-hidden />
          Retry
        </button>
      ) : null}
    </div>
  );
}
