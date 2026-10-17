"use client";

import dynamic from "next/dynamic";

// Loaded on first use so the AI SDK stays out of the home page's initial bundle.
export const AskCommandOutput = dynamic(
  () => import("@/features/ask-mr/ui/AskMrTerminalAnswer").then((m) => m.AskMrTerminalAnswer),
  { ssr: false, loading: () => <p className="mt-1 text-gray-500">ask-mr: connecting…</p> }
);
