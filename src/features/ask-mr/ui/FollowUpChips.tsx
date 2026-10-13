"use client";

import { cn } from "@/lib/utils";

interface FollowUpChipsProps {
  questions: string[];
  onSelect: (question: string) => void;
  disabled?: boolean;
  label?: string;
  className?: string;
}

export function FollowUpChips({
  questions,
  onSelect,
  disabled,
  label = "Suggested questions",
  className,
}: FollowUpChipsProps) {
  if (questions.length === 0) {
    return null;
  }
  return (
    <ul aria-label={label} className={cn("flex flex-wrap gap-2", className)}>
      {questions.map((question) => (
        <li key={question}>
          <button
            type="button"
            disabled={disabled}
            onClick={() => onSelect(question)}
            className="min-h-9 rounded-full border border-orange-500/30 bg-orange-500/5 px-3 py-1.5 text-left text-xs text-orange-700 transition-colors hover:border-orange-500 hover:bg-orange-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/60 disabled:cursor-not-allowed disabled:opacity-50 dark:text-orange-300"
          >
            {question}
          </button>
        </li>
      ))}
    </ul>
  );
}
