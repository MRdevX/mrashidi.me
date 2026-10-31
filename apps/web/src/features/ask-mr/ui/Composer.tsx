"use client";

import { firstName } from "@mrashidi/types";
import { ArrowUp, Square } from "lucide-react";
import { type FormEvent, type KeyboardEvent, type RefObject, useLayoutEffect, useState } from "react";
import { useContent } from "@/lib/content";
import { ASK_MR_LIMITS } from "../constants";
import { VoiceButton } from "./VoiceButton";

interface ComposerProps {
  inputRef: RefObject<HTMLTextAreaElement | null>;
  isBusy: boolean;
  disabled?: boolean;
  onSend: (text: string) => void;
  onStop: () => void;
}

const MAX_HEIGHT = 140;

export function Composer({ inputRef, isBusy, disabled, onSend, onStop }: ComposerProps) {
  const [draft, setDraft] = useState("");
  const name = firstName(useContent().profile);
  const remaining = ASK_MR_LIMITS.maxMessageChars - draft.length;

  // biome-ignore lint/correctness/useExhaustiveDependencies: re-measure whenever the draft changes
  useLayoutEffect(() => {
    const el = inputRef.current;
    if (!el) {
      return;
    }
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, MAX_HEIGHT)}px`;
  }, [draft, inputRef]);

  const submit = (event?: FormEvent) => {
    event?.preventDefault();
    if (isBusy || disabled || !draft.trim()) {
      return;
    }
    onSend(draft);
    setDraft("");
  };

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      submit();
    }
  };

  return (
    <form onSubmit={submit} className="border-t border-gray-200 p-3 dark:border-white/10">
      <div className="flex items-end gap-1 rounded-xl border border-gray-300 bg-white px-2 py-1.5 transition-colors focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/25 dark:border-white/15 dark:bg-black/40">
        <label htmlFor="ask-mr-input" className="sr-only">
          Ask a question about {name}
        </label>
        <textarea
          id="ask-mr-input"
          ref={inputRef}
          rows={1}
          value={draft}
          maxLength={ASK_MR_LIMITS.maxMessageChars}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={onKeyDown}
          placeholder={`Ask about ${name}'s work…`}
          disabled={disabled}
          enterKeyHint="send"
          autoComplete="off"
          className="max-h-[140px] min-h-10 flex-1 resize-none bg-transparent px-1.5 py-2 text-base text-gray-900 outline-none placeholder:text-gray-400 disabled:cursor-not-allowed sm:text-sm dark:text-gray-100"
        />
        <VoiceButton baseText={draft} onTranscript={setDraft} disabled={isBusy || disabled} />
        {isBusy ? (
          <button
            type="button"
            onClick={onStop}
            aria-label="Stop generating"
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-gray-900 text-white transition-colors hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
          >
            <Square className="size-3.5 fill-current" aria-hidden />
          </button>
        ) : (
          <button
            type="submit"
            aria-label="Send"
            disabled={!draft.trim() || disabled}
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary text-white shadow-[0_0_16px_-4px_hsl(var(--primary)/0.8)] transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 disabled:bg-gray-300 disabled:shadow-none dark:disabled:bg-white/10"
          >
            <ArrowUp className="size-4" aria-hidden />
          </button>
        )}
      </div>
      <div className="mt-1.5 flex justify-between px-1 text-[11px] text-gray-500">
        <span>AI answers from {name}'s portfolio · may be inaccurate</span>
        {remaining < 200 ? (
          <span aria-live="polite" className={remaining < 50 ? "text-amber-600" : undefined}>
            {remaining}
          </span>
        ) : null}
      </div>
    </form>
  );
}
