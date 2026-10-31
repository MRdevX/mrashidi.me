"use client";

import { ArrowDown } from "lucide-react";
import { type ReactNode, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

const STICKY_THRESHOLD_PX = 48;

interface MessageListProps {
  children: ReactNode;
  /** Changes whenever content grows (message count, streamed length). */
  contentKey: string;
  /** Changes when the visitor sends a message; always scrolls to the bottom. */
  sendKey: number;
}

export function MessageList({ children, contentKey, sendKey }: MessageListProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [atBottom, setAtBottom] = useState(true);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "auto") => {
    const el = ref.current;
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior });
    }
  }, []);

  const onScroll = () => {
    const el = ref.current;
    if (el) {
      setAtBottom(el.scrollHeight - el.scrollTop - el.clientHeight < STICKY_THRESHOLD_PX);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: contentKey is the trigger
  useLayoutEffect(() => {
    if (atBottom) {
      scrollToBottom();
    }
  }, [contentKey, atBottom, scrollToBottom]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: sendKey is the trigger
  useEffect(() => {
    setAtBottom(true);
    scrollToBottom();
  }, [sendKey, scrollToBottom]);

  return (
    <div className="relative min-h-0 flex-1">
      <div
        ref={ref}
        onScroll={onScroll}
        role="log"
        aria-live="off"
        aria-label="Conversation with Ask MR"
        className="h-full space-y-5 overflow-y-auto overscroll-contain px-4 py-4"
      >
        {children}
      </div>
      {atBottom ? null : (
        <button
          type="button"
          onClick={() => scrollToBottom("smooth")}
          className="absolute bottom-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-md hover:text-brand-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 dark:border-white/10 dark:bg-gray-900 dark:text-gray-200"
        >
          <ArrowDown className="size-3.5" aria-hidden />
          Jump to latest
        </button>
      )}
    </div>
  );
}
