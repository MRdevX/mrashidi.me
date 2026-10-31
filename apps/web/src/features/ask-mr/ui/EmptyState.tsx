"use client";

import { firstName } from "@mrashidi/types";
import { Sparkles } from "lucide-react";
import { usePathname } from "next/navigation";
import { useContent } from "@/lib/content";
import { starterQuestions } from "../client/suggestions";
import { FollowUpChips } from "./FollowUpChips";

export function EmptyState({ onAsk }: { onAsk: (question: string) => void }) {
  const pathname = usePathname();
  const name = firstName(useContent().profile);

  return (
    <div className="flex h-full flex-col justify-end gap-4 pb-2">
      <div>
        <div className="mb-3 inline-flex size-10 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-brand-text">
          <Sparkles className="size-5" aria-hidden />
        </div>
        <p className="font-semibold text-gray-900 dark:text-white">Hi! I'm Ask MR.</p>
        <p className="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          Ask me anything about {name}'s experience, projects, skills or how to work with him. I answer from his
          published portfolio and can make mistakes.
        </p>
      </div>
      <FollowUpChips questions={starterQuestions(pathname, name)} onSelect={onAsk} label="Starter questions" />
    </div>
  );
}
