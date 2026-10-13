"use client";

import { Sparkles } from "lucide-react";
import { ASK_MR_NAME } from "../constants";
import { useAskMr } from "./AskMrProvider";
import { FollowUpChips } from "./FollowUpChips";

const HERO_QUESTIONS = ["What's his strongest stack?", "Tell me about a project he led", "Is he open to work?"];

export function AskMrHeroCta() {
  const { enabled, open } = useAskMr();
  if (!enabled) {
    return null;
  }

  return (
    <div className="mt-6 flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={() => open({ source: "hero" })}
        aria-haspopup="dialog"
        className="ai-border group inline-flex min-h-11 w-fit items-center gap-2 rounded-full px-5 py-2.5 font-terminal text-sm font-semibold text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/70 focus-visible:ring-offset-2 dark:text-white dark:focus-visible:ring-offset-black"
      >
        <Sparkles className="size-4 text-orange-500 transition-transform group-hover:rotate-12" aria-hidden />
        {ASK_MR_NAME} anything
      </button>
      <FollowUpChips
        questions={HERO_QUESTIONS}
        onSelect={(question) => open({ source: "chip", prompt: question })}
        label={`Ask ${ASK_MR_NAME}`}
        className="justify-center"
      />
    </div>
  );
}
